const mongoose = require('mongoose');
const folderschema = new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,
            ref:'Userreg',
            required:true
        },
        foldername:{type:String,required:true},
        content:{
            type: String,
                default:''
            // data: {type:String,required:true},
            // createdAt:{type: Date,default: Date.now}
        },

    },{
        timestamps:true
    }
)




module.exports = mongoose.model('Folder',folderschema,"Folder");
