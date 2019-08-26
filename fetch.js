const { writeFileSync } = require('fs')
const fetch = require('isomorphic-unfetch')
const pages = require('./data/pub.json')

const main = async () => {
  let res = []
  for (const p of pages) {
    try {
      const r1 = await fetch(
        `https://scrapbox.io/api/pages/jigsaw/${encodeURIComponent(
          p.title
        )}/text`
      )
      const txt = await r1.text()
      const r2 = await fetch(
        `https://scrapbox.io/api/pages/jigsaw/${encodeURIComponent(p.title)}`
      )
      const json = await r2.json()
      res.push({
        created: p.created,
        id: p.id,
        image: json.iamge,
        title: p.title,
        txt,
        updated: p.updated,
        relatedPages: json.relatedPages.links1hop.map(q => ({
          id: q.id,
          title: q.title,
          image: q.image
        }))
      })
      console.log(`done: ${p.title}`)
    } catch (err) {
      console.log(err, p)
    }
  }
  writeFileSync('./data/html.json', JSON.stringify(res))
}

main()
