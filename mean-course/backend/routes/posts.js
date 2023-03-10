const Post = require('../models/post');
const express = require('express')
const router = express.Router();
const multer = require('multer')

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

router.post('', multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
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
  })
})

router.put('/:id', multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  })
  Post.updateOne({ _id: req.params.id }, post).then(
    result => {
      console.log(result);
      res.status(200).json({ message: "update successful" })
    }
  ).catch(err => console.log(err.message))
})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(
    post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: 'not found' })
      }
    }
  )
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
    .catch((err) => console.log(err))

  // try{
  //   const posts = await Post.find()
  //   res.status(200).send(posts).message('Posts feteched by Mosh Hamedani method!!')
  // }catch(error){
  //   console.log(error);
  //   next();
  // }

})

router.delete('/:id', async (req, res, next) => {
  // const post = await Post.findByIdAndRemove(req.params.id)

  // if(!post) return res.status(404).send('post with given Id was not found')

  // res.status(200).send(post).message('Post deleted by Mosh Hamedani method!!')

  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result)
    res.status(200).json({ message: 'Post Deleted.' })
  })

})

module.exports = router;
