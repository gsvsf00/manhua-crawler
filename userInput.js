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

async function getSelectedLinkIndex(maxIndex) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        readline.question(`Select a link (1-${maxIndex}): `, choice => {
            readline.close();
            const index = parseInt(choice, 10);
            if (index >= 1 && index <= maxIndex) {
                resolve(index - 1); // Convert to zero-based index
            } else {
                console.log("Invalid choice. Please select a valid link.");
                resolve(getSelectedLinkIndex(maxIndex)); // Ask again
            }
        });
    });
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

module.exports = {
    getOptionFromUser,
    getContentFromUser,
    getSelectedLinkIndex,
    getCapChoice
};