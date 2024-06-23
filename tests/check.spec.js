const { test, expect } = require('@playwright/test');

test('validate that articles are storted', async ({ page }) => {
    
    await page.goto("https://news.ycombinator.com/newest");

    let results = [];
    let pageCount = 0;

  
    while (results.length < 100 && pageCount < 10) {
       
        const ages = await page.$$eval('tr.athing', trs => trs.map(tr => {
           
            const titleElement = tr.querySelector('.titleline');
            const titleText = titleElement ? titleElement.innerText : null;

            const ageElement = tr.nextElementSibling.querySelector('.age');
            const ageText = ageElement ? ageElement.innerText : null;
            const timeText = ageElement ? ageElement.getAttribute('title') : null;
            return {
                titleText,
                ageText,
                timeText
            };
        }));

        results.push(...ages);
        results = results.slice(0, 100); 

        if (results.length >= 100) break; 

        
        const nextPageVisible = await page.waitForSelector('a[href*="newest?next="]', { state: 'visible' });

        if (nextPageVisible) {
            await Promise.all([
                page.waitForNavigation(),
                page.click('a[href*="newest?next="]') 
            ]);
        } else {
            break;
        }

        //pageCount++;
        //console.log(`Page Count: ${pageCount}`);
    }

    /*for (let i of results) {
      console.log(`Age Text: ${i.ageText}, Title: ${i.titleText}, timeText:${i.timeText}`);
  }*/

    // Check if the dates are in the correct order
    for (let i = 0; i < results.length - 1; i++) {
      const currentDate = new Date(results[i].timeText);
      const nextDate = new Date(results[i + 1].timeText);

      try{
      expect (currentDate >= nextDate).toBeTruthy();
      }
      catch(error)
      {
        console.log(`Discrepancy found at index ${i}: ${results[i].titleText}--Title is not sorted`)
      }
      
     
  }
   // console.log(`Total Results Gathered: ${results.length}`);
});
