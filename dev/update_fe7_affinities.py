import json
import os

units_file = 'data/blazing_blade/units.json'
scraped_file = 'scraped_fe7.json'

with open(units_file, 'r', encoding='utf-8') as f:
    units_data = json.load(f)
    
with open(scraped_file, 'r', encoding='utf-8') as f:
    scraped_data = json.load(f)
    
bases = scraped_data.get('bases', {})

modified = False
for unit in units_data:
    name = unit.get('name', '')
    search_name = name
    if search_name.endswith(' (FE7)'):
        search_name = search_name.replace(' (FE7)', '')
        
    scraped_unit = bases.get(search_name)
    if not scraped_unit and search_name == 'Wallace':
        scraped_unit = bases.get('Wallace *') or bases.get('Wallace')
        
    if scraped_unit and scraped_unit.get('affinity'):
        # Filter affinities to exact known types or valid strings
        # E.g. Affin_Anima might be the image name if alt was empty, but usually alt="Anima"
        affin = scraped_unit['affinity']
        if affin.startswith('Affin_'):
            affin = affin.replace('Affin_', '').replace('.png', '')
            
        if unit.get('affinity') != affin:
            unit['affinity'] = affin
            modified = True
            print(f"Updated affinity for {name} to {affin}")
    else:
        print(f"Could not find valid affinity for {name}")

if modified:
    with open(units_file, 'w', encoding='utf-8') as f:
        json.dump(units_data, f, indent=4)
    print("Done writing.")
else:
    print("No changes made.")
