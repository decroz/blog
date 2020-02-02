const express = require ('express');
const router = express.Router();
const checkAuth =require("../middleware/checkAuth")

const{
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/controllers')

//fetch all posts
router.get('/',checkAuth, getPosts);
//fetch single post by id
router.get('/:_id',checkAuth,getPost);
//create new post
router.post('/',createPost);
//update post
router.patch('/:_id',updatePost)
//delete post
router.delete('/:_id',deletePost)

const {login,
    signup
} =require('../controllers/user_controller')

router.post('/login',login);
router.post('/signup',signup);

module.exports = router;

