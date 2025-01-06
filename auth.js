const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


require("dotenv").config();
const users = [];
const refresh_tokens = new Set();

const MAIN_SECRET = process.env.MAIN_SECRET
const AUTH_SECRET = process.env.AUTH_SECRET

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

app.post("/token", async()=>{
    const refresh_token = req.body.token;
    if(!refresh_tokens.has(refresh_token))
        return res.status(401).json({message:"You need to login"})

    jwt.verify(refresh_token, process.env.MAIN_SECRET, (err,data)=>{
        if(err)
            return res.status(400).json({message:"Forbidden"});
        const token = generateToken(token_data)
        return res.status(201).json({message:"You are verified"});
    })

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

        const userInfo ={username:user.username};
        const token_data = {user:userInfo};

        const refresh_token = jwt.sign(userInfo, MAIN_SECRET); 
        refresh_tokens.add(refresh_token)
        const token = generateToken(token_data)
        
        res.status(201).json({auth_token: token, refresh_token: refresh_token});
    } catch(err){
        res.status(400).json({message:err.message})
    }
})

function generateToken(data){
    return jwt.sign(data, AUTH_SECRET, {expiresIn:"20s"})
}

app.listen(process.env.AUTH_PORT, ()=>{
    console.log("Connected to authentication server", "http://localhost:3997/");
})
