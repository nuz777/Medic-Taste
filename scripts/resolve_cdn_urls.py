"""
Resolve Unsplash short IDs to CDN photo-XXXXXXXX URLs via download endpoint.
Then re-download all 70 recipe images with the correct CDN URLs.
"""

import os
import re
import time
import urllib.request
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, "frontend", "assets", "images", "recipes")
SQL_OUTPUT = os.path.join(BASE_DIR, "database", "actualizar_imagenes_recetas.sql")
W = 600
H = 400

# Recipe ID -> (short_id, recipe_name, slug)
RECIPES = {
    1:  ("tB2MPTiSrsg", "Pollo con arroz", "pollo-con-arroz"),
    2:  ("pY1_RHPpFcc", "Ensalada Cesar", "ensalada-cesar"),
    3:  ("R6PDgDUUCgI", "Pasta al pesto", "pasta-al-pesto"),
    4:  ("7AyseGersVI", "Tortilla de patatas", "tortilla-de-patatas"),
    5:  ("JfWhrxbmF-U", "Batido de platano", "batido-de-platano"),
    6:  ("_BNhN8Q68io", "Ensalada de aguacate", "ensalada-de-aguacate"),
    7:  ("EvxE8j6lfyY", "Lentejas guisadas", "lentejas-guisadas"),
    8:  ("P7oGUDHswIA", "Tostada de aguacate", "tostada-de-aguacate"),
    9:  ("s8GfYrV88vo", "Avena con frutas", "avena-con-frutas"),
    10: ("NSSXbbuHK_A", "Huevos revueltos con espinaca", "huevos-revueltos-con-espinaca"),
    11: ("4T-TAAKc0jk", "Smoothie bowl de mango", "smoothie-bowl-de-mango"),
    12: ("-KlkI_4N52I", "Panqueques de avena", "panqueques-de-avena"),
    13: ("Gem-Yi6p1BU", "Tostadas de huevo y aguacate", "tostadas-de-huevo-y-aguacate"),
    14: ("9Uphjae3YnU", "Yogur con granola", "yogur-con-granola"),
    15: ("KPDbRyFOTnE", "Salmon con quinoa", "salmon-con-quinoa"),
    16: ("emy9Rhhn2PI", "Bowl de garbanzos", "bowl-de-garbanzos"),
    17: ("VtNLbOAeO68", "Pollo al curry", "pollo-al-curry"),
    18: ("Zy3H2bIF3Vs", "Pasta integral con verduras", "pasta-integral-con-verduras"),
    19: ("X2-R25T1A2A", "Ensalada templada de quinoa", "ensalada-templada-de-quinoa"),
    20: ("o7GQl0KO2Ok", "Tacos de pescado", "tacos-de-pescado"),
    21: ("VhuC3z2o8vQ", "Bowl teriyaki de pollo", "bowl-teriyaki-de-pollo"),
    22: ("6eCpa9J3c_c", "Sopa de tomate", "sopa-de-tomate"),
    23: ("UdsV2iVWVOc", "Merluza al horno", "merluza-al-horno"),
    24: ("3b3HKpCOJwM", "Revuelto de tofu", "revuelto-de-tofu"),
    25: ("S4cdTe1Jx04", "Crema de calabacin", "crema-de-calabacin"),
    26: ("3f4KbOE9M1w", "Pechuga de pollo a la plancha", "pechuga-de-pollo-a-la-plancha"),
    27: ("canKcjh_xn4", "Pasta con marinara", "pasta-con-marinara"),
    28: ("sfvpZkHSodE", "Bowl de arroz con champinones", "bowl-de-arroz-con-champinones"),
    29: ("enRLKyJLxrk", "Hummus con vegetales", "hummus-con-vegetales"),
    30: ("miuSVZ10T3c", "Energizantes de avena", "energizantes-de-avena"),
    31: ("xVk-sNWXRGI", "Edamame con sal", "edamame-con-sal"),
    32: ("4xZlEFGqWuM", "Batido verde detox", "batido-verde-detox"),
    33: ("rjL-L-Yjd24", "Frutos secos mixtos", "frutos-secos-mixtos"),
    34: ("f6v0yJuAE1Y", "Tostadas de ricotta", "tostadas-de-ricotta"),
    35: ("43VMTJ1WfsM", "Bowl de acai con granola", "bowl-de-acai-con-granola"),
    36: ("dXOf8vzgz50", "Tostada francesa", "tostada-francesa"),
    37: ("9hOCXVlD0ds", "Omelette de champinones", "omelette-de-champinones"),
    38: ("HGzn4Puc3Hc", "Porridge de quinoa con frutas", "porridge-de-quinoa-con-frutas"),
    39: ("z51otZfV2mM", "Budin de chia con mango", "budin-de-chia-con-mango"),
    40: ("cAKpOtsl2Rw", "Wrap de huevo y espinaca", "wrap-de-huevo-y-espinaca"),
    41: ("cDtOk0XKf3Y", "Ensalada de atun con quinoa", "ensalada-de-atun-con-quinoa"),
    42: ("HohIHrmr_E0", "Curry de garbanzos con arroz", "curry-de-garbanzos-con-arroz"),
    43: ("gTOAB_0UCQw", "Pechuga rellena de espinaca y queso", "pechuga-rellena-de-espinaca-y-queso"),
    44: ("NDX6Hr95dtQ", "Salteado de tofu con verduras", "salteado-de-tofu-con-verduras"),
    45: ("Du68EQALV6w", "Hamburguesa de lentejas", "hamburguesa-de-lentejas"),
    46: ("9aajnmX70Eo", "Pollo al horno con batata", "pollo-al-horno-con-batata"),
    47: ("PRPiDF0fPf8", "Fideos soba salteados", "fideos-soba-salteados"),
    48: ("Mwtmk37_0S4", "Bowl de salmon con aguacate", "bowl-de-salmon-con-aguacate"),
    49: ("Spp1G283dow", "Wrap de pollo y aguacate", "wrap-de-pollo-y-aguacate"),
    50: ("VAbBclifmvY", "Estofado de lentejas con batata", "estofado-de-lentejas-con-batata"),
    51: ("y-wM_h_27Fg", "Sopa de lentejas y verduras", "sopa-de-lentejas-y-verduras"),
    52: ("1ntrS9LsoqQ", "Merluza con pure de batata", "merluza-con-pure-de-batata"),
    53: ("Ex0l1IbxitQ", "Ensalada templada de lentejas", "ensalada-templada-de-lentejas"),
    54: ("docP-fBTnjw", "Pasta con brocoli y ajo", "pasta-con-brocoli-y-ajo"),
    55: ("9iJPST6E1-M", "Cazuela de garbanzos con espinaca", "cazuela-de-garbanzos-con-espinaca"),
    56: ("htMa9KPui1I", "Tortilla de calabacin", "tortilla-de-calabacin"),
    57: ("Dwn0oxy42e4", "Pollo salteado con brocoli", "pollo-salteado-con-brocoli"),
    58: ("wTZYb37YLKw", "Sopa fria de pepino", "sopa-fria-de-pepino"),
    59: ("_VWg1YZNDnM", "Tofu al horno con verduras", "tofu-al-horno-con-verduras"),
    60: ("xX9SmqQCbFY", "Ensalada de espinaca y fresas", "ensalada-de-espinaca-y-fresas"),
    61: ("LKKl3WFcwzQ", "Bolitas de garbanzo asadas", "bolitas-de-garbanzo-asadas"),
    62: ("dy5jSn9SuqQ", "Wrap de hummus y verduras", "wrap-de-hummus-y-verduras"),
    63: ("6MUOCpV3kG8", "Batido de frutos rojos", "batido-de-frutos-rojos"),
    64: ("1HWUBkVhBGA", "Palitos de zanahoria con hummus", "palitos-de-zanahoria-con-hummus"),
    65: ("MKuwCURwkgw", "Compota de manzana", "compota-de-manzana"),
    66: ("h0Ke2KtAQ-g", "Ensalada de frutas tropicales", "ensalada-de-frutas-tropicales"),
    67: ("y4Ee3Q71TqY", "Barritas de avena y miel", "barritas-de-avena-y-miel"),
    68: ("ILKZqcRVlFk", "Camarones al ajillo", "camarones-al-ajillo"),
    69: ("5lIoNp2wUB0", "Ensalada de edamame y quinoa", "ensalada-de-edamame-y-quinoa"),
    70: ("ytDLnwa8aXo", "Pollo agridulce", "pollo-agridulce"),
}


