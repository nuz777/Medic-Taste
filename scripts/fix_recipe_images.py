"""
Rename/copy recipe image files to match the correct slug names.
The frontend uses nameToSlug(name) to find local images.
"""
import os
import re
import shutil
import unicodedata

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, "frontend", "assets", "images", "recipes")

# CDN photo_id -> existing local filename (without .jpg)
CDN_TO_FILE = {
    "photo-1762631383628-77f92d18b184": "pollo-con-arroz",
    "photo-1751638582376-3071e1fddb4e": "ensalada-cesar",
    "photo-1682493976855-7cd4d687aa2a": "pasta-al-pesto",
    "photo-1764333580740-b327847301b1": "tortilla-de-patatas",
    "photo-1685967836529-b0e8d6938227": "batido-de-platano",
    "photo-1743779665792-3026b7487756": "ensalada-de-aguacate",
    "photo-1756821753226-c0fc88056cf7": "lentejas-guisadas",
    "photo-1719520670204-dbe1903a789f": "tostada-de-aguacate",
    "photo-1557736398-a966fe2f0e20": "ensalada-de-atun-con-quinoa",
    "photo-1747223695583-15f37c979045": "fideos-soba-salteados",
    "photo-1682622110332-d50f50b7146d": "avena-con-frutas",
    "photo-1754894992043-d51f1d75ea3b": "huevos-revueltos-con-espinaca",
    "photo-1778449270554-3e5b17cfebc6": "smoothie-bowl-de-mango",
    "photo-1504854991036-ca1b54063e48": "panqueques-de-avena",
    "photo-1772717737730-85eff61606c8": "tostadas-de-huevo-y-aguacate",
    "photo-1725883691833-97103ecd582a": "yogur-con-granola",
    "photo-1547592180-85f173990554": "salmon-con-quinoa",
    "photo-1771074168450-11e3f8b7aa53": "bowl-de-garbanzos",
    "photo-1764304733301-3a9f335f0c67": "pollo-al-curry",
    "photo-1623243020684-9f8bcefe6e94": "pasta-integral-con-verduras",
    "photo-1754652327512-3a4166c84cce": "ensalada-templada-de-quinoa",
    "photo-1696935191484-7677e929b0dc": "tacos-de-pescado",
    "photo-1609183480237-ccbb2d7c5772": "bowl-teriyaki-de-pollo",
    "photo-1565086869529-8c7802cca7a0": "sopa-de-tomate",
    "photo-1677889173788-57b871df7b8a": "merluza-al-horno",
    "photo-1647918516017-fa75cbd0af0d": "revuelto-de-tofu",
    "photo-1528131678130-c15f627bce80": "crema-de-calabacin",
    "photo-1762631383520-df106b252f6a": "pechuga-de-pollo-a-la-plancha",
    "photo-1751151497799-8b4057a2638e": "pasta-con-marinara",
    "photo-1659603833001-ae04fe910529": "bowl-de-arroz-con-champinones",
    "photo-1683725519288-eab9fa352335": "hummus-con-vegetales",
    "photo-1678554427018-3d8beeeaf08b": "energizantes-de-avena",
    "photo-1774988209357-118055b25210": "edamame-con-sal",
    "photo-1733414717503-5244d8260482": "batido-verde-detox",
    "photo-1768237536999-3fe4904b997b": "frutos-secos-mixtos",
    "photo-1643398191232-307edc4ab132": "tostadas-de-ricotta",
    "photo-1626700051175-6818013e1d4f": "wrap-de-pollo-y-aguacate",
    "photo-1658308766948-01c85ade2737": "estofado-de-lentejas-con-batata",
    "photo-1673436977889-334fcab20436": "sopa-de-lentejas-y-verduras",
    "photo-1761314014781-44fa155d2052": "merluza-con-pure-de-batata",
    "photo-1625128726814-461fc67f682d": "ensalada-templada-de-lentejas",
    "photo-1707448460889-e268eb742820": "pasta-con-brocoli-y-ajo",
    "photo-1698917467449-08bcd1d9014b": "cazuela-de-garbanzos-con-espinaca",
    "photo-1634202994480-8a148ae67ccb": "tortilla-de-calabacin",
    "photo-1756821753481-31183e985c76": "pollo-salteado-con-brocoli",
    "photo-1680359871243-6338b913c046": "sopa-fria-de-pepino",
    "photo-1764674963000-0d113663bc0d": "tofu-al-horno-con-verduras",
    "photo-1570197571499-166b36435e9f": "ensalada-de-espinaca-y-fresas",
    "photo-1568747244129-86a6c6541414": "bolitas-de-garbanzo-asadas",
    "photo-1748955308143-5055af50bba6": "wrap-de-hummus-y-verduras",
    "photo-1757597738356-11d378869593": "batido-de-frutos-rojos",
    "photo-1644946763226-22c60fcb6635": "palitos-de-zanahoria-con-hummus",
    "photo-1745964276896-96f8e8eb0e4e": "compota-de-manzana",
    "photo-1543994109-8f66c5be47a1": "ensalada-de-frutas-tropicales",
    "photo-1623612601381-08baf3dc2cf6": "barritas-de-avena-y-miel",
    "photo-1750680229961-1b0e607eb2c7": "camarones-al-ajillo",
    "photo-1719677775416-1dd6a93f1a73": "ensalada-de-edamame-y-quinoa",
    "photo-1768326119213-e0ad875083a3": "bowl-de-salmon-con-aguacate",
    "photo-1597377779407-51e50715cc7d": "pollo-al-horno-con-batata",
    "photo-1572448910681-3341d74893d2": "salteado-de-tofu-con-verduras",
    "photo-1749880183062-ffbf14738723": "pollo-agridulce",
}

