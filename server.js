const express = require("express");
const database = require("./database");

const app = express();

require("dotenv").config();
//routes
const {authMiddleware} = require("./middlewares/authMiddleware")

//middlewares


app.get("/", authMiddleware, (req,res)=>{
    res.json({"message": `Hello ${req.user}`});
})

app.get("/admin",(req,res)=>{ 
    res.json(users);
})

app.listen(process.env.MAIN_PORT, ()=>{
    console.log("Connected to main server", "http://localhost:3998/");
})