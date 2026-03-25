const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

// Internal packages
const ambulanceController = require('./backend/controllers/ambulance');
const drug_route = require('./backend/router/drug');

app.use(express.json());

// 1. Use the drug router (make sure this is before the catch-all '/')
app.use('/api/drugs', drug_route);

// 2. Fix the /see route - Use .get and specific path
app.get('/see', async (req, res) => {
    try {
        const data = await ambulanceController.getAmbulance();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch ambulances" });
    }
});

// 3. The Root route MUST come last
app.get('/', (req, res) => {
    res.send('Server running successfully!');
});

// Database Connection
mongoose.connect(process.env.DB_LINK)
.then(() => {
    console.log('Connection to database successful!');
    app.listen(process.env.PORT, () => {
        console.log(`Server running at http://127.0.0.1:${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log('Could not connect: ', err);
});