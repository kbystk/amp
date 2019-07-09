const { writeFileSync } = require('fs')
const puppeteer = require('puppeteer')
const data = require('./data/pub.json')

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  let res = []
  for (const p of data.pages.slice(0, 200)) {
    try {
      await page.goto(
        `https://scrapbox.io/jigsaw/${encodeURIComponent(p.title)}`
      )
      await page.waitForSelector('.section-title', {
        timeout: 1000000
      })
      const html = await page.evaluate(
        () => document.getElementsByClassName('lines')[0].innerHTML
      )
      res.push({
        title: p.title,
        html,
        updated: p.updated
      })
      console.log(`done: ${p.title}`)
    } catch (err) {
      console.log(err, p)
    }
  }
  writeFileSync('./data/html.json', JSON.stringify(res))
  await browser.close()
}

main()
