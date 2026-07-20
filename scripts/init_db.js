/**
 * Initialize the Medic-Taste database.
 * Creates tables and loads seed data using @libsql/client (Turso/SQLite).
 *
 * Usage:
 *   node scripts/init_db.js                              # Uses TURSO_DB_URL from .env
 *   TURSO_DB_URL=file:./medic-taste.db node scripts/init_db.js
 *   node scripts/init_db.js --schema-only
 *   node scripts/init_db.js --seed-only
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const BACKEND_DIR = path.join(BASE_DIR, 'backend');
const DATABASE_DIR = path.join(BASE_DIR, 'database');

const { createClient } = require(path.join(BACKEND_DIR, 'node_modules', '@libsql/client'));
const dotenv = require(path.join(BACKEND_DIR, 'node_modules', 'dotenv'));

dotenv.config({ path: path.join(BASE_DIR, 'backend', '.env') });

const SCHEMA_FILE = path.join(DATABASE_DIR, 'schema.sql');
const SEED_FILE = path.join(DATABASE_DIR, 'seed.sql');
const SEED_MAS_FILE = path.join(DATABASE_DIR, 'seed_mas_recetas.sql');
const AGREGAR_INGREDIENTES_FILE = path.join(DATABASE_DIR, 'agregar_ingredientes_steps.sql');
const FIX_MISSING_FILE = path.join(DATABASE_DIR, 'fix_missing_ingredients.sql');

const args = process.argv.slice(2);
const schemaOnly = args.includes('--schema-only');
const seedOnly = args.includes('--seed-only');

function loadSqlFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`  [SKIP] ${path.basename(filePath)} not found`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function transformMySQLtoSQLite(sql) {
  let transformed = sql;

  // Remove MySQL USE statements
  transformed = transformed.replace(/^USE\s+\w+\s*;?\s*$/gim, '');

  // INSERT IGNORE INTO → INSERT OR IGNORE INTO
  transformed = transformed.replace(/INSERT\s+IGNORE\s+INTO/gi, 'INSERT OR IGNORE INTO');

  // CURDATE() + N → date('now', '+N day')
  transformed = transformed.replace(/CURDATE\(\)\s*\+\s*(\d+)/gi, (_, days) => {
    return `date('now', '+${days} day')`;
  });

  // CURDATE() → date('now')
  transformed = transformed.replace(/CURDATE\(\)/gi, "date('now')");

  // SELECT CONCAT(...) AS ... → SQLite uses ||
  transformed = transformed.replace(
    /SELECT\s+CONCAT\(([^)]+)\)\s+AS\s+(\w+)/gi,
    (_, args, alias) => {
      const parts = args.split(',').map(p => p.trim());
      return `SELECT ${parts.join(" || ")} AS ${alias}`;
    }
  );

  return transformed;
}

function splitStatements(sql) {
  const cleaned = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');

  return cleaned
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

async function runSqlFile(db, filePath, label, transform = false) {
  let sql = loadSqlFile(filePath);
  if (!sql) return true;

  if (transform) {
    sql = transformMySQLtoSQLite(sql);
  }

  const statements = splitStatements(sql);
  let success = true;

  for (const stmt of statements) {
    try {
      await db.execute(stmt);
    } catch (err) {
      if (!err.message.includes('already exists')) {
        console.error(`  [ERROR] ${label}: ${err.message}`);
        console.error(`  Statement: ${stmt.substring(0, 120)}...`);
        success = false;
      }
    }
  }

  console.log(`  [OK] ${label} executed successfully`);
  return success;
}

async function main() {
  const dbUrl = process.env.TURSO_DB_URL;
  if (!dbUrl) {
    console.error('Error: TURSO_DB_URL not set. Set it in backend/.env or as env variable.');
    process.exit(1);
  }

  const db = createClient({
    url: dbUrl,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });

  console.log('='.repeat(50));
  console.log('  Medic-Taste Database Initialization');
  console.log(`  URL: ${dbUrl}`);
  console.log('='.repeat(50));
  console.log();

  if (!seedOnly) {
    console.log('[1/2] Creating tables...');
    if (!await runSqlFile(db, SCHEMA_FILE, 'schema.sql', true)) {
      process.exit(1);
    }
    console.log('  Tables created.');
  }

  if (schemaOnly) {
    console.log();
    console.log('Schema-only mode. Done.');
    return;
  }

  // Disable foreign key checks during seeding (seed data has ID ordering dependencies)
  await db.execute('PRAGMA foreign_keys = OFF');

  console.log();
  console.log('[2/2] Loading seed data...');
  await runSqlFile(db, SEED_FILE, 'seed.sql', true);
  await runSqlFile(db, SEED_MAS_FILE, 'seed_mas_recetas.sql', true);
  await runSqlFile(db, AGREGAR_INGREDIENTES_FILE, 'agregar_ingredientes_steps.sql', true);
  await runSqlFile(db, FIX_MISSING_FILE, 'fix_missing_ingredients.sql', true);

  // Re-enable foreign keys after seeding
  await db.execute('PRAGMA foreign_keys = ON');

  console.log('  Seed data loaded.');

  console.log();
  console.log('='.repeat(50));
  console.log('  Database initialized successfully!');
  console.log('='.repeat(50));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
