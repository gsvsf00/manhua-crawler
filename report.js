function printReport(pages) {
    console.log("------------")
    console.log("Page Report:")
    console.log("------------")

    const sortedPages = sortPages(pages)

    for (const sortedPage of sortedPages) {
        const url = sortedPage[0]
        const hits = sortedPage[1]
        console.log(`Found ${hits} links to page: ${url}}`)
    }

    console.log("------------")
    console.log("End of Page Report:")
    console.log("------------")
}

function sortPages(pages) {
    const pageArray = Object.entries(pages)
    pageArray.sort((a, b) => {
        aHits = a[1]
        bHits = b[1]
        return b[1] - a[1]
    })
    return pageArray
}



module.exports = {
    sortPages,
    printReport
}