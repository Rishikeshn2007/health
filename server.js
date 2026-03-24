const express=require('express');
require('dotenv').config()
const mongoose=require('mongoose');
const port=process.env.PORT;

const app=express();

//Internal packages
const ambulance=require('./backend/controllers/ambulance');

app.use('/',async (req,res)=>{
    await ambulance.getdata();
    res.send('Server runnig successfully!')
})

mongoose.connect(process.env.DB_LINK)
.then(()=>{
    console.log('Connection to database successful !');
    app.listen(process.env.PORT,(req,res)=>{
        console.log(`Server running at 127.0.0.1:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log('Could not connect: ',err);
})