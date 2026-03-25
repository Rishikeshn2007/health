const express=require('express');
const db=require('../model/ambulance');

async function getAmbulance()
{
    return await db.ambulance.find();    
}

module.exports={getAmbulance};