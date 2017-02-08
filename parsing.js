"use strict"

var fs = require('fs')
var cheerio = require('cheerio')
var doc

fs.readFile('post.html', function (err, data) {
  if (err) {
    console.error(err)
  }
  doc = cheerio.load(data)


  extract_usernames(doc)

})

function extract_usernames(doc) {
  doc('span.comhead > a:first-child').filter(function (i, element) {
    var data = doc(this)
    console.log(data[0]['children'][0].data)
  })
}

