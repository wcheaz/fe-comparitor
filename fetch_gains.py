import urllib.request
from bs4 import BeautifulSoup
import json

url = "https://serenesforest.net/binding-blade/classes/promotion-gains/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read()

soup = BeautifulSoup(html, 'html.parser')

tables = soup.find_all('table')
if len(tables) > 0:
    rows = tables[0].find_all('tr')
    headers = [th.text.strip() for th in rows[0].find_all('th')]
    print("Headers:", headers)
    for row in rows[1:]:
        cols = [td.text.strip() for td in row.find_all('td')]
        if len(cols) > 0:
            print(f"Class: {cols[0]}, Gains: {cols[1:]}")
else:
    print("No tables found")
