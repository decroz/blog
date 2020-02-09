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

router.post('/fileupload',(req,res,next)=>{
    if (!req.files || Object.keys(req.files).length ===0){
        return res.status(400).json({
            message:"No files were uploaded."
        });
    }

    let files = req.files;

    // is exceed file limit
    if(files.myFile.truncated === true){
        return res.status(400).json({
            message:"File size too large"
        }) 
    }

    //filetype
    if(files.myFile.mimetype !== 'image/jpeg' && files.myFile.mimetype !=='image/png'){
        return res.status(400).json({
            message:"files not of given type"
        })
    }

    files.myFile.name= `${Date.now()}-${files.myFile.name}`;

    console.log(appRoot);

    let filePath = `${appRoot}/public/${files.myFile.name}`;

    files.myFile.mv(filePath,(err)=>{
        if(err){
            return res.status(400).send(err)
        }else{
            res.send("file uploaded")
        }
    })
    console.log(req.files);
})

module.exports = router;

//helmet
//cors
//hereko