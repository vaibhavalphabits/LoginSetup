const { mongoose } = require("mongoose");


const Schema=new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true }
});

module.exports=mongoose.model("user",Schema);