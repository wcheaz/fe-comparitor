import json
import urllib.request
from bs4 import BeautifulSoup

url = "https://serenesforest.net/the-sacred-stones/classes/promotion-gains/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read()
    print("Scraped successfully.")
    
    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('table')
    for i, table in enumerate(tables):
        rows = table.find_all('tr')
        for j, row in enumerate(rows):
            cols = [col.text.strip() for col in row.find_all(['td', 'th'])]
            print(f"Table {i} Row {j}: {cols}")
except Exception as e:
    print(f"Error: {e}")
