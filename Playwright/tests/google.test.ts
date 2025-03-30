import { test, expect, chromium } from '@playwright/test';

test('Google Search Test', async () => {
    const browser = await chromium.launch({ headless: false }); // Set headless to false to show the browser
    const page = await browser.newPage();

    // Navigate to Google
    await page.goto('https://www.google.com');

    // Accept Cookies (if prompted)
    const acceptCookies = page.locator('button:text("Accept all")');
    if (await acceptCookies.isVisible()) {
        await acceptCookies.click();
    }

    // Type in the search box
    const searchBox = page.locator('textarea[name="q"]');
    await searchBox.fill('Playwright testing');
    
    // Press Enter
    await searchBox.press('Enter');

    console.log('Test Passed: Search results are displayed');

    await browser.close(); // Close the browser after the test
});
