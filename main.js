const { getContentFromUser, getOptionFromUser, getSelectedLinkIndex, getPDFGenerationChoice } = require('./userInput.js');
const { performSearchAndGetURL } = require('./search.js');
const { filterSearchContent, filterCapContent, fetchAndProcessChapters } = require('./filterContent.js');
const { createPdfFromChoice } = require('./makePdf.js');

async function main() {
    const option = await getOptionFromUser();
    let capList = null;
    let chaptersChoose = null;

    if (option === '1') {
        const content = await getContentFromUser('Enter the URL to crawl: ');
        if (content) {
            console.log("Starting crawler");

            capList = await filterCapContent(content);

            console.log("\nSelected link:", content);
            console.log("It has " + capList.count + " caps");

            chaptersChoose = await fetchAndProcessChapters(capList);

            createPdfFromChoice(chaptersChoose, capList.title);
        } else {
            console.log("Invalid input");
        }
    } else if (option === '2') {
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

            console.log("Selected link:", selectedLink.link);
            capList = await filterCapContent(selectedLink.link);
            console.log("It has " + capList.count + " caps");

            chaptersChoose = await fetchAndProcessChapters(capList);

            createPdfFromChoice(chaptersChoose, capList.title);

        } else {
            console.log("Invalid input");
        }
    } else {
        console.log("Invalid option");
    }
}

main();
