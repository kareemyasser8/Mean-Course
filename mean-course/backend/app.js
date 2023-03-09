const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const Post = require('./models/post');

const app  = express();

mongoose.connect("mongodb+srv://kareemyasserr:tGhN7C19mxgiJ3f9@cluster0.ia3rj3r.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
  console.log("connected to Database...")
})
.catch((err)=>{
  console.log("connection Failed", err.message);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin',"*");
  res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS');
  next()
})

app.post('/api/posts',(req,res,next)=>{

  let post = new Post({
    title: req.body.title,
    content: req.body.content
  })

  console.log(post);
  res.status(201).json({
    message: 'Post added Successfully!!'
  })
})

app.get('/api/posts',(req,res,next)=>{
  const posts=[
    {
      id: 'sdaoiufffa',
      title: 'first server side post',
      content: 'This is coming from the server'
    },
    {
      id: 'dsfsdsgsg',
      title: 'second server side post',
      content: 'This is coming from the server'
    }
  ]
  res.status(200).json({
    message: 'Posts fetched successfully!!',
    posts: posts
  });
})

module.exports = app;
