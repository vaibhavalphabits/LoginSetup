const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const path=require('path');
const mongoose=require('mongoose')
require("dotenv").config();
const user=require('./Model/Models')
// const bodyParser=require('body-parser');
const JWT=require('jsonwebtoken');


app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
const bcrypt=require('bcrypt');
const { send } = require('process');

app.get('/',(req,res)=>{
    res.render('index')
})
// Using Bcrypt

// Handle Submission

app.post('/submitForm',(req,res)=>{
    const{username,password,email,age}=req.body;
    // Using Bcrypt
    bcrypt.genSalt(10,(req,salt)=>{
       bcrypt.hash(password,salt,async(err,hash)=>{
        let UserCreated=await user.create({
            username,
            email,
            password:hash,
            age
        })
        // $2b$10$/8uKOZgScpxo/.4Cu8MZiOF4MldV64yvkWriICBuwuSqq.2PcO7CK  this is our hash value
        let token=JWT.sign({email},"asdfghjk");
        res.cookie("token",token);
        res.send(UserCreated);
        
       })
    })
    // console.log(`Username:${username},Password:${password},Email:${email},Age:${age}`);

    // res.send(`Form Submitted! Username:${username},Password:${password}`)
})
// Login
app.get("/login",(req,res)=>{
    res.render('login');
})
app.post("/login",async function(req,res){
    let User=await user.findOne({email:req.body.email});    
    // console.log(User);
    if(!User) return res.send("Something Went Wrong!")
     
        bcrypt.compare(req.body.password,User.password,function(err,result){
            // console.log(res);
            if(result){
                let token=JWT.sign({email:User.email},"asdfghjk");
                res.cookie("token",token);
                res.send("Yes You Can Login");  
            } 
            else res.send("Something Is Wrong");
            
        })

})
// Logout
app.get("/logout",(req,res)=>{
        res.cookie("token","");
        res.redirect("/");

})
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongoose Connected"))
.catch((err)=>console.log(err));
app.listen(5000);