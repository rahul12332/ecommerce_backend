const e = require("cors");
const express = require("express");
const productRouter = express.Router();
const auth = require('../middleware/auth');
const {Product} = require("../models/productmodel");
const ratingSchema = require('../models/rating');


productRouter.get("/user/get-product", auth, async(req, res)=>{
    try{
       
        const product = await Product.find({
            category:req.query.category
        });
        res.json(product); 

    }catch(e){
        res.status(500).json({
            error: e.message
        });
    }
})

// searching api

productRouter.get("/user/get-product/search/:name", auth, async (req, res) => {
  console.log("searchApi is hit");
  const searchName = req.params.name;
  console.log("search---", searchName);


    try {
  
      // Check if the search string is empty
      if(searchName==""){
        console.log("empty condition");
        res.json({
          
          msg:"no data is found"
        })
      }
      if(!searchName){
        console.log("empty condition2");
        res.json({
          
          msg:"no data is found"
        })
      }
  
      const product = await Product.find({
        name: { $regex: searchName, $options: "" }
      });
  
      console.log(product);
      res.json(product);
    } catch (e) {
      console.log(`500 wale me gya lo ${e.message}`);
      res.status(500).json({
        error: e.message
      });
    }
  });
  
productRouter.post('/api/rate-product', auth, async (req, res) => {
    console.log("Rating API is hit");
    try {
        const {id, rating} = req.body;
      let product = await Product.findById(id);
      for(let i = 0; i < product.ratings.length; i++){

           if(product.ratings[i].userId == req.user){
            
            product.ratings.splice(i, 1);
            break;

              

           }



      }

      const ratingSchema = {
      userId:req.user,
      rating

      }
          

      product.ratings.push(ratingSchema);
      product = await product.save();
      res.json(product);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
});

productRouter.get('/api/deal-of-day', auth, async(req, res)=>{
    
    console.log("deal of the day api is hit");

    try{
        let products = await Product.find({}); 

        products.sort((a, b)=>{
            let aSum = 0;
            let bSum = 0;

            for(let i = 0; i< a.ratings.length; i++){
          
                aSum += a.ratings[i].rating;

            }
                
            for(let i = 0; i<b.ratings.length; i++){

                bSum += b.ratings[i].rating;
            }

            return aSum <bSum ? 1 : -1;

        });

        return res.json(products[0]);

    }catch(e){
        console.log(`500${e.message}`);
        res.status(500).json({
            error:e.message 
        })
    }


});


module.exports = productRouter;
