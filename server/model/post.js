const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const objectId= Schema.ObjectId;

const postSchema = new Schema({
    title:String,
    body:String,
    createdat:Date,
    createdBy: mongoose.Schema.Types.ObjectId
});

module.exports =mongoose.model('post',postSchema);