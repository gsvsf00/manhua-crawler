const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');
const { getContentFromUser, getOptionFromUser, getSelectedLinkIndex } = require('./userInput.js');
const { performSearchAndGetURL } = require('./search.js');
const { filterSearchContent, filterCapContent } = require('./filterContent.js');

function clearConsole() {
    console.clear();
}

async function main() {
    const option = await getOptionFromUser();

    if (option === 'crawl') {
        const content = await getContentFromUser('Enter the URL to crawl: ');
        if (content) {
            console.log("Starting crawler for " + content);
            const capList = await filterCapContent(content);
            console.log("It has " + capList.numCaps + " caps");
            console.log(capList);
        } else {
            console.log("Invalid input");
        }
    } else if (option === 'search') {
        const searchTerm = await getContentFromUser('Enter the content to search: ');
        if (searchTerm) {
            const pageUrl = await performSearchAndGetURL(searchTerm);
            const filteredLinks = await filterSearchContent(pageUrl);
            console.log("Filtered links with titles:");

            for (let i = 0; i < filteredLinks.length; i++) {
                console.log(`${i + 1}. Title: ${filteredLinks[i].title}, Link: ${filteredLinks[i].link}`);
            }

            const selectedLinkIndex = await getSelectedLinkIndex(filteredLinks.length);
            const selectedLink = filteredLinks[selectedLinkIndex];

            clearConsole();

            console.log("Selected link:", selectedLink.link);
            const capList = await filterCapContent(selectedLink.link);
            console.log("It has " + capList.numCaps + " caps");
            // Ask the user if they want to fetch all caps or specify a range
            const capChoice = await getCapChoice();
            if (capChoice === 'all') {
                console.log("Fetching all chapters...");
                // Fetch and process all chapters
                fetchAndProcessChapters(capList.capList);
            } else if (capChoice.includes('-')) {
                const [start, end] = capChoice.split('-').map(num => parseInt(num, 10));
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    console.log(`Fetching chapters from ${start} to ${end}...`);
                    const chaptersToFetch = capList.capList.slice(start - 1, end);
                    // Fetch and process chapters within the specified range
                    fetchAndProcessChapters(chaptersToFetch);
                } else {
                    console.log("Invalid range. Please enter a valid range.");
                }
            }
        } else {
            console.log("Invalid input");
        }
    } else {
        console.log("Invalid option");
    }
}

async function getCapChoice() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        readline.question(`Enter 'all' to fetch all chapters or specify a range (e.g., 10-29): `, choice => {
            readline.close();
            resolve(choice);
        });
    });
}

async function fetchAndProcessChapters(chapterLinks) {
    console.log("Fetching and processing chapters...");
    for (const link of chapterLinks) {
        console.log(`Fetching and processing chapter: ${link}`);
        // Add your logic to fetch and process the chapter using the link
        // For example, you can use Axios or another HTTP library to fetch the chapter content
        // and then process it as needed.
    }
}

main();
