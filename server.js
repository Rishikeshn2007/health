const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
require('dotenv').config();
const { search, markDone } = require('./backend/controllers/ambulance');
const drugRoute = require('./backend/router/drug');
const app=express();
app.use(express.json());
app.use('/frontend',express.static(path.join(__dirname,'frontend')));

app.get('')
app.post('/getambulance', async (req, res) => {
    const { name, email, latitude, longitude } = req.body;

    if (!name || !email || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            error: 'name, email, latitude and longitude are required'
        });
    }

    const patientLat = Number(latitude);
    const patientLon = Number(longitude);

    if (Number.isNaN(patientLat) || Number.isNaN(patientLon)) {
        return res.status(400).json({
            error: 'latitude and longitude must be valid numbers'
        });
    }

    try {
        const allocation = await search(patientLat, patientLon, {
            name,
            email
        });

        return res.status(200).json({
            message: 'Ambulance allocated successfully',
            allocation
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message || 'Failed to allocate ambulance'
        });
    }
});

app.get('/call',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend/html/abc.html'));
})
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend/html/emergency.html'));
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_LINK)
    .then(() => {
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });
