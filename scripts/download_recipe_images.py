"""
Download unique food images from Unsplash for each recipe.
Saves locally to frontend/assets/images/recipes/{slug}.jpg
Generates SQL UPDATE statements for the database.
"""

import os
import re
import sys
import time
import urllib.request
import unicodedata

# ── Configuration ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, "frontend", "assets", "images", "recipes")
SQL_OUTPUT = os.path.join(BASE_DIR, "database", "actualizar_imagenes_recetas.sql")
W = 600
H = 400

# ── Recipe → Unsplash photo-ID mapping ────────────────────────────
# Each recipe ID maps to a food-specific Unsplash photo.
# Photo IDs sourced from Unsplash search results for each dish.
RECIPE_PHOTOS = {
    # RECETAS 1-10 (Originales)
    1:  "tB2MPTiSrsg",   # Pollo con arroz - chicken rice bowl
    2:  "pY1_RHPpFcc",   # Ensalada Cesar - caesar salad
    3:  "uWmbTVuLRDI",   # Pasta al pesto - pesto pasta
    4:  "7AyseGersVI",   # Tortilla de patatas - spanish tortilla
    5:  "JfWhrxbmF-U",   # Batido de platano - banana smoothie
    6:  "fQu-BIqem7Q",   # Ensalada de aguacate - avocado salad
    7:  "EvxE8j6lfyY",   # Lentejas guisadas - lentil stew
    8:  "P7oGUDHswIA",   # Tostada de aguacate - avocado toast
    9:  "s8GfYrV88vo",   # Avena con frutas - oatmeal with fruit
    10: "cu-e5MVZTx0",   # Huevos revueltos con espinaca - spinach eggs

    # DESAYUNOS 11-16
    11: "TSawhIki79A",   # Smoothie bowl de mango
    12: "-KlkI_4N52I",   # Panqueques de avena - oat pancakes
    13: "Gem-Yi6p1BU",   # Tostadas de huevo y aguacate
    14: "wM9paYGRRXo",   # Yogur con granola
    15: "KPDbRyFOTnE",   # Salmon con quinoa
    16: "emy9Rhhn2PI",   # Bowl de garbanzos - chickpea bowl

    # ALMUERZOS 17-23
    17: "VtNLbOAeO68",   # Pollo al curry - chicken curry
    18: "Zy3H2bIF3Vs",   # Pasta integral con verduras
    19: "X2-R25T1A2A",   # Ensalada templada de quinoa
    20: "o7GQl0KO2Ok",   # Tacos de pescado - fish tacos
    21: "VhuC3z2o8vQ",   # Bowl teriyaki de pollo
    22: "IbKSMQbBRq8",   # Sopa de tomate - tomato soup
    23: "UdsV2iVWVOc",   # Merluza al horno - baked hake

    # CENAS 24-30
    24: "TQFZhuwpd1w",   # Revuelto de tofu - tofu scramble
    25: "S4cdTe1Jx04",   # Crema de calabacin - zucchini soup
    26: "3f4KbOE9M1w",   # Pechuga de pollo a la plancha
    27: "canKcjh_xn4",   # Pasta con marinara
    28: "fYg1NxA6CYQ",   # Bowl de arroz con champinones
    29: "enRLKyJLxrk",   # Hummus con vegetales
    30: "miuSVZ10T3c",   # Energizantes de avena

    # SNACKS 31-36
    31: "R6Lw-csTHt8",   # Edamame con sal
    32: "4xZlEFGqWuM",   # Batido verde detox - green smoothie
    33: "NkJcl7vvXSI",   # Frutos secos mixtos - mixed nuts
    34: "f6v0yJuAE1Y",   # Tostadas de ricotta
    35: "43VMTJ1WfsM",   # Bowl de acai con granola
    36: "dXOf8vzgz50",   # Tostada francesa - french toast

    # NUEVOS DESAYUNOS Y ALMUERZOS 37-44
    37: "9hOCXVlD0ds",   # Omelette de champinones
    38: "7GhJOEw3vls",   # Porridge de quinoa con frutas
    39: "z51otZfV2mM",   # Budin de chia con mango - chia pudding
    40: "UXW-P2Nw85o",   # Wrap de huevo y espinaca
    41: "cDtOk0XKf3Y",   # Ensalada de atun con quinoa
    42: "HohIHrmr_E0",   # Curry de garbanzos con arroz
    43: "gTOAB_0UCQw",   # Pechuga rellena de espinaca y queso
    44: "NDX6Hr95dtQ",   # Salteado de tofu con verduras

    # 45-52
    45: "Du68EQALV6w",   # Hamburguesa de lentejas
    46: "9aajnmX70Eo",   # Pollo al horno con batata
    47: "PRPiDF0fPf8",   # Fideos soba salteados
    48: "Mwtmk37_0S4",   # Bowl de salmon con aguacate
    49: "Spp1G283dow",   # Wrap de pollo y aguacate
    50: "VAbBclifmvY",   # Estofado de lentejas con batata
    51: "y-wM_h_27Fg",   # Sopa de lentejas y verduras
    52: "1ntrS9LsoqQ",   # Merluza con pure de batata

    # 53-60
    53: "0FwtDH4GcR8",   # Ensalada templada de lentejas
    54: "zgjoPwWv_yM",   # Pasta con brocoli y ajo
    55: "EX_DWdhiDQQ",   # Cazuela de garbanzos con espinaca
    56: "htMa9KPui1I",   # Tortilla de calabacin
    57: "00uSpdQdA4g",   # Pollo salteado con brocoli
    58: "wTZYb37YLKw",   # Sopa fria de pepino
    59: "7nSSC2Qh7nA",   # Tofu al horno con verduras
    60: "xX9SmqQCbFY",   # Ensalada de espinaca y fresas

    # 61-69
    61: "LKKl3WFcwzQ",   # Bolitas de garbanzo asadas
    62: "dy5jSn9SuqQ",   # Wrap de hummus y verduras
    63: "6MUOCpV3kG8",   # Batido de frutos rojos
    64: "4XJydGNLis8",   # Palitos de zanahoria con hummus
    65: "MKuwCURwkgw",   # Compota de manzana
    66: "r-zLU59me88",   # Ensalada de frutas tropicales
    67: "y4Ee3Q71TqY",   # Barritas de avena y miel
    68: "ILKZqcRVlFk",   # Camarones al ajillo - garlic shrimp
    69: "EdV5me3MrXs",   # Ensalada de edamame y quinoa

    # RECETA 70
    70: "ytDLnwa8aXo",   # Pollo agridulce - sweet and sour chicken
}

