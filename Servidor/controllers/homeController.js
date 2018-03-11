const configuration = require('../models/configurationModel')
const post = require('../models/postModel')
const switcher = require('../switcher')
const mongoose = require('mongoose')

function upDateProps(req, res) {
  var props = req.body
  configuration.findById("config",(err, configurations)=>{
    if (err) {
      res.status(500)
      res.send(`Cannot find id ${err}`)
    }
    configurations.update(props).exec((err)=>{
      if(err){
        res.status(500)
        res.send(`Cannot update ${err}`)
      }
      res.status(200);
      res.json({});
    })
  })
    
}

function getProps(req, res) {
  configuration.find()
    .exec((err, configurations) => {
      if (err) {
        res.status(500)
        res.send(`An error has ocurred ${err}`)
      }
      res.status(200)
      res.json(configurations)
    })
}

function createPost(req, res) {
  let newPost = new post(req.body)
  newPost.save((err, newPost) => {
    if(err){
      console.log(err)
      res.status(500)
      res.send(`Cannot insert post ${err}`)
    }
    res.status(200);
    res.json(newPost)
  })
}

function upDatePost(req, res) {
  updatedPost = req.body
  post.findOneAndUpdate({ "_id": updatedPost._id }, { "$set": { "title": updatedPost.title, "content": updatedPost.content, "updated": Date.now()}},{new:true}).exec(function(err,updatedpost){
    if(err) {
        console.log(err);
        res.status(500).send(err);
    } else {
      res.status(200).json(updatedpost);
    }
  });
    
}

function getPosts(req, res) {
  post.find().sort('-created')
    .exec((err, posts) => {
      if (err) {
        res.status(500)
        res.send(`An error has ocurred ${err}`)
      }
      res.status(200)
      res.json(posts)
    })
}

function deletePost(req, res){
  let id = mongoose.Types.ObjectId(req.body.id)
  post.deleteOne({ "_id" : id }, (err, posts) =>{
    if(err){
      res.status(500)
      res.send(`Cannot delete post ${err}`)
    }
    res.status(200);
    res.json(posts)
  })
}

module.exports = {
  upDateProps,getProps,createPost,upDatePost,getPosts,deletePost
}



