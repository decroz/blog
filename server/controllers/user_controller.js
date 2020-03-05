const bcrypt = require('bcrypt');
const SALT_ROUNDS= 10;
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const User = require('../model/user');
const SECRET_KEY ="anything can be secert key faskdfjiue";

const login = async (req,res,next)=>{
    //take data from body
    let {email, password} = req.body;
    //validation
    const schemaLogin = Joi.object({
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    })//eof schema
    
     try{
        const loginValidatorError = await schemaLogin.validate(req.body,{abortEarly:false} );
        if (loginValidatorError && loginValidatorError.error){
            console.log(loginValidatorError);
            let loginerrormsg = loginValidationError.error.details.map(data=>{
                return data.message
            })
            return res.status(422).json({
                loginerrormsg
            })
        }//eof valldation
    
    //santitize
    email = email.toLowerCase();

    //matching email to db
    console.log(req.body)
    let currentUser = await User.findOne({email});
    console.log(currentUser);

    //if not found throw err
    //user not exists
    if (currentUser === null){
        return res.status(401).json({
            message: 'Auth Failed'
        })
    }

    //if found check password
    let comparePassword = bcrypt.compareSync(password, currentUser.password);
      console.log(comparePassword);
      if (!comparePassword){
              return res.status(401).json({
                  message:'Invalid Passsword'
              })
      }

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
catch(err){
    res.status(500).json({
        message: err.message
    })
}//eof catch
}//eof login function


const signup = async(req,res,next)=>{
    let {name, email, password, confirmPassword}= req.body;

    //validation 
        //ghar ma garne 
        const schemaSignup = Joi.object({
            name: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            confirmPassword: Joi.ref('password'),
        })
        try{
            const signupValidatorError = await schemaSignup.validate(req.body,{abortEarly:false} );
            if (signupValidatorError && signupValidatorError.error){
                let signuperrormsg = signupValidatorError.error.details.map(data=>{
                    return data.message
                })
                return res.status(422).json({
                    signuperrormsg
                })
            }//eof validaiton
        
       
    //santization
    email=email.toLowerCase();

    let oldUser= await User.find({email});
    //email already exist
    if (oldUser.length > 0){
        return res.status(401).json({               //401 auth failed
            message:'auth failed'                   ///422 unprocessable entry
        })
    }//eof check old user

    //PASSWORD HASHING
   let hash = bcrypt.hashSync(password, SALT_ROUNDS);
   let newUser = new User({
    name,
    email,
    password:hash    // for bcrypt password:hash
   });//
   let result = await newUser.save();
   res.status(201).json({
       status: 'ok',
       newUser:result
   });//success reponse


}//end of try

   catch(err){
    res.status(500).json({
        message: err.message
    })
   }//eof catch
}//eof function

module.exports={
    login,
    signup
}

