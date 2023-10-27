const puppeteer = require('puppeteer');

async function performSearchAndGetURL(searchQuery) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    // Navigate to the website
    await page.goto('https://asuratoon.com/'); // Replace with the actual website URL

    // Find the search input field by its ID
    const searchInput = await page.$('#s');

    if (!searchInput) {
      console.log("Search input field not found. Site not compatible.");
      return;
    }
    // Type the search query into the input field
    await searchInput.type(searchQuery);

    // Submit the search form (if there is one)
    await searchInput.press('Enter');

    // Wait for the search results to load (you may need to customize this wait time)
    await new Promise(r => setTimeout(r, 5000)); // Wait for 5 seconds in this example

    // Use page.evaluate to get the current URL
    const currentURL = page.url();

    // Close the browser when done
    await browser.close();

    return currentURL;
  } catch (error) {
      console.error("An error occurred while performing the search:");
      return;
  }
}

module.exports = {
    performSearchAndGetURL
}
