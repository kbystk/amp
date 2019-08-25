const { writeFileSync } = require('fs')
const { createSitemap } = require('sitemap')
const master = require('./data/pub.json')

const sitemap = createSitemap({
  hostname: 'https://amp.kbys.tk',
  cacheTime: 600000,
  urls: master.map(page => ({
    url: `/${page.id}.html`
  }))
})
const xml = sitemap.toXML()
writeFileSync('./public/sitemap.xml', xml)
