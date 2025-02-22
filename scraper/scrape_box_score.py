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
        if(caption != "None"):
            continue
        
        # print(headers)
        table_metadata = {

            'caption': caption,
            'headers': headers
        }
        print(caption)
        print(headers)
        
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
            #     print (cell.text.strip())
            #     print (cell.attrs)bre
                # print(cell.find('data-label'))
            row_data = [{f"{cell.attrs.get('data-label')}":cell.text.strip()} for cell in cells]
            rows.append(row_data)
            # break  
    
async def main(game_id=None, box_score_url=None):
    async with async_playwright() as p:
        #  p.firefox, p.webkit
        for browser_type in [p.chromium]:
            browser = await browser_type.launch(headless=True)
            page = await browser.new_page()
            url = 'https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/millersville-university/boxscore/3573'
            url = box_score_url if box_score_url else url
            await page.goto(url)
            # await page.goto('#individual')
            await page.wait_for_load_state('domcontentloaded')
            # await page.screenshot(path=f'roster_page.png', full_page=True) 
            content= await page.content()
            
            soup = BeautifulSoup(content, 'html.parser')
            box_score = soup.find('section', {'id':'box-score'})
            home_team = box_score.findAll('table', {'class':'overall-stats'})
            # away_team = box_score.find('div', {'class':'team away'})
            # home_stats_table = home_team.find('table', {'class':'sidearm-table'})
            # print(await getTable(content))
            rows = []
            for table in home_team:
                headers = [header.text.strip() for header in table.find('thead').find_all('th')]
         
                # print(headers)
                
                # first_row = [header.text.strip() for header in table.find('tbody').find_all('td')]
                # print(json.dumps(first_row, indent=4))
                caption = table.find('caption').text.strip() if table.find('caption') else None
                if not caption :
                    continue
                team_name = caption.split(' ')[0]
                print(f"Team name: {team_name}")
                rows = []
                rows.append(headers)
                for row in table.find('tbody').find_all('tr'):
                    cells = row.find_all('td')
                    row_data = [cell.text.strip() for cell in cells]
                    rows.append(row_data)
                for row in rows:
                    print(len(row))
                conn = sqlite3.connect('basketball_stats.db')
                c = conn.cursor()

                # Drop the table if it exists
                # c.execute('DROP TABLE IF EXISTS box_score')
                # # Create table if it doesn't exist
                # c.execute('''
                #     CREATE TABLE IF NOT EXISTS box_score (
                #         game_id INTEGER ,
                #         team_name TEXT,
                #         player_number TEXT,
                #         player TEXT,
                #         gs TEXT,
                #         min TEXT,
                #         fg TEXT,
                #         pt3 TEXT,
                #         ft TEXT,
                #         orb_drb TEXT,
                #         reb TEXT,
                #         pf TEXT,
                #         a TEXT,
                #         trn TEXT,
                #         blk TEXT,
                #         stl TEXT,
                #         pts TEXT,
                #         PRIMARY KEY (game_id, team_name, player_number)
                #     )
                # ''')

                # Insert data into the table
                for row in rows[1:]:  # Skip the header row
                    c.execute('''
                        INSERT INTO box_score (
                            game_id, team_name, player_number, player, gs, min, fg, pt3, ft, orb_drb, reb, pf, a, trn, blk, stl, pts
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', [game_id]+[team_name] + row)

                # Commit the transaction
                conn.commit()

                # Close the connection
                conn.close()
                # break
        
            # print(home_team[0])
            
            

            # with open('roster.json', 'w') as f:
            #     json.dump(roster, f, indent=4)
            # print(json.dumps(roster, indent=4))
            await browser.close()

asyncio.run(main())