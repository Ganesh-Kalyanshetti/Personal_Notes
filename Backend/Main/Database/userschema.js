const mongoose = require('mongoose');

const Userschema = new mongoose.Schema(
    {
        Full_Name:{type:String,required:true,},

        Username:{type:String,required:true,unique:true,},

        Password:{type:String,required:true,}
    }
)
const data = mongoose.model("Userreg",Userschema,"Userreg");
module.exports = data;

