const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


require("dotenv").config();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET

app.use(express.json());

app.post("/register", async(req,res)=>{
    try{
        const {username, password} = req.body;
        const salt =  await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = {username, password:hashedPassword}
        users.push(user);
        res.status(201).json({message: "data has been saved successfully"});
    } catch(err){
        res.status(400).json({message:err.message})
    }
})

app.post("/login", async(req,res)=>{
    try{
        const {username, password} = req.body;
        const user = users.find(u=> u.username === username);
        if(!user)
            res.json({message: "Username doesn't exist"});
        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched)
            res.json({message: "Password entered is wrong"});

        const userInfo ={username:user.username}

        const token = jwt.sign(userInfo, JWT_SECRET, {expiresIn:"20s"})

        res.status(201).json(token);
    } catch(err){
        res.status(400).json({message:err.message})
    }
})

app.listen(process.env.AUTH_PORT, ()=>{
    console.log("Connected to authentication server", "http://localhost:3997/");
})
