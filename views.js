const { writeFileSync, readFileSync } = require('fs')
const fetch = require('isomorphic-unfetch')
const format = require('date-fns/format')
const subDays = require('date-fns/subDays')
const master = require('./data/pub.json')

const PATH = './public/COUNT'

const main = async () => {
  const prevCount = parseInt(readFileSync(PATH).toString())
  const count = master.reduce((prev, curr) => (prev += curr.views), 0)
  const diff = count - prevCount
  const res = await fetch('https://pixe.la/v1/users/jgs/graphs/sbv', {
    headers: {
      'X-USER-TOKEN': process.env.PIXE_LA_TOKEN
    },
    method: 'POST',
    body: JSON.stringify({
      date: format(subDays(new Date(), 1), 'yyyyMMdd'),
      quantity: diff.toString()
    })
  })
  const json = await res.json()
  console.log(json)
  console.log(`Today views: ${diff}`)
  console.log(`Total views: ${count}`)
  writeFileSync(PATH, count)
}

main()
