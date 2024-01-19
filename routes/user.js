const express = require('express');
const userRouter = express.Router();
const auth = require("../middleware/auth")
const {Product} = require("../models/productmodel");
const User = require('../models/user');
const Order = require('../models/order');

userRouter.post("/api/add-to-cart", auth, async (req, res) => {
    try {
      const { id } = req.body;
      const product = await Product.findById(id);
      let user = await User.findById(req.user);
  
      if (user.cart.length == 0) {
        user.cart.push({ product, quantity: 1 });
      } else {
        let isProductFound = false;
        for (let i = 0; i < user.cart.length; i++) {
          if (user.cart[i].product._id.equals(product._id)) {
            isProductFound = true;
          }
        }
  
        if (isProductFound) {
          let producttt = user.cart.find((productt) =>
            productt.product._id.equals(product._id)
          );
          producttt.quantity += 1;
        } else {
          user.cart.push({ product, quantity: 1 });
        }
      }
      user = await user.save();
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });





userRouter.get('/user/cart', auth, async (req, res) => {
              
    console.log("user cart api is hit");

    try {
      // Get user's email from the request body
  
      // Fetch the user from the database based on the email
      const user = await User.findById(req.user);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Extract and send the cart data
      const userCart = user.cart;
      res.json({ cart: userCart });
    }catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  

userRouter.delete("/api/remove-from-cart/:id", auth, async(req, res)=>{
try{
    const {id} = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);
    
     for(let i = 0; i < user.cart.lenght; i++){
        if(user.cart[i].product._id.equals(product._id)){
            user.cart.splice(i, 1);
        } else{
            
        }
     }


}catch(e){

    res.status(500).json({ error: 'Internal Server Error' });


}

});


// save user address

userRouter.post('/api/save-user-address', auth, async (req, res) => {
  console.log("Address api is hit");
  try {
    const { flat, area, street, pincode } = req.body;
    const newAddress = {
      flat,
      area,
      street,
      pincode,
    };

    let user = await User.findById(req.user);
    console.log("new user address", newAddress);
    user.address.push(newAddress); // Assuming you want to add the new address to the existing addresses
    user = await user.save();

    res.status(200).json({ message: 'Address saved successfully', user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// fetch user address api

userRouter.get('/api/getUserAddress', auth, async(req, res)=>{

  console.log("fetch userAddress for ordernow");
  try{
    console.log('inside the try bloc')
    let user = await User.findById(req.user);
    const userAddress = user.address;
    
    res.status(200).json({
      msg:"successfully done",
      userAddress:userAddress
    });

  }
  catch(e){
    res.status(500).json({
      error:e.message
    })
  }



  

})

// update user address;
userRouter.put('/api/update-user-address/:_id', auth, async (req, res) => {
  console.log("update address api")
  try {
    const { flat, area, pincode, street } = req.body;
    let user = await User.findById(req.user);
    const updatedAddress = {
      flat,
      area,
      street,
      pincode,
    };

    console.log(user.address);
    const addressId = req.params._id;


    for (let i = 0; i < user.address.length; i++) {
      if (user.address[i]._id.toString() === addressId) {
        // Found the address with the specified _id
        user.address[i].flat = flat || user.address[i].flat;
        user.address[i].area = area || user.address[i].area;
        user.address[i].street = street || user.address[i].street;
        user.address[i].pincode = pincode || user.address[i].pincode;

        updatedAddress = user.address[i];
        break;
      }
    }

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await user.save();

    console.log("Updated address:", updatedAddress);

  
  res.json({
      message: 'Address updated successfully',
    });
  } catch (e) {
    console.log(`error ${e.message}`);
    res.status(500).json({
      error: e.message
    });
  }
});


// ordering the product
userRouter.post("/api/order", auth, async (req, res) => {
  try {
    const { totalPrice, address } = req.body;
    let products = [];
    let user = await User.findById(req.user);

    let cart = user.cart;

    for (let i = 0; i < cart.length; i++) {
      console.log(`cart length is ${cart.length}`);
      let product = await Product.findById(cart[i].product._id);
      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;
        products.push({ product, quantity: cart[i].quantity });
        await product.save();
      } else {
        return res
          .status(400)
          .json({ msg: `${product.name} is out of stock!` });
      }
    }

    user.cart = [];
    user = await user.save();

    let order = new Order({
      products,
      totalPrice,
      address,
      userId: req.user,
      orderedAt: new Date().getTime(),
    });
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



userRouter.get("/api/orders/me", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
  
  

module.exports = userRouter;
