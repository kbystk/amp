const { writeFileSync } = require('fs')
const master = require('./data/pub.json')

let dic = {}
master.forEach(article => {
  dic[article.title] = article.id
})

writeFileSync('./data/dic.json', JSON.stringify(dic))
