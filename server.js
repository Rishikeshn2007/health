const express=require('express');
require('dotenv').config()
const port=process.env.PORT;

const app=express();

//Internal packages

app.use('/',(req,res)=>{
    res.send('Server runnig successfully!')
})

app.listen(port,(req,res)=>{
    console.log(`Server running on 127.0.0.1:${port}`);
});