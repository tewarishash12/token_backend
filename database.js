const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function mongoConnect(){
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Connected to database")
    } catch (err){
        console.log(err.message);
    }
}

mongoConnect();