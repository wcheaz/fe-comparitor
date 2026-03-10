import json
import os

# 1. Load the raw scraped data
with open("../dev/awakening_scraped_raw.json", "r") as f:
    raw = json.load(f)

# 2. Define standard helpers
def n(name):
    """Normalizes string for dictionary key matching."""
    if not isinstance(name, str): return ""
    return name.replace(" ", "_").lower()

def safe_int(val):
    """Safely extracts integer values from scraped strings."""
    if val == "" or val is None: return 0
    try: return int(float(val))
    except: return 0

# 3. Create lookup maps from the raw data
promotions_map = {}
for row in raw.get("promotions", []):
    key = n(row.get("Class", ""))
    promoted_list = [n(p) for p in row.get("Promotion options", [])]
    if key and promoted_list:
        promotions_map[key] = promoted_list

# Load the classes data
classes_file = "../data/awakening/classes.json"
classes_file = os.path.abspath(classes_file)

if not os.path.exists(classes_file):
    print(f"Classes file not found at {classes_file}")
    exit(1)

with open(classes_file, "r") as f:
    classes_data = json.load(f)

# Update the promotesTo lists
updated = 0
for cls in classes_data:
    if cls["id"] in promotions_map:
        # Avoid overriding with duplicates
        cls["promotesTo"] = list(set(promotions_map[cls["id"]]))
        updated += 1

# 6. Write to the final data directory
with open(classes_file, "w") as f:
    json.dump(classes_data, f, indent=2)

print(f"Successfully updated {updated} classes with promotion paths.")
