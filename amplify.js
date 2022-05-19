const { writeFileSync } = require('fs')
const ntml = require('lit-ntml')
const { parse } = require('@progfay/scrapbox-parser')
const videoParser = require('js-video-url-parser')
const master = require('./data/pub.json')
const data = require('./data/html.json')
const dic = require('./data/dic.json')
const { ga, css } = require('./styles')

const html = ntml.htmlFragment

const escapeAngle = str =>
  str.replace(/</g, '&lt;').replace(/(.)>/g, (_, p1) => `${p1}&gt;`)

const nodeRender = async node => {
  switch (node.type) {
    case 'plain':
      return escapeAngle(node.text)
    case 'hashTag': {
      if (dic[node.href] !== undefined) {
        return html`
          <a href="${`https://amp.kbys.tk/${dic[node.href]}`}"
            >#${escapeAngle(node.href)}</a
          >
        `
      } else {
        return html`
          <span class="${css.classes.unlinked}"
            >#${escapeAngle(node.href)}</span
          >
        `
      }
    }
    case 'link': {
      switch (node.pathType) {
        case 'relative': {
          if (dic[node.href] !== undefined) {
            return html`
              <a href="https://amp.kbys.tk/${dic[node.href]}"
                >${escapeAngle(node.href)}</a
              >
            `
          } else {
            return escapeAngle(node.href)
          }
        }
        case 'root':
          return html`
            <a
              href="https://scrapbox.io${node.href}"
              target="_blank"
              rel="noopener"
            >
              ${escapeAngle(node.href)}
            </a>
          `
        case 'absolute': {
          if (
            /^https:\/\/www\.youtube\.com/.test(node.href) ||
            /^https:\/\/youtu.be/.test(node.href)
          ) {
            const video = videoParser.parse(node.href)
            return html`
              <amp-youtube
                data-videoid="${video.id}"
                layout="responsive"
                width="480"
                height="270"
              ></amp-youtube>
            `
          }
          return html`
            <a href="${node.href}" target="_blank" rel="noopener">
              ${node.content
                ? escapeAngle(node.content)
                : escapeAngle(node.href)}
            </a>
          `
        }
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
    case 'code':
      return html`
        <code>${escapeAngle(node.text)}</code>
      `
    case 'icon': {
      switch (node.pathType) {
        case 'root': {
          if (node.path === '/icons/hr') {
            return html`
              <hr />
            `
          } else {
            console.log(node)
            return
          }
        }
        default: {
          console.log(node)
          return
        }
      }
    }
    case 'quote': {
      return html`
        <blockquote>${node.nodes.map(nodeRender)}</blockquote>
      `
    }
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
        <div style="padding-left:${block.indent}rem; margin-bottom: .5rem;">
          ${block.nodes.length > 0
            ? block.nodes.map(nodeRender)
            : html`
                <br />
              `}
        </div>
      `
    }
    case 'codeBlock': {
      return html`
        <div style="padding-left:${block.indent}rem; overflow: scroll;">
          <code>${escapeAngle(block.fileName)}</code>
          <pre><code>${escapeAngle(block.content)}</code></pre>
        </div>
      `
    }
    default:
      console.log(block)
      return ''
  }
}

const render = async article => {
  const obj = parse(article.txt)
  let relatedPagesWithRandomPages = article.relatedPages
  if (article.relatedPages.length < 5) {
    for (let i = article.relatedPages.length; i < 5; i++) {
      relatedPagesWithRandomPages.push(
        master[Math.round((master.length - 1) * Math.random())]
      )
    }
  }
  const res = await ntml.html`
    <!DOCTYPE html>
    <html amp>
      <head
        prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/websaite#"
      >
        <meta charset="utf-8" />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script
          async
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        ></script>
        <script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"></script>
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content="https://amp.kbys.tk/${article.id}.html"
        />
        <meta property="og:title" content="${
          article.title
        } | I am Electrical machine" />
        <meta property="og:site_name" content="I am Electrical machine" />
        ${
          article.image
            ? html`
                <meta name="twitter:card" content="summary_large_image" />
              `
            : html`
                <meta name="twitter:card" content="summary" />
              `
        }
        ${
          article.image
            ? html`
                <meta property="og:image" content="${article.image}" />
              `
            : ''
        }
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
          <div class="${css.classes.sbLink}">
            <a href="https://scrapbox.io/jigsaw/${article.title}">
              スクボで読む
            </a>
          </div>
          <h1>${article.title}</h1>
          <div>
            ${obj.map(blockRender)}
          </div>
          <h2>関連ページとランダムに選ばれたページ</h2>
          <ul>
            ${article.relatedPages.map(
              relatedPage =>
                html`
                  <li>
                    <a href="https://amp.kbys.tk/${relatedPage.id}.html">
                      ${relatedPage.title}
                    </a>
                  </li>
                `
            )}
          </ul>
          <h2>筆者について</h2>
          <div>jigsaw(ジグソウ、1991年6月12日-)は日本のプログラマ、会社代表。本名は小林貴也(こばやし たかや)。主にウェブ、フロントエンド領域で活動している。カミング・スーン合同会社の代表社員。</div>
          <div class="${
            css.classes.moreProfile
          }"><a href="https://amp.kbys.tk/5c29451d434bf90017d3b219.html">さらに詳しく</a></div>
          <h2>寄附について</h2>
          <div>面白かったら<a href="https://amp.kbys.tk/5dcc34d2e8364600170f07f6.html">BTC</a>や<a href="https://amp.kbys.tk/5dcc35503afcd0001731ff2c.html">ETH</a>での寄附をお待ちしております。</div>
          <div class="${
            css.classes.donation
          }"><a href="https://amp.kbys.tk/5dbbc52057d9010017438a87">寄附のきろく</a></div>
        </div>
      </body>
    </html>
  `
  writeFileSync(`./public/${article.id}.html`, res)
}

data.map(render)
