const { writeFileSync } = require('fs')
const crypto = require('crypto')
const { createSitemap } = require('sitemap')
const data = require('./data/html.json')

const sitemap = createSitemap({
  hostname: 'https://amp.kbys.tk',
  cacheTime: 600000,
  urls: data.map(article => {
    let sha = crypto.createHash('sha1')
    sha.update(article.title)
    const hash = sha.digest('hex')
    return {
      url: `/${hash}.html`
    }
  })
})
const xml = sitemap.toXML()
writeFileSync('./public/sitemap.xml', xml)
