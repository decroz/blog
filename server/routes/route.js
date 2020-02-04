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
router.get('/:_id',getPost);
//create new post
router.post('/',checkAuth,createPost);
//update post
router.patch('/:_id',checkAuth,updatePost)
//delete post
router.delete('/:_id',checkAuth,deletePost)

const {login,
    signup
} =require('../controllers/user_controller')

router.post('/login',login);
router.post('/signup',signup);

module.exports = router;