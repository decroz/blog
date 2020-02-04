const jwt = require('jsonwebtoken');
const SECRET_KEY ="anything can be secert key faskdfjiue";

const checkAuth = (req, res, next)=>{

    let token= req.headers.authorization.split('')[1];
    try{
        var decoded = jwt.verify(token,SECRET_KEY);
        req.userData = decoded;
        next();
    }
    catch(err){
        res.status(401).json({
            message:"auth failed"
        })
    }
}
module.exports = checkAuth;