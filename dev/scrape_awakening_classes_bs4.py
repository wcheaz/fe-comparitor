import requests
from bs4 import BeautifulSoup
import json

url = "https://fireemblemwiki.org/wiki/List_of_classes_in_Fire_Emblem_Awakening"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    tables = soup.find_all('table', class_='wikitable')
    print(f"Found {len(tables)} wikitables.")
    
    all_classes = []
    
    for table in tables:
        rows = table.find_all('tr')
        if not rows: continue
        
        # Get headers
        header_row = rows[0]
        headers_texts = [th.text.strip() for th in header_row.find_all(['th', 'td'])]
        
        for row in rows[1:]:
            cols = row.find_all(['th', 'td'])
            if len(cols) < 2: continue
            
            # The class name is usually the first column, sometimes with an image
            class_name_a = cols[0].find('a')
            class_name = class_name_a.text.strip() if class_name_a else cols[0].text.strip()
            
            # Extract basic info (Promotes from, Promotes to, etc.)
            # This is just to get the list of class names and basic structure
            class_info = {"Name": class_name}
            
            for i, col in enumerate(cols):
                if i < len(headers_texts):
                    header = headers_texts[i]
                    # Get text, strip citations [1], [2]
                    text = col.text.strip()
                    import re
                    text = re.sub(r'\[\d+\]', '', text)
                    class_info[header] = text
            
            # Clean up newlines in text
            for k, v in class_info.items():
                class_info[k] = v.replace('\n', ', ')
                
            all_classes.append(class_info)
            
    with open("dev/awakening_classes_raw.json", "w") as f:
        json.dump(all_classes, f, indent=2)
    print("Saved tables to dev/awakening_classes_raw.json")
except Exception as e:
    print(f"Error: {e}")
