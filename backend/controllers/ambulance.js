const express=require('express');
const ambulance=require('../model/ambulance');

async function getdata()
{
    const result = await ambulance.find()
    console.log(result);
    
}

module.exports={getdata};