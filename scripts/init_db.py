"""
Initialize the Medic-Taste database on a new computer.
Creates the database, tables, and loads seed data.

Usage:
    python scripts/init_db.py
    python scripts/init_db.py --user root --password 1234
    python scripts/init_db.py --schema-only
    python scripts/init_db.py --force
"""

import argparse
import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_DIR = os.path.join(BASE_DIR, "database")
ENV_FILE = os.path.join(BASE_DIR, "backend", ".env")

SCHEMA_FILE = os.path.join(DATABASE_DIR, "schema.sql")
SEED_FILE = os.path.join(DATABASE_DIR, "seed.sql")
SEED_MAS_FILE = os.path.join(DATABASE_DIR, "seed_mas_recetas.sql")
AGREGAR_INGREDIENTES_FILE = os.path.join(DATABASE_DIR, "agregar_ingredientes_steps.sql")
FIX_MISSING_FILE = os.path.join(DATABASE_DIR, "fix_missing_ingredients.sql")


def load_env():
    """Load backend/.env file and return as dict."""
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    env[key.strip()] = val.strip()
    return env


def run_sql_file(file_path, user, password, database="medic_taste", verbose=False):
    """Execute a SQL file against MySQL."""
    if not os.path.exists(file_path):
        print(f"  [SKIP] {os.path.basename(file_path)} not found")
        return True

    cmd = ["mysql", f"-u{user}"]
    if password:
        cmd.append(f"-p{password}")
    cmd.append(database)

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            sql = f.read()

        proc = subprocess.run(cmd, input=sql, capture_output=True, text=True)
        if proc.returncode != 0:
            print(f"  [ERROR] {os.path.basename(file_path)}: {proc.stderr.strip()}")
            return False
        if verbose:
            print(f"  [OK] {os.path.basename(file_path)} executed successfully")
        return True
    except FileNotFoundError:
        print("  [ERROR] MySQL client not found. Make sure MySQL is installed and in PATH.")
        return False


def main():
    env = load_env()

    parser = argparse.ArgumentParser(description="Initialize Medic-Taste database")
    parser.add_argument("--user", default=env.get("DB_USER", "root"), help="MySQL user (default: from .env or root)")
    parser.add_argument("--password", default=env.get("DB_PASSWORD", ""), help="MySQL password (default: from .env)")
    parser.add_argument("--database", default=env.get("DB_NAME", "medic_taste"), help="Database name (default: from .env)")
    parser.add_argument("--schema-only", action="store_true", help="Only create schema, no seed data")
    parser.add_argument("--force", action="store_true", help="Drop and recreate database from scratch")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    args = parser.parse_args()

    print("=" * 50)
    print("  Medic-Taste Database Initialization")
    print("=" * 50)
    print()

    if args.force:
        print("[1/4] Dropping existing database...")
        cmd = ["mysql", f"-u{args.user}"]
        if args.password:
            cmd.append(f"-p{args.password}")
        cmd += ["-e", f"DROP DATABASE IF EXISTS {args.database}"]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0:
            print(f"  [ERROR] {proc.stderr.strip()}")
            sys.exit(1)
        print("  Done.")
    else:
        print("[1/4] Checking if database exists...")
        cmd = ["mysql", f"-u{args.user}"]
        if args.password:
            cmd.append(f"-p{args.password}")
        cmd += ["-e", f"CREATE DATABASE IF NOT EXISTS {args.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0:
            print(f"  [ERROR] {proc.stderr.strip()}")
            sys.exit(1)
        print("  Database ready.")

    print()
    print("[2/4] Creating tables...")
    if not run_sql_file(SCHEMA_FILE, args.user, args.password, args.database, args.verbose):
        sys.exit(1)
    print("  Tables created.")

    if args.schema_only:
        print()
        print("Schema-only mode. Done.")
        return

    print()
    print("[3/4] Loading seed data...")
    run_sql_file(SEED_FILE, args.user, args.password, args.database, args.verbose)
    run_sql_file(SEED_MAS_FILE, args.user, args.password, args.database, args.verbose)
    print("  Seed data loaded.")

    print()
    print("[4/4] Running fix scripts...")
    run_sql_file(AGREGAR_INGREDIENTES_FILE, args.user, args.password, args.database, args.verbose)
    run_sql_file(FIX_MISSING_FILE, args.user, args.password, args.database, args.verbose)
    print("  Fixes applied.")

    print()
    print("=" * 50)
    print("  Database initialized successfully!")
    print("=" * 50)


if __name__ == "__main__":
    main()
