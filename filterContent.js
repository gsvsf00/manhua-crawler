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

function filterCapContent(url) {
    return axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const capList = [];

            $('div.lchx').each((i, el) => {
                const title = $(el).find('a').attr('title');
                const link = $(el).find('a').attr('href');

                capList.push({ title, link });
            });

            return capList;
        })
        .catch(error => {
            throw error;
        });
}

module.exports = {
    filterSearchContent,
    filterCapContent
};
