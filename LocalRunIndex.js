const puppeteer = require('puppeteer');

(async () => {
    for (let i = 351; i <= 462; i++) {
        try {
            // Launch the Chrome browser
            const browser = await puppeteer.launch({ headless: true }); // set headless to false if you want to see the browser actions
            const page = await browser.newPage();

            // Navigate to Google
            await page.goto('https://www.google.com');

            // Select the "Reject All" button and click it
            try {
                await page.click('#W0wltc > div');
            } catch (e) {
                console.log(`No "Reject All" button found: ${e.message}`);
            }

            // Type "exam topic question 1" into the search box and press Enter
            await page.type('#APjFqb', `examtopics az 104 question ${i}`);
            await page.keyboard.press('Enter');

            // Wait for the results page to load
            await page.waitForNavigation();

            // Click the first link in the search results
            const links = await page.$$('[jsname="UWckNb"]');
            if (links.length > 0) {
                await links[0].click();
                await page.waitForNavigation();
            } else {
                console.log(`No search results found for question ${i}`);
                continue;
            }

            // Increase timeout duration and wait for the solution button
            await page.waitForSelector('a.btn.btn-primary.reveal-solution', { timeout: 10000 });

            // Click the button after the first link is clicked
            await page.click('a.btn.btn-primary.reveal-solution');

            // Take the full page screenshot and save to the local disk, change the folder as required
            await page.screenshot({ path: `C:\\joyfu\\az-104\\Question_${i}.png`, fullPage: true });

            // Close the browser
            await browser.close();
        } catch (error) {
            console.log(`An error occurred with question ${i}: ${error.message}`);
        }
    }
})();
