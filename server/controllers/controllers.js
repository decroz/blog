const post = require('../model/post');
const User = require('../model/user');
const Joi = require('@hapi/joi');

//fetsh all posts
const getPosts=async(req,res)=>{
    try{
        //let data = await post.find()
        //.populate({path:'createdBy', select:'name email',model:User})
        //.sort{createdat : -1};

        let data = await post.aggregate([
            {
                $lookup:{
                    from :"users",
                    localField:"createdBy",
                    foreignField:"_id",
                    as:"authur"
                }
            },
            {
                $project:{
                    "authur.password":0,
                    "authur._id":0
                }
            }
        ])
        if(data.length === 0){
            return res.status(404).json({
                message:'No data found'
            })
        }
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
    
    // res.send('Get multiple');
};
//fetch single post by id
const getPost = async(req,res)=>{
    let {_id}= req.params;
    //res.send('Get id '+ _id);
    try{
        let result = await post.findOne({_id});
        
        if (result === null){
            return res.status(400).json({
                message:"invalid Id"
            });
        }
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json({
            message:err.message    
        })
    }
};
//create new posts
const createPost = async (req,res)=>{
    console.log(req.userData);
    console.log(req.headers.Authorization);
    let data =req.body;

    //validation
    // let {tittle, body}= data;
    // if(title){
    //     return res.status(402).json({
    //         messsage:"title is required"
    //     })
    // }

    const schema = Joi.object({
        title : Joi.string().min(10).max(255).required(),
        body : Joi.string().min(3).max(20000),
        createdat : Joi.any(),
        createdBy:Joi.any()
    })

    data.createdat= Date.now();
    data.createdBy = req.userData._id;

    console.log(data);
    let newPost = new post(data);
    try{
        const validationError = schema.validate(req.body,{abortEarly:false});
        //using traditional for
        // let message = [];
        // for (let i=0;i<validationError.error.details.length;i++){
        //     message.push(validationError.error.details[i].message);
        // }

        // using map
        

        if(validationError && validationError.error){
            let message= validationError.error.details.map(data =>{
                return data.message;
           })
    
            return res.status(422).json({
                message
            });
        }

        let result = await newPost.save(data);

        res.status(201).json({
            status: 'OK',
            message:'Success',
            newPost:result
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
    
    // console.log(req.body);
    // post.insertOne(data)
    // .then(result=>{
    //     console.log(result);
    //     res.status(200).json({
    //         status: 'OK',
    //         message:'Success',
    //         post:'result'
    //     });
    // })
    // .catch(err=>{
    //     console.log(err);
    //     res.status(500).json({
    //         message:error.message
    //     })

    // })
    //gets new data
    // res.send('POST');
};
//update new post
const updatePost = async (req,res)=>{
    
    let {_id} = req.params;
    //let postid =_id;

    try{
        let result = await post.updateOne(
            {_id, 
                createdBy: req.userData._id
            },
            {$set:req.body}
        );
            console.log(result);
        if(result.nModified === 0){
            return res.status(400).json({
                message:"Failed to update data"
            })
        }
      
        res.status(200).json({
            status:"Ok"
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
    //res.send('patch');
} ;
//delete post
const deletePost = async (req,res)=>{
    //
    let {_id} = req.params;
    try{
        let result = await post.deleteOne(
            {_id, createdBy: req.userData._id}
            );
        let {deletedCount} =result;
        if(deletedCount===0){
            return res.status(400).json({
                message:"Failed to delete data"
            })
        }
        console.log(result);
        res.status(200).json({
            status:"invalid"
        })
        
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }

    //res.send('delete');
};

module.exports= {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
}

