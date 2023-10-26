const { JSDOM } = require('jsdom')

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
  getURLsFromHTML
}