# ── Helpers ────────────────────────────────────────────────────────
def name_to_slug(name):
    """Convert recipe name to URL-safe slug (matches frontend nameToSlug)."""
    name = unicodedata.normalize("NFKD", name)
    name = name.encode("ascii", "ignore").decode("ascii")
    name = name.lower().strip()
    name = re.sub(r"[^a-z0-9]+", "-", name)
    name = name.strip("-")
    return name


def download_image(photo_id, dest_path, retries=2):
    """Download a single image from Unsplash CDN."""
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
            else:
                print(f"  FAILED: photo-{photo_id} -> {e}")
                return False
    return False


# ── Main ───────────────────────────────────────────────────────────
def main():
    os.makedirs(IMAGES_DIR, exist_ok=True)

    # Recipe names (ID -> name)
    recipe_names = {
        1: "Pollo con arroz", 2: "Ensalada Cesar", 3: "Pasta al pesto",
        4: "Tortilla de patatas", 5: "Batido de platano", 6: "Ensalada de aguacate",
        7: "Lentejas guisadas", 8: "Tostada de aguacate", 9: "Avena con frutas",
        10: "Huevos revueltos con espinaca", 11: "Smoothie bowl de mango",
        12: "Panqueques de avena", 13: "Tostadas de huevo y aguacate",
        14: "Yogur con granola", 15: "Salmon con quinoa", 16: "Bowl de garbanzos",
        17: "Pollo al curry", 18: "Pasta integral con verduras",
        19: "Ensalada templada de quinoa", 20: "Tacos de pescado",
        21: "Bowl teriyaki de pollo", 22: "Sopa de tomate", 23: "Merluza al horno",
        24: "Revuelto de tofu", 25: "Crema de calabacin",
        26: "Pechuga de pollo a la plancha", 27: "Pasta con marinara",
        28: "Bowl de arroz con champinones", 29: "Hummus con vegetales",
        30: "Energizantes de avena", 31: "Edamame con sal",
        32: "Batido verde detox", 33: "Frutos secos mixtos",
        34: "Tostadas de ricotta", 35: "Bowl de acai con granola",
        36: "Tostada francesa", 37: "Omelette de champinones",
        38: "Porridge de quinoa con frutas", 39: "Budin de chia con mango",
        40: "Wrap de huevo y espinaca", 41: "Ensalada de atun con quinoa",
        42: "Curry de garbanzos con arroz", 43: "Pechuga rellena de espinaca y queso",
        44: "Salteado de tofu con verduras", 45: "Hamburguesa de lentejas",
        46: "Pollo al horno con batata", 47: "Fideos soba salteados",
        48: "Bowl de salmon con aguacate", 49: "Wrap de pollo y aguacate",
        50: "Estofado de lentejas con batata", 51: "Sopa de lentejas y verduras",
        52: "Merluza con pure de batata", 53: "Ensalada templada de lentejas",
        54: "Pasta con brocoli y ajo", 55: "Cazuela de garbanzos con espinaca",
        56: "Tortilla de calabacin", 57: "Pollo salteado con brocoli",
        58: "Sopa fria de pepino", 59: "Tofu al horno con verduras",
        60: "Ensalada de espinaca y fresas", 61: "Bolitas de garbanzo asadas",
        62: "Wrap de hummus y verduras", 63: "Batido de frutos rojos",
        64: "Palitos de zanahoria con hummus", 65: "Compota de manzana",
        66: "Ensalada de frutas tropicales", 67: "Barritas de avena y miel",
        68: "Camarones al ajillo", 69: "Ensalada de edamame y quinoa",
        70: "Pollo agridulce",
    }

    # Check for unique photo IDs
    photo_ids_used = list(RECIPE_PHOTOS.values())
    if len(photo_ids_used) != len(set(photo_ids_used)):
        from collections import Counter
        dupes = [pid for pid, count in Counter(photo_ids_used).items() if count > 1]
        print(f"WARNING: {len(dupes)} duplicate photo IDs found!")
        for d in dupes:
            recipes = [rid for rid, pid in RECIPE_PHOTOS.items() if pid == d]
            print(f"  photo-{d} used by recipes: {recipes}")
        sys.exit(1)

    print(f"Downloading {len(RECIPE_PHOTOS)} unique images...")
    print(f"Output directory: {IMAGES_DIR}\n")

    success = 0
    failed = []
    for recipe_id in sorted(RECIPE_PHOTOS.keys()):
        name = recipe_names[recipe_id]
        slug = name_to_slug(name)
        photo_id = RECIPE_PHOTOS[recipe_id]
        dest = os.path.join(IMAGES_DIR, f"{slug}.jpg")

        print(f"  [{recipe_id:2d}] {name[:35]:<35} -> {slug}.jpg", end=" ")
        if download_image(photo_id, dest):
            size_kb = os.path.getsize(dest) / 1024
            print(f"OK ({size_kb:.0f} KB)")
            success += 1
        else:
            failed.append((recipe_id, name))
            print("FAILED")
        time.sleep(0.2)  # Be polite to Unsplash

    print(f"\n{'='*60}")
    print(f"Downloaded: {success}/{len(RECIPE_PHOTOS)}")
    if failed:
        print(f"Failed: {len(failed)}")
        for rid, name in failed:
            print(f"  ID {rid}: {name}")

    # ── Generate SQL ───────────────────────────────────────────────
    print(f"\nGenerating SQL: {SQL_OUTPUT}")
    with open(SQL_OUTPUT, "w", encoding="utf-8") as f:
        f.write("USE tasteflow;\n\n")
        f.write("-- =============================================\n")
        f.write("-- ACTUALIZACION DE IMAGENES PARA TODAS LAS RECETAS\n")
        f.write("-- Cada receta tiene una imagen unica de Unsplash (descargada localmente)\n")
        f.write("-- Las imagenes se sirven desde frontend/assets/images/recipes/\n")
        f.write("-- =============================================\n\n")

        f.write("-- RECETAS 1-10 (Originales)\n")
        for rid in range(1, 11):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- DESAYUNOS 11-16\n")
        for rid in range(11, 17):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- ALMUERZOS 17-23\n")
        for rid in range(17, 24):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- CENAS 24-30\n")
        for rid in range(24, 31):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- SNACKS 31-36\n")
        for rid in range(31, 37):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- NUEVOS DESAYUNOS Y ALMUERZOS 37-44\n")
        for rid in range(37, 45):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- RECETAS 45-52\n")
        for rid in range(45, 53):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- RECETAS 53-60\n")
        for rid in range(53, 61):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- RECETAS 61-69\n")
        for rid in range(61, 70):
            name = recipe_names[rid]
            slug = name_to_slug(name)
            photo_id = RECIPE_PHOTOS[rid]
            url = f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop"
            f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {rid};  -- {name}\n")

        f.write("\n-- RECETA 70\n")
        name = recipe_names[70]
        slug = name_to_slug(name)
        photo_id = RECIPE_PHOTOS[70]
        url = f"https://images.unsplash.com/photo-{photo_id}?w={W}&h={H}&fit=crop"
        f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = 70;  -- {name}\n")

        f.write("\n-- Verificar resultado\n")
        f.write("SELECT id, name, photo_url FROM recipes ORDER BY id;\n")

    print("SQL file generated successfully!")
    print(f"\nTo apply: mysql -u root -p tasteflow < {SQL_OUTPUT}")


if __name__ == "__main__":
    main()
