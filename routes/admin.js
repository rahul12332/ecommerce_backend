const express = require('express');
const adminRouter = express.Router();
const admin = require('../middleware/admin');
const {Product} = require("../models/productmodel");
const Order = require('../models/order');

adminRouter.post('/addproduct', admin, async(req, res) =>{
    console.log("adminroute is hitting now");
try{

    const {name, description, images, quantity, price, category} = req.body;
    let product = new Product({
        name,
        description,
        images,
        quantity,
        price,
        category

    });

    product = await product.save();
    res.json({
        msg:"add product is successfully done",
        roduct:product});


}catch(e){
    console.log(e.message);

    res.status(500).json({error:e.message});

}

})

adminRouter.get('/admin/product', admin,async(req, res)=>{
    
    try{
        const product = await Product.find({});
        res.json({
            msg:"successfull",
            product:product
        })
    }
    catch(e){
      
        res.status(500).json({error:e.message});

    }

})

adminRouter.get('/admin/delete-product', admin, async (req, res) => {
    console.log("delete api is hit");
    try {
      const { id } = req.query; // Use req.query instead of req.body for GET requests
      if (!id) {
        return res.status(400).json({ error: "Missing 'id' parameter" });
      }
  
      let product = await Product.findByIdAndDelete(id);
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (e) {
      console.error(e.message);
      res.status(500).json({ error: e.message });
    }
  });
  


  adminRouter.get('/api/all-oders', admin, async(req, res)=>{

    try{
      const orders = await Order.find({})
      
      res.status(200).json(orders)

    }
    catch(e){
      res.json({
        error:e.message
      })

    }

  })

  adminRouter.post('/api/change-order-status', admin, async(req, res)=>{

    const {id, status} = req.body;
    console.log(`orderId${id}`);
    console.log(`oderStatus${status}`);

    try{
      let orders = await Order.findById(id);
      orders.status = status;
      orders = await orders.save();
      
      res.status(200).json(orders)

    }
    catch(e){
      res.json({
        error:e.message
      })

    }
    
  })
  adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
    console.log("chnge order api is hit")
    const {id, status} = req.body;
    try {
      let order = await Order.findById(id);
    
      if (!order) {
        console.log(`404${error}`);
        return res.status(404).json({ error: 'Order not found' });
      }
      console.log(`my orders ${order}`);
      order.status = status;
      order = await order.save();
      res.json(order);
    } catch (e) {
      console.log(`500${error}`);

      res.status(500).json({ error: e.message });
    }
   } );
  
  

   adminRouter.get('/admin/analytics', admin, async (req, res)=>{
    console.log("analytics api is working");
     try{

      const orders = await Order.find({});
      let totalEarnings = 0;
      for(let i = 0; i<orders.length; i++){

           for(let j = 0; j<orders[i].products.length; j++){
            totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;

           }

      }
      let mobileEarning = await fetchCategoryWiseProduct('Mobiles');
      let essentialEarnings = await fetchCategoryWiseProduct('Essentials');
      let applianceEarnings = await fetchCategoryWiseProduct('Appliances');
      let booksEarnings = await fetchCategoryWiseProduct('Books');
      let fashionEarnings = await fetchCategoryWiseProduct('Fashion');

      let earnings = {
        totalEarnings,
        mobileEarning,
        essentialEarnings,
        applianceEarnings,
        booksEarnings,
        fashionEarnings
      }

      res.json(earnings);

     }catch(e){
      console.log(`500${e.message}`);

      res.status(500).json({ error: e.message });
     }

   });

   async function fetchCategoryWiseProduct(category){
    console.log("fetchcategoryFunction is working now");

    let earnings = 0;
    let categoryOrders = await Order.find({

      "products.product.category":category
    });
    for(let i = 0; i<categoryOrders.length; i++){

      for(let j = 0; j<categoryOrders[i].products.length; j++){
       earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.price;

      }

 }
 return earnings;
   }

module.exports = adminRouter;
