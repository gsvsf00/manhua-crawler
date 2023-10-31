const cheerio = require('cheerio');
const axios = require('axios');
const { transcode } = require('buffer');

function filterSearchContent(url) {
    if (!url) {
        throw new Error("URL not provided");
    }
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
    if (!url) {
        throw new Error("URL not provided");
    }

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

    // Get the title
    const title = $('h1.entry-title').text().trim();

    return { title, count, links: reversedCapList };
}

async function fetchAndProcessChapters(capList) {
    console.log("\nFetching and processing chapters...");

    const caplist = capList;

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const validOptions = ['all', 'exit'];

    // Ask the user for their choice
    const choice = await new Promise(resolve => {
        readline.question(`\nEnter 'all' to fetch all chapters, 'exit' to exit, or specify a range or index (e.g., 10-29, 5): `, choice => {
            readline.close();
            resolve(choice);
        });
    });

    if (validOptions.includes(choice.toLowerCase())) {
        if (choice.toLowerCase() === 'all') {
            console.log(`\nFetching all ${caplist.count} chapters...`);
            const selectedLinks = [];

            for (let i = 0; i < caplist.count; i++) {
                console.log("\nFetching and processing chapter:[",i+1,"] -", caplist.links[i]);
                selectedLinks.push(caplist.links[i]);
            }
            return { chapter: [1, caplist.count], links: selectedLinks };
        } 
        else if (choice.toLowerCase() === 'exit') {
            return;
        }
    } else if (choice.includes('-')) {
        const [start, end] = choice.split('-').map(num => parseInt(num, 10));
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= caplist.count) {
            console.log(`\nFetching chapters from ${start} to ${end}...`);
            console.log(`Select ${end - start + 1} chapters`);

            const selectedLinks = [];

            for (let i = start - 1; i < end; i++) {
                console.log("\nFetching and processing chapter:[",i+1,"] -", caplist.links[i]);
                selectedLinks.push(caplist.links[i]);
            }

            return { chapter: [start, end], links: selectedLinks };
        } else {
            console.log("Invalid range. Please enter a valid range.");
            return fetchAndProcessChapters(capList); // Return the result of the recursive call
        }
    } else {
        const index = parseInt(choice, 10);
        if (!isNaN(index) && index >= 1 && index <= caplist.count){
            const link = caplist.links[index];
            console.log("\nFetching and processing chapter:[",index,"] -", caplist.links[index]);
            return { chapter: index, links: [link] };
        } else {
            console.log("Invalid choice. Please select a valid range or index.");
            return fetchAndProcessChapters(capList); // Return the result of the recursive call
        }
    }
}

function filterImgFromCapContent(imageList) {
    if (!imageList) {
        throw new Error("Images not found");
    }

    return axios.get(imageList)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const imgList = [];

            $('div#readerarea img').each((i, el) => {
                const link = $(el).attr('src');

                if (!link.includes('https://www.asurascans.com/wp-content/uploads/2021/04/page100-10.jpg') && !link.includes('https://asuracomics.com/wp-content/uploads/2023/05/EndDesignPSD02.png')) {
                    imgList.push(link);
                }
            });

            return imgList;
        })
        .catch(error => {
            throw error;
        });
}


module.exports = {
    filterSearchContent,
    filterCapContent,
    fetchAndProcessChapters,
    filterImgFromCapContent
};