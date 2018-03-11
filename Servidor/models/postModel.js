const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  created: { type : Date, default: Date.now },
  updated: { type : Date, default: Date.now },
  autor: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
})

const post = mongoose.model("post", postSchema)
module.exports = post
