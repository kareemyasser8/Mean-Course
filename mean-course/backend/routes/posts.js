const Post = require('../models/post');
const express = require('express')
const router = express.Router();
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',

}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null
    }
    cb(error, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('',checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added Successfully!!',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    })
  }).catch(error=>{
    res.status(500).json({message: 'creating a post failed!'})
  })
})

router.put('/:id',checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId}, post).then(
    result => {
      if(result.nModified > 0){
        res.status(200).json({ message: "update successful" })
      }else{
        res.status(401).json({ message: "not authorized" })
      }

    }
  ).catch(err => res.status(500).json({message: `Couldn't update post!`}))
})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(
    post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: 'Post not found' })
      }
    }
  ).catch((error)=>{
    res.status(500).json({message: 'Fetching post failed!'})
  })
})


router.get('', async (req, res, next) => {
  const pageSize = Number(req.query.pageSize) ;
  const currentPage = Number(req.query.page);
  const postQuery = Post.find();
  let fetchedPosts

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents
      return Post.count()
    }).then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!!',
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch((err) => res.status(500).json({message: 'Fetching posts failed!'}))

  // try{
  //   const posts = await Post.find()
  //   res.status(200).send(posts).message('Posts feteched by Mosh Hamedani method!!')
  // }catch(error){
  //   console.log(error);
  //   next();
  // }

})

router.delete('/:id',checkAuth, async (req, res, next) => {
  // const post = await Post.findByIdAndRemove(req.params.id)

  // if(!post) return res.status(404).send('post with given Id was not found')

  // res.status(200).send(post).message('Post deleted by Mosh Hamedani method!!')

  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if(result.deletedCount > 0){
      res.status(200).json({ message: "deletion successful" })
    }else{
      res.status(401).json({ message: "not authorized" })
    }
  }).catch(
    error =>{
      res.status(500).json({message: 'Deleting post failed'})
    }
  )

})

module.exports = router;
