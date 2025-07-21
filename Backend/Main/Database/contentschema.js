const mongoose = require('mongoose');

const contentschema = new mongoose.Schema({

    foldername : { type:String, required:true},
    content : {type:String,default:''},
    images : [{type:String}],
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},

},{timestamps:true});

module.exports =mongoose.model('Content',contentschema,'Content');
