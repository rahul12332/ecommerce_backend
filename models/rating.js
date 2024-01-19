const mongoose = require("mongoose");

const ratingschema = mongoose.Schema({
   
    userId:{
        type:String,
        required: true,
    },
    rating:{
        type:Number,
        required:true,
    }



})

module.exports = ratingschema;