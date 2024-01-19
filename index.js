const express = require('express');
const PORT = 3000;
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./DB/db'); // Adjust the path as needed


const authRouter = require("./routes/auth");
const authRouter2 = require("./routes/admin");
const productRouter = require("./routes/product");
const userRouter = require('./routes/user')
connectDB();

app.use(express.json());
app.use(authRouter);
app.use(authRouter2);
app.use(productRouter);
app.use(userRouter);



app.listen(PORT, "0.0.0.0", ()=>{
    console.log('connected at port '+PORT);
});