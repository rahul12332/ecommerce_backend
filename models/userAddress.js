const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
  flat: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  
  street: {
    type: String,
    required: true
  },
  
  pincode:{
    type:Number,
    required:true
  }


});


module.exports =  addressSchema;
