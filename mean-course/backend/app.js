const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://kareemyasserr:tGhN7C19mxgiJ3f9@cluster0.ia3rj3r.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("connected to Database...")
  })
  .catch((err) => {
    console.log("connection Failed", err.message);
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  next()
})

app.post('/api/posts', (req, res, next) => {

  let post = new Post({
    title: req.body.title,
    content: req.body.content
  })

  post.save();
  res.status(201).json({
    message: 'Post added Successfully!!'
  })
})

app.get('/api/posts', async (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully!!',
        posts: documents
      })
    })
    .catch(() => console.log('error'))

  // try{
  //   const posts = await Post.find()
  //   res.status(200).send(posts).message('Posts feteched by Mosh Hamedani method!!')
  // }catch(error){
  //   console.log(error);
  //   next();
  // }

})

app.delete('/api/posts/:id',async(req,res,next )=>{
  // const post = await Post.findByIdAndRemove(req.params.id)

  // if(!post) return res.status(404).send('post with given Id was not found')

  // res.status(200).send(post).message('Post deleted by Mosh Hamedani method!!')

  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result)
    res.status(200).json({message: 'Post Deleted.'})
  })

})

module.exports = app;

