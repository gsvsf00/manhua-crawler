const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');
const { performSearchAndGetURL } = require('./search.js');
const { filterCurrentURLContent } = require('./filterContent.js');

async function main() {
    const option = await getOptionFromUser();

    if (option === 'crawl') {
        const content = await getContentFromUser('Enter the URL to crawl: ');
        if (content) {
            console.log("Starting crawler for " + content);
            const pages = await crawlPage(content, content, {});
            printReport(pages);
        } else {
            console.log("Invalid input");
        }
    } else if (option === 'search') {
        const searchTerm = await getContentFromUser('Enter the content to search: ');
        if (searchTerm) {
            const pageUrl = await performSearchAndGetURL(searchTerm);
            const filteredContent = await filterCurrentURLContent(pageUrl); // Use the new function
            console.log(filteredContent);
            
        } else {
            console.log("Invalid input");
        }
    } else {
        console.log("Invalid option");
    }
}

async function getOptionFromUser() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        readline.question('Choose an option ("crawl" or "search"): ', option => {
            readline.close();
            resolve(option);
        });
    });
}

async function getContentFromUser(prompt) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        readline.question(prompt, content => {
            readline.close();
            resolve(content);
        });
    });
}

main();
