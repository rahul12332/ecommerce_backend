const mongoose = require('mongoose');
const {productSchema} = require("./productmodel")
const addressSchema = require('./userAddress');

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

    address:[addressSchema],

    type:{
        type : String,
        default:'user'
    },

    cart:[

        {
            product:productSchema,
            quantity:{
                type:Number,
                required: true,
            }
        }
    ]


    
    
});

const User = mongoose.model("User", userSchema);
module.exports = User;