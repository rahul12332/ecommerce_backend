const express = require('express');
const PORT = 3000;
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./DB/db'); // Adjust the path as needed


const authRouter = require("./routes/auth");
connectDB();

app.use(express.json());
app.use(authRouter);



app.listen(PORT, "0.0.0.0", ()=>{
    console.log('connected at port '+PORT);
});