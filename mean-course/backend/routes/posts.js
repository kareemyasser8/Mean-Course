const Post = require('../models/post');
const express = require('express')
const router = express.Router();

const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')
const PostController = require('../controllers/post')



router.post('',checkAuth, extractFile ,PostController.createPost)

router.put('/:id',checkAuth, extractFile, PostController.editPost )

router.get('/:id',PostController.getPost)

router.get('', PostController.fetchPosts)

router.delete('/:id',checkAuth, PostController.deletePost)

module.exports = router;
