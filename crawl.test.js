const { normalizeUrl } = require('./crawl')
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