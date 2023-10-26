const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')

async function main() {
    if (process.argv.length < 3 || process.argv.length > 3) {
        console.log("Usage: npm start <Website>")
        process.exit(1)
    }

    const baseUrl = process.argv[2]

    console.log("Starting crawler of " + baseUrl)
    const pages = await crawlPage(baseUrl, baseUrl, {})

    printReport(pages)
}

main()