const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const objectId= Schema.ObjectId;

const userSchema = new Schema({
  name:{
      firstName : String,
      lastName: String
  },
  email :{type:String, require:true, unique:true},
  password :{type:String, require:true},
  createdat :{type:Date,Default:Date.now()},
});

module.exports =mongoose.model('user',userSchema);