# DB recipe CDN -> target slug
RECIPE_CDN_SLUG = {
    1:  ("photo-1762631383628-77f92d18b184", "pollo-con-arroz"),
    2:  ("photo-1751638582376-3071e1fddb4e", "ensalada-cesar"),
    3:  ("photo-1682493976855-7cd4d687aa2a", "pasta-al-pesto"),
    4:  ("photo-1764333580740-b327847301b1", "tortilla-de-patatas"),
    5:  ("photo-1685967836529-b0e8d6938227", "batido-de-platano"),
    6:  ("photo-1743779665792-3026b7487756", "ensalada-de-aguacate"),
    7:  ("photo-1756821753226-c0fc88056cf7", "lentejas-guisadas"),
    8:  ("photo-1719520670204-dbe1903a789f", "tostada-de-aguacate"),
    9:  ("photo-1557736398-a966fe2f0e20", "ensalada-de-atun-con-aguacate"),
    10: ("photo-1747223695583-15f37c979045", "arroz-salteado-con-atun-y-verduras"),
    11: ("photo-1682622110332-d50f50b7146d", "avena-con-frutas"),
    12: ("photo-1754894992043-d51f1d75ea3b", "huevos-revueltos-con-espinaca"),
    13: ("photo-1778449270554-3e5b17cfebc6", "smoothie-bowl-de-mango"),
    14: ("photo-1504854991036-ca1b54063e48", "panqueques-de-avena"),
    15: ("photo-1772717737730-85eff61606c8", "tostadas-de-huevo-y-aguacate"),
    16: ("photo-1725883691833-97103ecd582a", "yogur-con-granola"),
    17: ("photo-1547592180-85f173990554", "salmon-con-quinoa"),
    18: ("photo-1771074168450-11e3f8b7aa53", "bowl-de-garbanzos"),
    19: ("photo-1764304733301-3a9f335f0c67", "pollo-al-curry"),
    20: ("photo-1623243020684-9f8bcefe6e94", "pasta-integral-con-verduras"),
    21: ("photo-1754652327512-3a4166c84cce", "ensalada-templada-de-quinoa"),
    22: ("photo-1696935191484-7677e929b0dc", "tacos-de-pescado"),
    23: ("photo-1609183480237-ccbb2d7c5772", "bowl-teriyaki-de-pollo"),
    24: ("photo-1565086869529-8c7802cca7a0", "sopa-de-tomate"),
    25: ("photo-1677889173788-57b871df7b8a", "merluza-al-horno"),
    26: ("photo-1647918516017-fa75cbd0af0d", "revuelto-de-tofu"),
    27: ("photo-1528131678130-c15f627bce80", "crema-de-calabacin"),
    28: ("photo-1762631383520-df106b252f6a", "pechuga-de-pollo-a-la-plancha"),
    29: ("photo-1751151497799-8b4057a2638e", "pasta-con-marinara"),
    30: ("photo-1659603833001-ae04fe910529", "bowl-de-arroz-con-champinones"),
    31: ("photo-1683725519288-eab9fa352335", "hummus-con-vegetales"),
    32: ("photo-1678554427018-3d8beeeaf08b", "energizantes-de-avena"),
    33: ("photo-1774988209357-118055b25210", "edamame-con-sal"),
    34: ("photo-1733414717503-5244d8260482", "batido-verde-detox"),
    35: ("photo-1768237536999-3fe4904b997b", "frutos-secos-mixtos"),
    36: ("photo-1643398191232-307edc4ab132", "tostadas-de-ricotta"),
    37: ("photo-1626700051175-6818013e1d4f", "wrap-de-pollo-y-aguacate-ii"),
    38: ("photo-1658308766948-01c85ade2737", "estofado-de-lentejas-con-batata"),
    39: ("photo-1673436977889-334fcab20436", "sopa-de-lentejas-y-verduras"),
    40: ("photo-1761314014781-44fa155d2052", "merluza-con-pure-de-batata"),
    41: ("photo-1625128726814-461fc67f682d", "ensalada-templada-de-lentejas"),
    42: ("photo-1707448460889-e268eb742820", "pasta-con-brocoli-y-ajo"),
    43: ("photo-1698917467449-08bcd1d9014b", "cazuela-de-garbanzos-con-espinaca"),
    44: ("photo-1634202994480-8a148ae67ccb", "tortilla-de-calabacin"),
    45: ("photo-1756821753481-31183e985c76", "pollo-salteado-con-brocoli"),
    46: ("photo-1680359871243-6338b913c046", "sopa-fria-de-pepino"),
    47: ("photo-1764674963000-0d113663bc0d", "tofu-al-horno-con-verduras"),
    48: ("photo-1570197571499-166b36435e9f", "ensalada-de-espinaca-y-fresas"),
    49: ("photo-1568747244129-86a6c6541414", "bolitas-de-garbanzo-asadas"),
    50: ("photo-1748955308143-5055af50bba6", "wrap-de-hummus-y-verduras"),
    51: ("photo-1757597738356-11d378869593", "batido-de-frutos-rojos"),
    52: ("photo-1644946763226-22c60fcb6635", "palitos-de-zanahoria-con-hummus"),
    53: ("photo-1745964276896-96f8e8eb0e4e", "compota-de-manzana"),
    54: ("photo-1543994109-8f66c5be47a1", "ensalada-de-frutas-tropicales"),
    55: ("photo-1623612601381-08baf3dc2cf6", "barritas-de-avena-y-miel"),
    56: ("photo-1750680229961-1b0e607eb2c7", "camarones-al-ajillo"),
    57: ("photo-1719677775416-1dd6a93f1a73", "ensalada-de-edamame-y-quinoa"),
    58: ("photo-1768326119213-e0ad875083a3", "bowl-de-pollo-y-quinoa"),
    59: ("photo-1597377779407-51e50715cc7d", "salmon-al-horno-con-esparragos"),
    60: ("photo-1751151497799-8b4057a2638e", "pasta-carbonara-saludable"),
    61: ("photo-1568747244129-86a6c6541414", "ensalada-de-pollo-y-mango"),
    62: ("photo-1572448910681-3341d74893d2", "wok-de-verduras-con-tofu"),
    63: ("photo-1762631383628-77f92d18b184", "arroz-con-pollo-y-verduras"),
    64: ("photo-1528131678130-c15f627bce80", "crema-de-zanahoria-y-jengibre"),
    65: ("photo-1597377779407-51e50715cc7d", "pollo-al-horno-con-romero"),
    66: ("photo-1771074168450-11e3f8b7aa53", "ensalada-de-quinoa-y-garbanzos"),
    67: ("photo-1634202994480-8a148ae67ccb", "tortilla-de-espinaca-y-queso"),
    68: ("photo-1685967836529-b0e8d6938227", "batido-de-avena-y-manzana"),
    69: ("photo-1683725519288-eab9fa352335", "hummus-de-remolacha"),
    70: ("photo-1749880183062-ffbf14738723", "pollo-agridulce"),
}

# Note: recipes 58-69 reuse CDN URLs from other recipes (approximate matches)
# Some local files will be shared between recipes


def main():
    print("Mapping recipe images to correct slugs...\n")
    copied = 0
    already_ok = 0
    missing = 0

    for rid in sorted(RECIPE_CDN_SLUG.keys()):
        cdn_id, target_slug = RECIPE_CDN_SLUG[rid]
        source_slug = CDN_TO_FILE.get(cdn_id)

        target_path = os.path.join(IMAGES_DIR, f"{target_slug}.jpg")

        if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
            already_ok += 1
            continue

        if source_slug:
            source_path = os.path.join(IMAGES_DIR, f"{source_slug}.jpg")
            if os.path.exists(source_path) and os.path.getsize(source_path) > 1000:
                shutil.copy2(source_path, target_path)
                print(f"  [{rid:2d}] {target_slug}.jpg <- {source_slug}.jpg")
                copied += 1
                continue

        missing += 1
        print(f"  [{rid:2d}] {target_slug}.jpg MISSING (need {cdn_id})")

    print(f"\nResults: {already_ok} ok, {copied} copied, {missing} missing")
    print("Done!")


if __name__ == "__main__":
    main()
