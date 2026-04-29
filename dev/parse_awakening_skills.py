import json
import os

CLASSES_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "awakening", "classes.json")

FROZEN_MAPPING = {
    "lord": ["Dual Strike+ (Lv. 1)", "Charm (Lv. 10)"],
    "tactician": ["Veteran (Lv. 1)", "Solidarity (Lv. 10)"],
    "cavalier": ["Discipline (Lv. 1)", "Outdoor Fighter (Lv. 10)"],
    "knight": ["Defense +2 (Lv. 1)", "Indoor Fighter (Lv. 10)"],
    "myrmidon": ["Avoid +10 (Lv. 1)", "Vantage (Lv. 10)"],
    "mercenary": ["Armsthrift (Lv. 1)", "Patience (Lv. 10)"],
    "fighter": ["HP +5 (Lv. 1)", "Zeal (Lv. 10)"],
    "barbarian": ["Despoil (Lv. 1)", "Gamble (Lv. 10)"],
    "archer": ["Skill +2 (Lv. 1)", "Prescience (Lv. 10)"],
    "thief": ["Locktouch (Lv. 1)", "Movement +1 (Lv. 10)"],
    "pegasus_knight": ["Speed +2 (Lv. 1)", "Relief (Lv. 10)"],
    "wyvern_rider": ["Strength +2 (Lv. 1)", "Tantivy (Lv. 10)"],
    "mage": ["Magic +2 (Lv. 1)", "Focus (Lv. 10)"],
    "dark_mage": ["Hex (Lv. 1)", "Anathema (Lv. 10)"],
    "priest": ["Miracle (Lv. 1)", "Healtouch (Lv. 10)"],
    "cleric": ["Miracle (Lv. 1)", "Healtouch (Lv. 10)"],
    "troubadour": ["Resistance +2 (Lv. 1)", "Demoiselle (Lv. 10)"],
    "villager": ["Aptitude (Lv. 1)", "Underdog (Lv. 15)"],
    "dancer": ["Luck +4 (Lv. 1)", "Special Dance (Lv. 15)"],
    "taguel": ["Even Rhythm (Lv. 1)", "Beastbane (Lv. 15)"],
    "manakete": ["Odd Rhythm (Lv. 1)", "Wyrmsbane (Lv. 15)"],
    "great_lord": ["Aether (Lv. 5)", "Rightful King (Lv. 15)"],
    "grandmaster": ["Ignis (Lv. 5)", "Rally Spectrum (Lv. 15)"],
    "paladin": ["Defender (Lv. 5)", "Aegis (Lv. 15)"],
    "great_knight": ["Luna (Lv. 5)", "Dual Guard+ (Lv. 15)"],
    "swordmaster": ["Astra (Lv. 5)", "Swordfaire (Lv. 15)"],
    "hero": ["Sol (Lv. 5)", "Axebreaker (Lv. 15)"],
    "sniper": ["Hit Rate +20 (Lv. 5)", "Bowfaire (Lv. 15)"],
    "bow_knight": ["Rally Skill (Lv. 5)", "Bowbreaker (Lv. 15)"],
    "assassin": ["Lethality (Lv. 5)", "Pass (Lv. 15)"],
    "trickster": ["Lucky Seven (Lv. 5)", "Acrobat (Lv. 15)"],
    "warrior": ["Rally Strength (Lv. 5)", "Counter (Lv. 15)"],
    "berserker": ["Wrath (Lv. 5)", "Axefaire (Lv. 15)"],
    "falcon_knight": ["Rally Speed (Lv. 5)", "Lancefaire (Lv. 15)"],
    "dark_flier": ["Rally Movement (Lv. 5)", "Galeforce (Lv. 15)"],
    "wyvern_lord": ["Quick Burn (Lv. 5)", "Swordbreaker (Lv. 15)"],
    "griffon_rider": ["Deliverer (Lv. 5)", "Lancebreaker (Lv. 15)"],
    "sage": ["Rally Magic (Lv. 5)", "Tomefaire (Lv. 15)"],
    "sorcerer": ["Vengeance (Lv. 5)", "Tomebreaker (Lv. 15)"],
    "dark_knight": ["Slow Burn (Lv. 5)", "Lifetaker (Lv. 15)"],
    "war_monk": ["Rally Luck (Lv. 5)", "Renewal (Lv. 15)"],
    "war_cleric": ["Rally Luck (Lv. 5)", "Renewal (Lv. 15)"],
    "valkyrie": ["Rally Resistance (Lv. 5)", "Dual Support+ (Lv. 15)"],
    "general": ["Rally Defense (Lv. 5)", "Pavise (Lv. 15)"],
    "dread_fighter": ["Resistance +10 (Lv. 1)", "Aggressor (Lv. 15)"],
    "bride": ["Rally Heart (Lv. 1)", "Bond (Lv. 15)"],
}

NO_SKILL_CLASSES = {"soldier", "merchant", "revenant", "entombed", "conqueror", "lodestar", "grima", "mirage"}

with open(CLASSES_FILE, "r") as f:
    classes_data = json.load(f)

class_ids = {cls["id"] for cls in classes_data}

for cid in FROZEN_MAPPING:
    if cid not in class_ids:
        print(f"ERROR: Class ID '{cid}' from frozen mapping not found in classes.json")
        exit(1)

for cid in NO_SKILL_CLASSES:
    if cid not in class_ids:
        print(f"ERROR: No-skill class ID '{cid}' not found in classes.json")
        exit(1)

already_populated = []
newly_populated = []
skipped = []

for cls in classes_data:
    cid = cls["id"]
    if cls.get("classAbilities") and len(cls["classAbilities"]) > 0:
        if cid in FROZEN_MAPPING:
            expected = FROZEN_MAPPING[cid]
            if cls["classAbilities"] != expected:
                print(f"WARNING: {cid} already has abilities {cls['classAbilities']}, expected {expected}. Leaving unchanged.")
            already_populated.append(cid)
        else:
            already_populated.append(cid)
        continue

    if cid in FROZEN_MAPPING:
        cls["classAbilities"] = FROZEN_MAPPING[cid]
        newly_populated.append(cid)
    elif cid in NO_SKILL_CLASSES:
        skipped.append(cid)
    else:
        print(f"WARNING: Class '{cid}' has empty classAbilities but is not in mapping or no-skill list")

with open(CLASSES_FILE, "w") as f:
    json.dump(classes_data, f, indent=2)
    f.write("\n")

print(f"Already populated (unchanged): {len(already_populated)} classes")
print(f"Newly populated: {len(newly_populated)} classes: {newly_populated}")
print(f"No-skill classes (kept empty): {len(skipped)} classes: {list(skipped)}")

empty_after = [c["id"] for c in classes_data if not c.get("classAbilities")]
print(f"Classes with empty classAbilities after update: {len(empty_after)} -> {empty_after}")
