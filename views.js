const { writeFileSync } = require('fs')
const master = require('./data/pub.json')

const count = master.reduce((prev, curr) => (prev += curr.views), 0)
console.log(`Total views: ${count}`)
writeFileSync('./public/COUNT', count)
