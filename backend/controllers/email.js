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
  const patient = typeof patientName === 'object'
    ? patientName
    : {
        name: patientName,
        phone: patientPhno,
        latitude: lat,
        longitude: lng
      };
  const allocation = typeof patientPhno === 'object' ? patientPhno : null;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${patient.latitude},${patient.longitude}`)}`;
  const detailLines = [
    `Patient name: ${patient.name || 'Not provided'}`,
    `Patient phone: ${patient.phone || 'Not provided'}`,
    `Patient email: ${patient.email || 'Not provided'}`,
    `Emergency: ${patient.emergency || 'Not provided'}`,
    `Address: ${patient.address || 'Not provided'}`,
    `Notes: ${patient.notes || 'Not provided'}`,
    `Location: ${mapsLink}`
  ];

  if (allocation) {
    const doneLink = allocation.doneLink || 'http://127.0.0.1:4000/done';
    detailLines.unshift(
      `Ambulance: ${allocation.ambulanceName || 'Not provided'}`,
      `Driver: ${allocation.driverName || 'Not provided'}`,
      `Driver phone: ${allocation.driverPhone || 'Not provided'}`,
      `ETA: ${allocation.etaMinutes ? `${Math.round(allocation.etaMinutes)} minutes` : 'Not available'}`,
      `Distance: ${allocation.distanceKm ? `${allocation.distanceKm.toFixed(2)} km` : 'Not available'}`,
      `Mark trip done: ${doneLink}`
    );
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: driverEmail,
    subject: 'New Ambulance Allocation',
    text: `This is an automated email.\n\nYou have been allocated a patient pickup.\n\n${detailLines.join('\n')}`
  });

  console.log('Email sent successfully!');
}

module.exports = { notifyDriver };
