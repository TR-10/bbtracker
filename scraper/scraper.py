import asyncio
from playwright.async_api import async_playwright
from difflib import unified_diff
import json
from bs4 import BeautifulSoup
    
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
            #     print (cell)
            #     print (cell.attrs)bre
                # print(cell.find('data-label'))
            row_data = [{f"{cell.attrs.get('data-label')}":cell.text.strip()} for cell in cells]
            rows.append(row_data)
            # break
            
        print(json.dumps(rows, indent=4))
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
            url = 'https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25#game-highs'
            await page.goto(url)
            # await page.goto('#individual')
            await page.wait_for_load_state('domcontentloaded')
            await page.screenshot(path=f'game-highs.png', full_page=True)
            content1= await page.content()
            
            url = 'https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25'
            await page.goto(url)
            # await page.goto('#individual')
            await page.wait_for_load_state('domcontentloaded')
            await page.screenshot(path=f'team-stats.png', full_page=True) 
            content2= await page.content()
            await getTable(await page.content())
            # if content1 == content2:
            #     print("The contents are equal.")
            # else:
            #     print("The contents are not equal.")
            #     diff = unified_diff(content1.splitlines(), content2.splitlines(), fromfile='game-highs.html', tofile='team-stats.html', lineterm='')
            #     for line in diff:
            #         pass
            #         # print(line)
            await browser.close()

# asyncio.run(main())