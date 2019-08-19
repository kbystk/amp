const { writeFileSync } = require('fs')
const { html } = require('lit-ntml')
const parse = require('@progfay/scrapbox-parser')
const data = require('./data/html.json')
const { ga, css } = require('./styles')

const nodeRender = async node => {
  switch (node.type) {
    case 'plain':
      return node.text
    case 'hashTag':
      return html`
        <a href="https://scrapbox.io/jigsaw/${node.href}">#${node.href}</a>
      `
    case 'link': {
      switch (node.pathType) {
        case 'relative':
          return html`
            <a
              href="https://scrapbox.io/jigsaw/${node.href}"
              target="_blank"
              rel="noopener"
            >
              ${node.href}
            </a>
          `
        case 'root':
          return html`
            <a
              href="https://scrapbox.io${node.href}"
              target="_blank"
              rel="noopener"
            >
              ${node.href}
            </a>
          `
        case 'absolute':
          return html`
            <a href="${node.href}" target="_blank" rel="noopener">
              ${node.content ? node.content : node.href}
            </a>
          `
        default: {
          console.log(node)
          return ''
        }
      }
    }
    case 'image':
      return html`
        <div class="${css.classes.imgContainer}">
          <amp-img class="contain" layout="fill" src="${node.src}" />
        </div>
      `
    case 'decoration':
      return html`
        <span
          class="${css.classes.level} ${css.classes[
            node.decos[0].replace(/\*/, 'level')
          ]}"
        >
          ${node.nodes.map(nodeRender)}
        </span>
      `
    default: {
      console.log(node)
      return ''
    }
  }
}

const blockRender = block => {
  switch (block.type) {
    case 'line': {
      return html`
        <div style="padding-left:${block.indent}rem;">
          ${block.nodes.length > 0
            ? block.nodes.map(nodeRender)
            : html`
                <br />
              `}
        </div>
      `
    }
    default:
      return ''
  }
}

const render = async article => {
  const obj = parse(article.txt.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
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
        <title>${article.title} | I am Electrical machine</title>
        <link
          rel="canonical"
          href="https://scrapbox.io/jigsaw/${article.title}"
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
            <amp-img
              src="https://i.gyazo.com/67ba2e0bfe934bd265f24e4c3cbd85a4.jpg"
              width="40px"
              height="40px"
            ></amp-img>
          </div>
          <div class="${css.classes.sbLink}">
            <a href="https://scrapbox.io/jigsaw/${article.title}">
              スクボで読む
            </a>
          </div>
          <h1>${article.title}</h1>
          <div>
            ${obj.blocks.map(blockRender)}
          </div>
        </div>
      </body>
    </html>
  `
  writeFileSync(`./public/${article.id}.html`, res)
}

data.map(render)
