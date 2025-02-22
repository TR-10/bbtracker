import asyncio
from playwright.async_api import async_playwright
from difflib import unified_diff
import json
from bs4 import BeautifulSoup
import sqlite3
    
async def getTable(page):
    soup = BeautifulSoup(page, 'html.parser')
    tables = soup.find_all('table')
    all_tables_data = []

    for table in tables:
        caption= table.find('caption').text.strip() if table.find('caption') else None
        headers = [header.text.strip() for header in table.find('thead').find_all('th')]
        # if(caption != "Category Leaders - Points"):
        #     continue
        
        # print(headers)
        table_metadata = {

            'caption': caption,
            'headers': headers
        }
        print(caption)
        
        # first_row = [header.text.strip() for header in table.find('tbody').find_all('td')]
        # print(json.dumps(first_row, indent=4))
        # first_row = [header.find('data-label') for header in table.find('tbody').find_all('tr')]
        # print(first_row)
        rows = []
        for row in table.find_all('tr')[1:]:
            # print(row)
            cells = row.find_all(['td'])
    #         if len(cells) == 1 and cells[0].has_attr('colspan'):
    #         else:
            # print(cells[4])
            # for cell in cells:
                # print (cell)
                # print (cell.attrs)
                # print(cell.find('data-label'))
            row_data = [{f"{cell.attrs.get('data-label')}":cell.text.strip()} for cell in cells]
            rows.append(row_data)
            # break
            
        # print(json.dumps(rows, indent=4))
        # table_data = [dict(zip(headers, row)) for row in rows if len(row) == len(headers)]
        table_data={}
        table_metadata['rows'] = rows
        all_tables_data.append(table_metadata)
        # break
    try:
        with open('table_data.json', 'r') as f:
            existing_data = json.load(f)
    except FileNotFoundError:
        existing_data = []

    for new_table in all_tables_data:
        if new_table not in existing_data:
            existing_data.append(new_table)

    with open('table_data.json', 'w') as f:
        json.dump(existing_data, f, indent=4)

    return all_tables_data

async def main():
    async with async_playwright() as p:
        #  p.firefox, p.webkit
        for browser_type in [p.chromium]:
            browser = await browser_type.launch(headless=True)
            page = await browser.new_page()
            url = 'https://athletics.claflin.edu/sports/mens-basketball/roster/2024-25'
            await page.goto(url)
            # await page.goto('#individual')
            await page.wait_for_load_state('domcontentloaded')
            await page.screenshot(path=f'roster_page.png', full_page=True) 
            content= await page.content()
            soup = BeautifulSoup(content, 'html.parser')
            roster_list = soup.find('section', {'aria-label':"Men's Player Roster"}).find_all('li')
            roster = {}
            for player in roster_list:
                
                player_data = {}
                name_tag = player.find('h3')
                name  = name_tag.text.strip() if name_tag else None
                if name:
                    player_data['name'] =' '.join(name.split())
                    

                position_tag = player.find('div', {"class": "sidearm-roster-player-position"})
                
                jersey_number = player.find('span', {"class": "sidearm-roster-player-jersey-number"})
                # print(position_tag)
   
                # if position_tag == None:
                #     position_tag = player.find('span', {"class": "sidearm-roster-player-position"})
                player_data['position'] = position_tag.find('span', {"class": "sidearm-roster-player-position-long-short","class": "text-bold"}).text.replace("\t","").replace("\n","").strip().split(" ")[0] if position_tag else None
                
                player_data['jersey_number'] = jersey_number.text.strip() if jersey_number else None
                
                height_tag = player.find('span', {"class": "sidearm-roster-player-height"})
                player_data['height'] = height_tag.text.replace("\"","").strip() if height_tag else None

                image_tag = player.find('img')
                player_data['image'] = image_tag['data-src'] if image_tag and 'data-src' in image_tag.attrs else None

                class_tag = player.find('span', {"class": "sidearm-roster-player-academic-year"})
                player_data['class'] = class_tag.text.strip() if class_tag else None

                hometown_tag = player.find('span', {"class": "sidearm-roster-player-hometown"})
                player_data['hometown'] = hometown_tag.text.strip() if hometown_tag else None

                high_school_tag = player.find('span', {"class": "sidearm-roster-player-highschool"})
                player_data['high_school'] = high_school_tag.text.strip() if high_school_tag else None
                roster.update({player_data['name']:player_data})
                print(player_data)

            conn = sqlite3.connect('basketball_stats.db')
            c = conn.cursor()
            c.execute('''
                      DROP TABLE IF EXISTS player''')
            
            c.execute('''
                CREATE TABLE  player (
                    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    position TEXT,
                    jersey_number TEXT,
                    height TEXT,
                    image TEXT,
                    class TEXT,
                    hometown TEXT,
                    high_school TEXT
                )
            ''')

            for player_name, player_data in roster.items():
                c.execute('''
                    INSERT OR REPLACE INTO player (name, position,jersey_number, height, image, class, hometown, high_school)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    player_data['name'],
                    player_data['position'],
                    player_data['jersey_number'],
                    player_data['height'],
                    player_data['image'],
                    player_data['class'],
                    player_data['hometown'],
                    player_data['high_school']
                ))

            conn.commit()
            conn.close()
            print(json.dumps(roster, indent=4))
            await browser.close()

asyncio.run(main())