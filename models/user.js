const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name:{
        required:true,
        type:String,
        trim:true,
    },

    email:{
        required:true,
        type:String,
        trim:true,
    },
    password:{
        required:true,
        type:String,
        validate:{
            validator:(value)=>{
                return value.length > 6;
            },

            message:"Please enter a valid email address",
        },
    },

    address:{
        type: String,
        default:'',
    },

    type:{
        type : String,
        default:'user'
    }
    
    
});

const User = mongoose.model("User", userSchema);
module.exports = User;