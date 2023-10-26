const { JSDOM } = require('jsdom')

async function crawlPage(BaseURL, currentUrl, pages){
  baseURLObj = new URL(BaseURL)
  currentURLObj = new URL(currentUrl)

  if(baseURLObj.hostname !== currentURLObj.hostname) {
    return pages
  }

  const normalizeCurrentUrl = normalizeUrl(currentUrl)
  if (pages[normalizeCurrentUrl] > 0) {
    pages[normalizeCurrentUrl]++
    return pages
  }

  pages[normalizeCurrentUrl] = 1

  console.log (`Crawling ${currentUrl}`)
  try{
    const resp = await fetch(currentUrl)

    if (resp.status > 399) {
      //console.log(`Error crawling ${currentUrl}: ${resp.status}`)
      return pages
    }

    const contentType = resp.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
      //console.log(`Error crawling ${currentUrl}: ${contentType}`)
      return pages
    }

    const htmlBody = await resp.text()

    nextUrls = getURLsFromHTML(htmlBody, BaseURL)
    for (const nextUrl of nextUrls) {
      await crawlPage(BaseURL, nextUrl, pages)
    }
    
  } catch(err) {
    //console.log(`Error crawling ${currentUrl}: ${err.message}`)
  }
  return pages
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll('a');

  for (const linkElement of linkElements) {
    try {
      const urlObject = new URL(linkElement.href);
      const pathname = urlObject.pathname;
      if (pathname.startsWith('/manga/') && pathname.includes('/9766692502')) {
        urls.push(urlObject.href);
      }
    } catch (err) {
      // Handle URL parsing errors, if necessary
      // console.log(`Error with URL: ${err.message}`);
    }
  }
  return urls;
}

function getURLsFromPage(page) {
  const urls = page.$$eval('a', as => as.map(a => a.href))
  return urls
}

function normalizeUrl(url) {
  const urlObject = new URL(url)
  const hostPath = `${urlObject.hostname}${urlObject.pathname}`

  if (hostPath.length > 0 && hostPath[hostPath.length - 1] === '/') {
    return hostPath.slice(0, -1)
  }
  
  return hostPath
}

module.exports = {
  normalizeUrl,
  getURLsFromHTML,
  crawlPage
}