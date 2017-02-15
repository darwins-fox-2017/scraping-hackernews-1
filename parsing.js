"use strict"

let fs = require('fs')
let cheerio = require('cheerio')
let request = require('request')
let doc

function extract_usernames(doc) {
  doc('span.comhead > a:first-child').filter(function (i, element) {
    let data = doc(this)
    console.log(data[0]['children'][0].data)
  })
}


class Post {
  constructor(url) {
    this.url = url
    // url
    this.item_id
    // get length to show number of comment
    this.comments = []
  }

  fetch(callback) {
    request(this.url, (error, response, html) => {
      let $ = null
      if(!error && response.statusCode === 200) {
        $ = cheerio.load(html)

        // Title
        $('span.sitebit').filter(function (i, elem) {
          let title = $(this).prev()
          this.title = title.text()
          let item_id = $(this).parent().prev().children().children().attr("id")
          let titleLink = title.attr("href")
          console.log("Item ID :", item_id.slice(3))
          console.log("Post Title :", this.title)
          console.log("Post Link To :", titleLink)
        })

        // Post details
        $('span.score').filter(function (i, elem) {
          let score = $(this).text()
          let poster = $(this).next().text()
          console.log("Total Points :", score)
          console.log("Thread Poster :", poster)
        })

        // Comment Data
        let a = 0
        let commArr = []
        $('span.comhead').each(function (i, element) {
          let user = $(this).children().first().text()
          let date = $(this).children().next().text()
          let commentar = new Comment(user, date)
          commArr.push(commentar)
          a++
        })
        console.log("Number of comment :", a-1, "Comments")
        this.comments = commArr.slice(1)
      } else {
        console.log(error)
      }
      callback($)
    })
  }

  comments($) {
    $('span.comhead').each(function (i, element) {
      let data = $(this).children().text()
      console.log(data)
    })
  }
}

class Comment {
  constructor(user, date) {
    this.user = user
    this.date = date
    this.comment
  }
}

if(process.argv[2] !== undefined) {
  let posts = new Post(process.argv[2])
  posts.fetch(function($) {

  })
}
else {
  console.log("please run with command 'node parsing.js https://news.ycombinator.com/item?id=13650818'")
}
