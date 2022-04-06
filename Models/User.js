const mongoose=require("mongoose");
const moment = require('moment-timezone');
const boolean = require("@hapi/joi/lib/types/boolean");

const UsersSchema=mongoose.Schema({
    Id:{
        type:String,
        required:true
    },
    Name:{
        type:String,
        required:true,
        max2:255
    },
    Email:{
        type:String,
        required:true,
        max:255
    },
    Age:{
        type:Number,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        required:true
    },
    Created:{
        type:Date,
        default:moment.utc()
    },
    Verified:{
        type:boolean,
        default:false
    },
    VerificationToken:{
        type:String,
        default:null
    },
    Updated:Date
});

module.exports=mongoose.model('tblUsers',UsersSchema);