from bs4 import BeautifulSoup

with open('awakening_classes.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

heading = soup.find(id='Fire_Emblem_Awakening')
table = heading.find_next('table')

rows = table.find_all('tr')
cells = rows[0].find_all(['th', 'td'])
print("Headers length:", len(cells))
for c in cells:
    print(repr(c.text.strip()))
