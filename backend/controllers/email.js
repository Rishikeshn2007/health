require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function notifyDriver(driverEmail, patientName, patientPhno, lat, lng) {
  const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: driverEmail,
    subject: 'New Ambulance Allocation',
    text: `This is a automated email \nYou have been allocated to ${patientName} (${patientPhno}). Navigate here: ${mapsLink}`
  });

  console.log('Email sent successfully!');
}

module.exports = { notifyDriver };
