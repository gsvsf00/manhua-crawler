const { JSDOM } = require('jsdom')

async function crawlPage(currentUrl){
  console.log (`Crawling ${currentUrl}`)

  try{
    const resp = await fetch(currentUrl)

    if (resp.status > 399) {
      console.log(`Error crawling ${currentUrl}: ${resp.status}`)
      return
    }

    const contentType = resp.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
      console.log(`Error crawling ${currentUrl}: ${contentType}`)
      return
    }

    console.log (await resp.text())
  } catch(err) {
    console.log(`Error crawling ${currentUrl}: ${err.message}`)
  }
}

function getURLsFromHTML(htmlBody , baseURL) {
  const urls = []
  const dom = new JSDOM(htmlBody)
  const linkElelemts = dom.window.document.querySelectorAll('a')

  for (const linkElelemt of linkElelemts) {
    if(linkElelemt.href.slice(0,1) === '/') {
      try {
        const urlObject = new URL(`${baseURL}${linkElelemt.href}`)
        urls.push(urlObject.href)
      } catch(err){
          console.log(`error with relative url: ${linkElelemt.href}`)
      }
    } else {
        try {
          const urlObject = new URL(linkElelemt.href)
          urls.push(urlObject.href)
        } catch(err){
            console.log(`error with absolute url: ${err.message}`)
        }
      }
  }
  return urls
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