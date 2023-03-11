const Post = require('../models/post');
const express= require('express')
const router = express.Router();

router.post('', (req, res, next) => {

  let post = new Post({
    title: req.body.title,
    content: req.body.content
  })

  post.save();
  res.status(201).json({
    message: 'Post added Successfully!!'
  })
})

router.put('/:id', (req,res,next)=>{
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id},post).then(
    result =>{
        console.log(result);
        res.status(200).json({message: "update successful"})
    }
  ).catch(err => console.log(err.message))
})

router.get('/:id', (req,res,next)=>{
  Post.findById(req.params.id).then(
    post => {
      if(post){
        res.status(200).json(post)
      }else{
        res.status(404).json({message: 'not found'})
      }
    }
  )
})


router.get('', async (req, res, next) => {
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

router.delete('/:id',async(req,res,next )=>{
  // const post = await Post.findByIdAndRemove(req.params.id)

  // if(!post) return res.status(404).send('post with given Id was not found')

  // res.status(200).send(post).message('Post deleted by Mosh Hamedani method!!')

  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result)
    res.status(200).json({message: 'Post Deleted.'})
  })

})

module.exports = router;