def resolve_cdn_url(short_id, retries=2):
    """Resolve a short Unsplash ID to the full CDN photo-XXXXXXXX URL via /download."""
    url = f"https://unsplash.com/photos/{short_id}/download?force=true"
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            resp = urllib.request.urlopen(req, timeout=15)
            final_url = resp.url
            # Extract photo-XXXX part from the CDN URL
            match = re.search(r"(photo-[a-zA-Z0-9_-]+)", final_url)
            if match:
                return match.group(1)
            # If no photo- pattern, try to extract the image filename
            match = re.search(r"images\.unsplash\.com/([^?]+)", final_url)
            if match:
                return match.group(1)
            print(f"    WARNING: Could not extract photo ID from: {final_url[:100]}")
            return None
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
            else:
                return None
    return None


def download_image(photo_id, dest_path, retries=2):
    """Download image from Unsplash CDN."""
    # Try both formats: photo-XXXX and direct ID
    urls_to_try = [
        f"https://images.unsplash.com/{photo_id}?w={W}&h={H}&fit=crop&auto=format&q=80",
    ]
    # If it doesn't already start with photo-, also try with photo- prefix
    if not photo_id.startswith("photo-"):
        urls_to_try.insert(0, f"https://images.unsplash.com/photo-{photo_id}?w={W}&h={H}&fit=crop&auto=format&q=80")

    for url in urls_to_try:
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
    print(f"    FAILED: {photo_id} -> {e}")
    return False


