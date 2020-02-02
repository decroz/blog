//const bcrypt = require('bcrypt');
//const SALT_ROUNDS= 10;
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const SECRET_KEY ="anything can be secert key faskdfjiue";

const login = async (req,res,next)=>{
    //take data from body
    let {email, password} = req.body;
    //validation

    //santitize
    email = email.toLowerCase();

    //matching email to db
    let currentUser = await User.findOne({email});

    //if not found throw err
    //user not exists
    if (currentUser === null){
        return res.status(401).json({
            message: 'Auth Failed'
        })
    }

    //if found check password

    // let comparePassword = bcrypt.compareSync(password, currentUser.password);
    // console.log(comparePassword);
    // if (!comparePassword){
    //         return res.status(401).json({
    //             message:'Invalid Passsword'
    //         })
    // }

    //password match give token and res
    let {_id,name}= currentUser;
    let token = jwt.sign({
        _id,
        email,
        name
    },SECRET_KEY,{expiresIn:'48h'})

    res.status(200).json({
        token
    })
}


const signup = async(req,res,next)=>{
    let {name, email, password, confirmPassword}= req.body;

    //validation 
        //ghar ma garne 

    //santization
    email=email.toLowerCase();

    let oldUser= await User.find({email});
    //email already exist
    if (oldUser.length > 0){
        return res.status(401).json({               //401 auth failed
            message:'auth failed'                   ///422 unprocessable entry
        })
    }
    //PASSWORD HASHING
   // let hash = bcrypt.hashSync(password, SALT_ROUNDS);
   let newUser = new User({
    name,
    email,
    password        // for bcrypt password:hash
   });
   try{
   let result = await newUser.save();
   res.status(201).json({
       status: 'ok',
       newUser:result
   });
   }
   catch(err){
    res.status(500).json({
        message: err.message
    })
   }
}

module.exports={
    login,
    signup
}