import json
import sys

STATS = ["HP", "Str", "Mag", "Skl", "Spd", "Lck", "Def", "Res"]
STATS_LOWER = ["hp", "str", "mag", "skl", "spd", "lck", "def", "res"]

CLASS_MAP = {
    "lord": "Lord (M)",
    "tactician": "Tactician",
    "cleric": "Priest, Cleric",
    "great_knight": "Great Knight",
    "cavalier": "Cavalier",
    "archer": "Archer",
    "fighter": "Fighter",
    "mage": "Mage",
    "pegasus_knight": "Pegasus Knight",
    "knight": "Knight",
    "villager": "Villager",
    "myrmidon": "Myrmidon",
    "troubadour": "Troubadour",
    "taguel": "Taguel *",
    "thief": "Thief",
    "mercenary": "Mercenary",
    "wyvern_rider": "Wyvern Rider",
    "war_monk": "War Monk/Cleric",
    "dark_mage": "Dark Mage",
    "trickster": "Trickster",
    "dancer": "Dancer",
    "manakete": "Manakete *",
    "swordmaster": "Swordmaster",
    "warrior": "Warrior",
    "hero": "Hero",
    "dark_flier": "Dark Flier",
    "conqueror": "Conqueror",
    "sage": "Sage",
}

UNIT_NAME_MAP = {
    "Avatar": ["robin_m", "robin_f"],
    "Chrom": "chrom",
    "Lissa": "lissa",
    "Frederick": "frederick",
    "Sully": "sully",
    "Virion": "virion",
    "Stahl": "stahl",
    "Vaike": "vaike",
    "Miriel": "miriel",
    "Sumia": "sumia",
    "Kellam": "kellam",
    "Donnel": "donnel",
    "Lon\u2019qu": "lonqu",
    "Ricken": "ricken",
    "Maribelle": "maribelle",
    "Panne": "panne",
    "Gaius": "gaius",
    "Cordelia": "cordelia",
    "Gregor": "gregor",
    "Nowi": "nowi",
    "Libra": "libra",
    "Tharja": "tharja",
    "Anna": "anna",
    "Olivia": "olivia",
    "Cherche": "cherche",
    "Henry": "henry",
    "Say\u2019ri": "sayri",
    "Tiki": "tiki",
    "Basilio": "basilio",
    "Flavia": "flavia",
    "Gangrel": "gangrel",
    "Walhart": "walhart",
    "Emmeryn": "emmeryn",
    "Yen\u2019fay": "yenfay",
    "Aversa": "aversa",
    "Priam": "priam",
}

def strip_skill_bonus(val):
    s = str(val).strip()
    if "+" in s:
        s = s.split("+")[0]
    try:
        return int(s)
    except ValueError:
        return 0

def main():
    with open("dev/awakening_unit_bases_raw.json") as f:
        raw_units = json.load(f)
    with open("dev/awakening_class_bases_raw.json") as f:
        raw_classes = json.load(f)
    with open("data/awakening/units.json") as f:
        units_data = json.load(f)

    units_by_id = {u["id"]: u for u in units_data}

    class_bases = {}
    for row in raw_classes:
        cname = str(row.get("Class", "")).strip()
        if cname == "Class":
            continue
        class_bases[cname] = row

    sf_rows = {}
    for row in raw_units:
        name = str(row.get("Name", "")).strip()
        if name == "Name" or not name:
            continue
        if "(H)" in name or "(L)" in name:
            continue
        sf_rows[name] = row

    children_names = {
        "Lucina", "Owain", "Inigo", "Brady", "Kjelle", "Cynthia",
        "Severa", "Gerome", "Morgan", "Yarne", "Laurent", "Noire", "Nah",
    }

    results = []
    errors = []

    for sf_name, unit_ids in UNIT_NAME_MAP.items():
        if isinstance(unit_ids, list):
            target_ids = [uid for uid in unit_ids if uid in units_by_id]
        else:
            target_ids = [unit_ids] if unit_ids in units_by_id else []

        if not target_ids:
            continue

        if sf_name not in sf_rows:
            errors.append(f"Unit '{sf_name}' not found in scraped data")
            continue

        row = sf_rows[sf_name]

        visible_bases = {}
        for stat in STATS:
            visible_bases[stat] = strip_skill_bonus(row.get(stat, 0))

        unit_class_in_data = units_by_id[target_ids[0]]["class"]
        sf_class_name = CLASS_MAP.get(unit_class_in_data)

        if not sf_class_name:
            errors.append(f"Unit '{sf_name}' class '{unit_class_in_data}' not in CLASS_MAP")
            continue

        if sf_class_name not in class_bases:
            errors.append(f"Unit '{sf_name}' mapped class '{sf_class_name}' not found in class bases data")
            continue

        class_row = class_bases[sf_class_name]
        class_base_vals = {}
        for stat in STATS:
            if stat == "Lck":
                class_base_vals[stat] = 0
            else:
                class_base_vals[stat] = strip_skill_bonus(class_row.get(stat, 0))

        personal_bases = {}
        for stat in STATS:
            personal_bases[stat] = visible_bases[stat] - class_base_vals[stat]

        for uid in target_ids:
            entry = {
                "name": units_by_id[uid]["name"],
                "id": uid,
                "class": unit_class_in_data,
                "visible_bases": {STATS_LOWER[i]: visible_bases[s] for i, s in enumerate(STATS)},
                "class_bases": {STATS_LOWER[i]: class_base_vals[s] for i, s in enumerate(STATS)},
                "personal_bases": {STATS_LOWER[i]: personal_bases[s] for i, s in enumerate(STATS)},
            }
            results.append(entry)

    for e in errors:
        print(f"WARNING: {e}")

    with open("dev/awakening_personal_bases.json", "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nComputed personal bases for {len(results)} unit entries.")
    print(f"Saved to dev/awakening_personal_bases.json")

    validation_errors = []
    for entry in results:
        for stat in STATS_LOWER:
            pb = entry["personal_bases"][stat]
            vb = entry["visible_bases"][stat]
            if pb > vb:
                validation_errors.append(
                    f"VALIDATION FAIL: {entry['name']} ({entry['id']}): "
                    f"{stat} personal_base={pb} > visible_base={vb}"
                )

    if validation_errors:
        for ve in validation_errors:
            print(ve)
        print(f"\nValidation FAILED with {len(validation_errors)} errors.")
        sys.exit(1)
    else:
        print(f"Validation PASSED: all personal bases <= visible bases for all {len(results)} units.")

if __name__ == "__main__":
    main()
