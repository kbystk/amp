const { writeFileSync, readFileSync } = require('fs')
const crypto = require('crypto')
const { html, htmlFragment } = require('lit-ntml')
const data = require('./data/pub.json')
const { ga, css } = require('./styles')

const render = async (batch, pageCount, isFinal) => {
  const links = batch.map(article => {
    let sha = crypto.createHash('sha1')
    sha.update(article.title)
    const hash = sha.digest('hex')
    return htmlFragment`
      <li><a href="https://amp.kbys.tk/${hash}.html">${article.title}</a></li>
    `
  })
  const res = await html`
    <!DOCTYPE html>
    <html amp>
      <head>
        <meta charset="utf-8" />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script
          async
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        ></script>
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        <style amp-boilerplate>
          body {
            -webkit-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            -moz-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            -ms-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            animation: -amp-start 8s steps(1, end) 0s 1 normal both;
          }
          @-webkit-keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          @-moz-keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          @-ms-keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          @-o-keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          @keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
        </style>
        <noscript>
          <style amp-boilerplate>
            body {
              -webkit-animation: none;
              -moz-animation: none;
              -ms-animation: none;
              animation: none;
            }
          </style>
        </noscript>
        <style amp-custom>
          ${css.toString()}
        </style>
        <title>アーカイブ | I am Electrical machine</title>
        <link
          rel="canonical"
          href="https://amp.kbys.tk/page-${pageCount}.html"
        />
      </head>
      <body>
        <amp-analytics type="gtag" data-credentials="include">
          <script type="application/json">
            {
              "vars": {
                "gtag_id": "${ga}",
                "config": {
                  "${ga}": { "groups": "default" }
                }
              },
              "triggers": {
                "trackPageView": {
                  "on": "visible",
                  "request": "pageview"
                }
              }
            }
          </script>
        </amp-analytics>
        <div class="${css.classes.container}">
          <div class="${css.classes.logo}">
            <a href="https://amp.kbys.tk">
              <amp-img
                src="https://i.gyazo.com/67ba2e0bfe934bd265f24e4c3cbd85a4.jpg"
                width="40px"
                height="40px"
              ></amp-img>
            </a>
          </div>
          ${!isFinal
            ? htmlFragment`<a href="https://amp.kbys.tk/page-${pageCount +
                1}.html">next</a>`
            : ''}
          <ul>
            ${links}
          </ul>
          ${pageCount !== 1
            ? htmlFragment`
              <a href="https://amp.kbys.tk/page-${pageCount - 1}.html">prev</a>
          `
            : ''}
        </div>
      </body>
    </html>
  `
  return res
}

const main = async () => {
  let pageCount = 1
  let count = data.pages.length
  let batch = data.pages.slice(count - 20, count)
  while (true) {
    const linkPage = await render(batch, pageCount, count <= 20)
    writeFileSync(`./public/page-${pageCount}.html`, linkPage)
    if (batch.length < 20) {
      break
    }
    pageCount += 1
    count -= 20
    if (count < 20) {
      batch = data.pages.slice(0, count)
    } else {
      batch = data.pages.slice(count - 20, count)
    }
  }
  writeFileSync(
    './public/index.html',
    readFileSync(`./public/page-${pageCount}.html`)
  )
}

main()
