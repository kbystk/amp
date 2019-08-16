const { writeFileSync } = require('fs')
const crypto = require('crypto')
const { createSitemap } = require('sitemap')
const data = require('./data/pub.json')

const sitemap = createSitemap({
  hostname: 'https://amp.kbys.tk',
  cacheTime: 600000,
  urls: data.pages.map(page => {
    let sha = crypto.createHash('sha1')
    sha.update(page.title)
    const hash = sha.digest('hex')
    return {
      url: `/${hash}.html`
    }
  })
})
const xml = sitemap.toXML()
writeFileSync('./public/sitemap.xml', xml)
