const { writeFileSync } = require('fs')
const crypto = require('crypto')
const { html } = require('lit-ntml')
const jss = require('jss').default
const preset = require('jss-preset-default').default
const data = require('./data/html.json')

const ga = 'UA-96527600-2'
jss.setup(preset())

const styles = {
  '@global': {
    '.line-title': {
      fontSize: '1.5rem',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    '.line': {
      paddingBottom: '.4rem'
    },
    a: {
      textDecoration: 'none',
      color: '#0469ea'
    },
    '.line .quote': {
      fontStyle: 'italic',
      backgroundColor: 'rgba(128,128,128,0.1)',
      display: 'block',
      borderLeft: 'solid 4px #a0a0a0',
      paddingLeft: '4px'
    },
    '.line .code': {
      padding: 0,
      fontSize: '90%',
      backgroundColor: 'rgba(0,0,0,0.04)',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      borderRadius: '4px'
    },
    'amp-img.contain img': {
      objectFit: 'contain'
    }
  },
  container: {
    padding: '1rem'
  },
  '@media (min-width: 640px)': {
    container: {
      maxWidth: '640px',
      margin: '0 auto'
    }
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '.5rem'
  },
  imgContainer: {
    position: 'relative',
    width: '100%',
    height: '30vh'
  }
}
const css = jss.createStyleSheet(styles).attach()

const render = async article => {
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
          ${article.html
            .replace(/href="\.\/(.*?)"/gm, (_, p1) => {
              let sha = crypto.createHash('sha1')
              sha.update(p1)
              const hash = sha.digest('hex')
              return `href="https://amp.kbys.tk/${hash}.html"`
            })
            .replace(/<div class="telomere (.*?)<\/div>/gm, '')
            .replace(
              /<img\s(.*?)>/gm,
              (_, p1) =>
                `<div class="${css.classes.imgContainer}"><amp-img class="contain" layout="fill" ${p1}/></div>`
            )
            .replace(/type="link"/gm, '')
            .replace(/type="hashTag"/gm, '')
            .replace(/src="\/api/gm, 'src="https://scrapbox.io/api')}
        </div>
      </body>
    </html>
  `
  let sha = crypto.createHash('sha1')
  sha.update(article.title)
  const hash = sha.digest('hex')
  writeFileSync(`./public/${hash}.html`, res)
}

data.map(render)
