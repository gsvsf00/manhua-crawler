const { normalizeUrl, getURLsFromHTML } = require('./crawl')
const { test, expect } = require('@jest/globals')

//https://asuratoon.com/
//http://asuratoon.com/

test('normalizeUrl', () => {
    const input = 'https://asuratoon.com/path/'
    const actual = normalizeUrl(input)
    const expected = 'asuratoon.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeUrl strip trailing slash', () => {
    const input = 'https://asuratoon.com/path/'
    const actual = normalizeUrl(input)
    const expected = 'asuratoon.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeUrl capitals', () => {
    const input = 'https://ASURATOON.com/path/'
    const actual = normalizeUrl(input)
    const expected = 'asuratoon.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeUrl strip http', () => {
    const input = 'http://ASURATOON.com/path/'
    const actual = normalizeUrl(input)
    const expected = 'asuratoon.com/path'
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://asuratoon.com/path/">link</a>
        </body>
    </html>
    `
    const inputBaseURL = "https://asuratoon.com/path/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://asuratoon.com/path/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">link</a>
        </body>
    </html>
    `
    const inputBaseURL = "https://asuratoon.com"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://asuratoon.com/path/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML both', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://asuratoon.com/path1/">link1</a>
            <a href="/path2/">link2</a>
        </body>
    </html>
    `
    const inputBaseURL = "https://asuratoon.com"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://asuratoon.com/path1/", "https://asuratoon.com/path2/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML invalid', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="invalid">Invalid URL</a>
        </body>
    </html>
    `
    const inputBaseURL = "https://asuratoon.com"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})