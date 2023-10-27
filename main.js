const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');
const { getContentFromUser, getOptionFromUser, getSelectedLinkIndex, getCapChoice } = require('./userInput.js');
const { performSearchAndGetURL } = require('./search.js');
const { filterSearchContent, filterCapContent, fetchAndProcessChapters } = require('./filterContent.js');

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
    }
    else if (option === 'search') {
        const searchTerm = await getContentFromUser('Enter the content to search: ');
        if (searchTerm) {
            const pageUrl = await performSearchAndGetURL(searchTerm);

            if (!pageUrl)
                process.exit(1);

            const filteredLinks = await filterSearchContent(pageUrl);
            console.log("Filtered links with titles:");

            for (let i = 0; i < filteredLinks.length; i++) {
                console.log(`${i + 1}. Title: ${filteredLinks[i].title}, Link: ${filteredLinks[i].link}`);
            }

            const selectedLinkIndex = await getSelectedLinkIndex(filteredLinks.length);
            const selectedLink = filteredLinks[selectedLinkIndex];

            //clearConsole();

            console.log("Selected link:", selectedLink.link);
            const capList = await filterCapContent(selectedLink.link);
            console.log("It has " + capList.count + " caps");

            const chaptersChoose = await fetchAndProcessChapters(capList);
            console.log("ChaptersChoose: ", chaptersChoose);
        } 
        else
            console.log("Invalid input");
    } 
    else 
        console.log("Invalid option");
}

main();
