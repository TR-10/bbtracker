import asyncio
from datetime import datetime
from playwright.async_api import async_playwright
from difflib import unified_diff
import json
from bs4 import BeautifulSoup
import sqlite3
import re
    
async def scrapeBoxScore(url):
    for browser_type in [p.chromium]:
            browser = await browser_type.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url)
            # await page.screenshot(path=f'roster_page.png', full_page=True) 
            
    
async def main():
    async with async_playwright() as p:
        from datetime import datetime
        #  p.firefox, p.webkit
        for browser_type in [p.chromium]:
            browser = await browser_type.launch(headless=True)
            page = await browser.new_page()
            url = 'https://athletics.claflin.edu/sports/mens-basketball/schedule/2024-25'
            await page.goto(url)
            # await page.goto('#individual')
            await page.wait_for_load_state('domcontentloaded')
            await page.screenshot(path=f'roster_page.png', full_page=True) 
            content= await page.content()
            soup = BeautifulSoup(content, 'html.parser')
            schedule_list = soup.find('ul', {'class':"sidearm-schedule-games-container"}).find_all('li', {'class':'sidearm-schedule-game'})
            roster = {}
            for game in schedule_list:
                game_data = {}
                opponent = game.find('div', {'class':'sidearm-schedule-game-opponent-name'})
                date = game.find('div', {'class':'sidearm-schedule-game-opponent-date'})
                # time = game.find('div', {'class':'sidearm-schedule-game-opponent-time'})
                home = game.find('span', {'class':'sidearm-schedule-game-home'})
                away = game.find('span', {'class':'sidearm-schedule-game-away'})
                
                score = game.find('div', {'class':'sidearm-schedule-game-result'})
                opp_logo = game.find('img')
                box_score_link = game.find('li', {'sidearm-schedule-game-links-boxscore'})

                if opponent:
                    game_data['opponent'] = opponent.text.strip()
                if date:
    
                    date_str = date.text.strip()
                    date_str = date_str.replace('\n', ' ')
                    date_str = date_str.replace("p.m","PM").replace("a.m", "AM").replace(".", "")
                    print(date_str)
                    try:
                        if("TBA" not in date_str ):
                            game_datetime = datetime.strptime(date_str, '%b %d (%a) %I:%M %p')
                            game_datetime = game_datetime.replace(year = 2024 if game_datetime.month > 8 else 2025)
                            date = game_datetime.date()
                        
                            game_data['date'] = date
                            game_data['datetime'] = game_datetime
                        else:
                            game_datetime = datetime.strptime(date_str, '%b %d (%a) TBA')
                            game_datetime = game_datetime.replace(year = 2024 if game_datetime.month > 8 else 2025)
                            date = game_datetime.date()
                            # time= game_datetime.time()
                            game_data['date'] = date
                            game_data['datetime'] = game_datetime
                    except ValueError as e:
                        print(f"Error parsing date: {e}")
                        try:
                            datetime = datetime.strptime(date_str, '%b %d (%a)')
                            date = datetime.date()
                            game_data['date'] = date
                            game_data['datetime'] = game_datetime
                        except ValueError as e:
                            print(f"Error parsing date: {e}")
                            # Handle the case where the date format is unexpected
                            game_data['date'] = None
                            game_data['time'] = None
                            # game_data['date'] = datetime.strptime(date_str, '%b %d (%a)')
                            # game_data['time'] = None\
                    print(f"Parsed date: {game_data['date']}")
                    print(f"Parsed time: {game_data['datetime']}")
                # if time:
                #     game_data['datetime'] = game_dattime.text.strip()
                if away:
                    game_data['home'] = False
                if home:
                    game_data['home'] = True
                if score:
                    score = score.text.strip()
                    
                if opp_logo:
                    game_data['opp_logo'] = opp_logo['data-src']
                if box_score_link:
                    game_data['box_score_link'] = box_score_link.find('a')['href']
                if score:
                    score_text = score.strip()
                    if score_text == "Canceled":
                        game_data['win'] = None
                        game_data['claflin_score'] = None
                        game_data['opponent_score'] = None
                    else:
                        match = re.match(r'([WL]),\s*(\d+)-(\d+)', score_text)
                        if match:
                            game_data['win'] = match.group(1) == 'W'
                            game_data['claflin_score'] = int(match.group(2))
                            game_data['opponent_score'] = int(match.group(3))
                    
            
                roster[game_data['opponent']] = game_data
            print(roster)

            # with open('roster.json', 'w') as f:
            #     json.dump(roster, f, indent=4)
            # print(json.dumps(roster, indent=4))
            # Connect to the SQLite database (or create it if it doesn't exist)
            conn = sqlite3.connect('basketball_stats.db')
            c = conn.cursor()

            # Drop the table if it exists
            c.execute('DROP TABLE IF EXISTS schedule')

            # Create a table to store the schedule data
            c.execute('''
                CREATE TABLE schedule (
                    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    opponent TEXT,
                    date DATE,
                    datetime DATETIME,
                    home BOOLEAN,
                    win BOOLEAN,
                    claflin_score INTEGER,
                    opponent_score INTEGER,
                    opp_logo TEXT,
                    box_score_link TEXT
                )
            ''')

            # Insert the data into the table
            for game_data in roster.values():
                c.execute('''
                    INSERT INTO schedule (opponent, date, datetime, home, win, claflin_score, opponent_score, opp_logo, box_score_link)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    game_data.get('opponent'),
                    game_data.get('date'),
                    game_data.get('datetime'),
                    game_data.get('home'),
                    game_data.get('win'),
                    game_data.get('claflin_score'),
                    game_data.get('opponent_score'),
                    game_data.get('opp_logo'),
                    game_data.get('box_score_link')
                ))

            # Commit the transaction and close the connection
            conn.commit()
            conn.close()
            await browser.close()

asyncio.run(main())