def main():
    os.makedirs(IMAGES_DIR, exist_ok=True)

    print(f"Phase 1: Resolving {len(RECIPES)} short IDs to CDN URLs...\n")

    resolved = {}
    failed_resolve = []

    for recipe_id in sorted(RECIPES.keys()):
        short_id, name, slug = RECIPES[recipe_id]
        cdn_id = resolve_cdn_url(short_id)
        if cdn_id:
            resolved[recipe_id] = (cdn_id, name, slug)
            print(f"  [{recipe_id:2d}] {name[:35]:<35} {short_id} -> {cdn_id}")
        else:
            failed_resolve.append((recipe_id, short_id, name))
            print(f"  [{recipe_id:2d}] {name[:35]:<35} {short_id} -> FAILED")
        time.sleep(0.3)

    print(f"\nResolved: {len(resolved)}/{len(RECIPES)}")
    if failed_resolve:
        print(f"Failed to resolve: {len(failed_resolve)}")
        for rid, sid, name in failed_resolve:
            print(f"  ID {rid}: {name} ({sid})")

    print(f"\nPhase 2: Downloading {len(resolved)} images...\n")

    success = 0
    failed_download = []
    for recipe_id in sorted(resolved.keys()):
        cdn_id, name, slug = resolved[recipe_id]
        dest = os.path.join(IMAGES_DIR, f"{slug}.jpg")

        print(f"  [{recipe_id:2d}] {name[:35]:<35} -> {slug}.jpg", end=" ")
        if download_image(cdn_id, dest):
            size_kb = os.path.getsize(dest) / 1024
            print(f"OK ({size_kb:.0f} KB)")
            success += 1
        else:
            failed_download.append((recipe_id, name))
            print("FAILED")
        time.sleep(0.2)

    print(f"\nDownloaded: {success}/{len(resolved)}")

    # Generate SQL
    print(f"\nGenerating SQL: {SQL_OUTPUT}")
    with open(SQL_OUTPUT, "w", encoding="utf-8") as f:
        f.write("USE tasteflow;\n\n")
        f.write("-- =============================================\n")
        f.write("-- ACTUALIZACION DE IMAGENES PARA TODAS LAS RECETAS\n")
        f.write("-- Cada receta tiene una imagen unica de Unsplash (descargada localmente)\n")
        f.write("-- Las imagenes se sirven desde frontend/assets/images/recipes/\n")
        f.write("-- =============================================\n\n")

        for recipe_id in sorted(RECIPES.keys()):
            if recipe_id in resolved:
                cdn_id, name, slug = resolved[recipe_id]
                if not cdn_id.startswith("photo-"):
                    cdn_id = f"photo-{cdn_id}"
                url = f"https://images.unsplash.com/{cdn_id}?w={W}&h={H}&fit=crop"
                f.write(f"UPDATE recipes SET photo_url = '{url}' WHERE id = {recipe_id};  -- {name}\n")

        f.write("\n-- Verificar resultado\n")
        f.write("SELECT id, name, photo_url FROM recipes ORDER BY id;\n")

    print("Done!")


if __name__ == "__main__":
    main()
