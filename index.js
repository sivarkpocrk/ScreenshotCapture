const puppeteer = require('puppeteer');
const path = require('path');

// Get command-line arguments
const [,, start, end, googleUrl, rejectSelector, searchBoxSelector, queryTemplate] = process.argv;

(async () => {
    for (let i = parseInt(start); i <= parseInt(end); i++) {
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(googleUrl);

            try {
                await page.click(rejectSelector);
            } catch (e) {
                console.log(`No "Reject All" button found: ${e.message}`);
            }

            // Create the search query by replacing the placeholder in the template
            const searchQuery = queryTemplate.replace('${i}', i);
            await page.type(searchBoxSelector, searchQuery);
            await page.keyboard.press('Enter');

            await page.waitForNavigation();

            const links = await page.$$('[jsname="UWckNb"]');
            if (links.length > 0) {
                await links[0].click();
                await page.waitForNavigation();
            } else {
                console.log(`No search results found for question ${i}`);
                continue;
            }

            await page.waitForSelector('a.btn.btn-primary.reveal-solution', { timeout: 10000 });

            await page.click('a.btn.btn-primary.reveal-solution');

            // Use a path relative to the artifacts staging directory
            const screenshotPath = path.join(process.env.ARTIFACT_STAGING_DIRECTORY, `screenshots/Question_${i}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: true });

            await browser.close();
        } catch (error) {
            console.log(`An error occurred with question ${i}: ${error.message}`);
        }
    }
})();

