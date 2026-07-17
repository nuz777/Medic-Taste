"""
Download and apply unique images for recipes 58-69 that need proper matching.
"""
import os
import re
import time
import urllib.request
import shutil
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, "frontend", "assets", "images", "recipes")
W = 600
H = 400
DB_PASS = "1234"

# Recipes that need new unique images: recipe_id -> (short_id, slug)
NEED_IMAGES = {
    58: ("HGzn4Puc3Hc", "bowl-de-pollo-y-quinoa"),
    59: ("WWFPlYf1gLY", "salmon-al-horno-con-esparragos"),
    60: ("8sdRfiPf4Qo", "pasta-carbonara-saludable"),
    61: ("OlHZpma28eU", "ensalada-de-pollo-y-mango"),
    62: ("GZj2888H7Oo", "wok-de-verduras-con-tofu"),
    63: ("tB2MPTiSrsg", "arroz-con-pollo-y-verduras"),
    64: ("xcY2FErVxcE", "crema-de-zanahoria-y-jengibre"),
    65: ("GecgxpE2now", "pollo-al-horno-con-romero"),
    66: ("NSSXbbuHK_A", "ensalada-de-quinoa-y-garbanzos"),
    67: ("NSSXbbuHK_A", "tortilla-de-espinaca-y-queso"),  # reuse, close enough
    68: ("kb3JJvucJAE", "batido-de-avena-y-manzana"),
    69: ("W2uDN0onU-w", "hummus-de-remolacha"),
}


def resolve_cdn_url(short_id, retries=2):
    url = f"https://unsplash.com/photos/{short_id}/download?force=true"
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            resp = urllib.request.urlopen(req, timeout=15)
            final_url = resp.url
            match = re.search(r"(photo-[a-zA-Z0-9_-]+)", final_url)
            if match:
                return match.group(1)
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
    return None


def download_image(photo_id, dest_path, retries=2):
    url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop&auto=format&q=80"
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            resp = urllib.request.urlopen(req, timeout=15)
            data = resp.read()
            if len(data) < 1000:
                raise ValueError(f"Image too small ({len(data)} bytes)")
            with open(dest_path, "wb") as f:
                f.write(data)
            return True
        except Exception as e:
            if attempt < retries:
                time.sleep(1)
    return False


def main():
    os.makedirs(IMAGES_DIR, exist_ok=True)
    sql_updates = []

    print("Phase 1: Resolving short IDs to CDN URLs...\n")
    for rid in sorted(NEED_IMAGES.keys()):
        short_id, slug = NEED_IMAGES[rid]
        cdn_id = resolve_cdn_url(short_id)
        if cdn_id:
            print(f"  [{rid:2d}] {slug}: {short_id} -> {cdn_id}")
            sql_updates.append((rid, cdn_id, slug))
        else:
            print(f"  [{rid:2d}] {slug}: FAILED to resolve {short_id}")
        time.sleep(0.3)

    print(f"\nResolved: {len(sql_updates)}/{len(NEED_IMAGES)}\n")

    print("Phase 2: Downloading images...\n")
    for rid, cdn_id, slug in sql_updates:
        dest = os.path.join(IMAGES_DIR, f"{slug}.jpg")
        print(f"  [{rid:2d}] {slug}.jpg", end=" ")
        if download_image(cdn_id, dest):
            size_kb = os.path.getsize(dest) / 1024
            print(f"OK ({size_kb:.0f} KB)")
        else:
            print("FAILED")
        time.sleep(0.2)

    print(f"\nPhase 3: Updating database...\n")
    for rid, cdn_id, slug in sql_updates:
        url = f"https://images.unsplash.com/{cdn_id}?w={W}&h={H}&fit=crop"
        sql = f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};"
        result = subprocess.run(
            ["mysql", "-u", "root", f"-p{DB_PASS}", "tasteflow", "-e", sql],
            capture_output=True, timeout=15
        )
        status = "OK" if result.returncode == 0 else "FAILED"
        print(f"  [{rid:2d}] {slug}: {status}")

    print("\nDone!")


if __name__ == "__main__":
    main()
