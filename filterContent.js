const cheerio = require('cheerio');
const axios = require('axios');

function filterSearchContent(url) {
    return axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const manhwaList = [];

            $('div.listupd div.bs div.bsx').each((i, el) => {
                const title = $(el).find('a').attr('title');
                const link = $(el).find('a').attr('href');
                const type = $(el).find('div.limit span.type').text();

                if (type === 'Manhwa') {
                    manhwaList.push({ title, link, type });
                }
            });

            return manhwaList;
        })
        .catch(error => {
            throw error;
        });
}

async function filterCapContent(url) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const capList = [];

    $('div.eplister ul.clstyle li').each((i, el) => {
        const link = $(el).find('a').attr('href');
        capList.push(link);
    });

    const reversedCapList = capList.reverse();
    const count = reversedCapList.length;

    return { count, links: reversedCapList };
}

async function fetchAndProcessChapters(capList) {
    console.log("Fetching and processing chapters...");

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const capCount = capList.length;
    const validOptions = ['all', 'exit'];

    // Ask the user for their choice
    const choice = await new Promise(resolve => {
        readline.question(`Enter 'all' to fetch all chapters, 'exit' to exit, or specify a range or index (e.g., 10-29, 5): `, choice => {
            readline.close();
            resolve(choice);
        });
    });

    if (validOptions.includes(choice.toLowerCase())) {
        if (choice.toLowerCase() === 'all') {
            // Fetch and process all chapters
            console.log(`Fetching all ${capCount} chapters...`);
            return capList.links.forEach(async (link, index) => {
                console.log(`Fetching and processing chapter ${index + 1}: ${link}`);
                try {
                    const chapterContent = await fetchChapterContent(link);
                    const processedContent = processChapter(chapterContent);
                    console.log(processedContent);
                } catch (error) {
                    console.error(`Error fetching or processing chapter: ${link}`);
                }
            });
            } 
            else if (choice.toLowerCase() === 'exit') 
                return;
        } 
    else if (choice.includes('-')) {
        const [start, end] = choice.split('-').map(num => parseInt(num, 10));
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= capCount) {
            console.log(`Fetching chapters from ${start} to ${end}...`);
            console.log(`Select ` + `${end - start + 1}` + ` chapters`)
            for (let i = start - 1; i < end; i++) {
                const link = capList[i].link;
                console.log(`Fetching and processing chapter ${i + 1}: ${link}`);
                try {
                    const chapterContent = await fetchChapterContent(link);
                    const processedContent = processChapter(chapterContent);
                    console.log(processedContent);
                } catch (error) {
                    console.error(`Error fetching or processing chapter: ${link}`);
                }1
            }
        } else {
            console.log("Invalid range. Please enter a valid range.");
            }
    } 
    else {
        const index = parseInt(choice, 10);
        if (!isNaN(index) && index >= 1 && index <= capCount) {
            const link = capList[index - 1].link;
            console.log(`Fetching and processing chapter ${index}: ${link}`);
            try {
                const chapterContent = await fetchChapterContent(link);
                const processedContent = processChapter(chapterContent);
                console.log(processedContent);
            } catch (error) {
                console.error(`Error fetching or processing chapter: ${link}`);
            }
        } else {
            console.log("Invalid choice. Please select a valid range or index.");
        }
    }
}

module.exports = {
    filterSearchContent,
    filterCapContent,
    fetchAndProcessChapters
};
