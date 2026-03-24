require('dotenv').config({ path: '../../.env' });
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

// Test
notifyDriver('rathnan387@gmail.com', 'Sangeetha H', '9876543210', 12.9716, 77.5946);