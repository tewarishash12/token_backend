const {Schema} = require("mongoose");

const UserSchema = new Schema({
    username: {type: String, unique:true},
    password: {type:String, min:8}
})

