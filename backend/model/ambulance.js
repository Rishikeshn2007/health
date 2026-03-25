const express = require('express');
const mongoose=require('mongoose');

const amb_schema=new mongoose.Schema(
    {
        name: {
            type: String,
            required: true 
        },
        address:{
            type: String,
            required: true
        },
        emp_name: {
            type: String,
            required: true
        },
        phno: {
            type: String,
            required: true
        },
        email: {
            type: String
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        booked: {
            type: Boolean,
            required: true
        },
        alloted_to: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const ambulance=mongoose.model('ambulance',amb_schema,'ambulance');

module.exports=ambulance;
