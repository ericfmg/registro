const express = require('express')
const path = require('path')
const bodyParser=require('body-parser')
const app=express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User=require('./user')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

const mongo_uri='mongodb+srv://bitclasses:Ht99q0xhmNZOkpjX@bit-cluster1.t74w4ob.mongodb.net/myapp?retryWrites=true&w=majority'
mongoose.connect(mongo_uri,function(err){
 if (err){
    throw err
 }else{
    console.log(`Successfully conect to ${mongo_uri}`)
 }
})

app.post('/register',(req,res)=>{
const {username,password}=req.body

const user=new User({username,password})
user.save(err =>{
   if (err){
      res.status(500).send('Error al registrar al usuario')
   }else{
      res.status(200).send('Usuario registrado')
   }
})
})
app.post('/authenticate',(req,res)=>{
const {username,password}=req.body
User.findOne({username},(err, user)=>{
   if(err){
res.status(500).send('error el autenticar al usuario')
   }else if(!user){
      res.status(500).send('El usuario no existe')
   }else{
      user.iscorrectPassword(password,(err,result)=>{
         if(err){
            res.status(500).send('Error al autenticar')
         }else if(result){
            res.status(200).send ('Usuario autenticado correctamente')
         }else{
            res.status(500).send('usuario y/o contraseña incorrecta')
         }
      })
   }
})
})

app.listen(5500,()=>{
 console.log('server started')
})

module.exports=app;

