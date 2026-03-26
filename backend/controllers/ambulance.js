const Ambulance = require('../model/ambulance');
const { notifyDriver } = require('./email');

async function nearest(lat1, lon1, lat2, lon2) {
  const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
  const result = await fetch(url);
  const data = await result.json();

  if (data.code !== 'Ok') {
    throw new Error('Route not found');
  }

  const route = data.routes[0];

  return {
    distance: route.distance / 1000,
    duration: route.duration / 60,
  };
}

async function search(patientLat, patientLon, patient = {}) {
  const ambulances = await Ambulance.find({
    $or: [
      { booked: false },
      { booked: 'false' },
      { booked: { $exists: false } },
      { booked: null },
    ],
  });

  if (!ambulances.length) {
    throw new Error('No ambulances available');
  }

  let bestAmbulance = null;
  let bestTime = Infinity;
  let bestDistance = Infinity;

  for (const ambulance of ambulances) {
    try {
      const result = await nearest(
        patientLat,
        patientLon,
        ambulance.latitude,
        ambulance.longitude
      );

      if (result.duration < bestTime) {
        bestAmbulance = ambulance;
        bestTime = result.duration;
        bestDistance = result.distance;
      }
    } catch (error) {
      console.log('Skipping ambulance due to routing error:', error.message);
    }
  }

  if (!bestAmbulance) {
    throw new Error('Unable to calculate route to any ambulance');
  }

  const patientDetails = {
    patientId: patient.patientId || patient.id || '',
    name: patient.name || '',
    phone: patient.phone || patient.phno || '',
    email: patient.email || '',
    latitude: patientLat,
    longitude: patientLon,
    address: patient.address || '',
    emergency: patient.emergency || patient.type || '',
    notes: patient.notes || '',
    allocatedAt: new Date(),
  };

  const allocatedAmbulance = await Ambulance.findOneAndUpdate(
    {
      _id: bestAmbulance._id,
      $or: [
        { booked: false },
        { booked: 'false' },
        { booked: { $exists: false } },
        { booked: null },
      ],
    },
    {
      $set: {
        booked: true,
        alloted_to: patientDetails.patientId || patientDetails.phone || patientDetails.name || null,
        patientDetails,
      },
    },
    { new: true }
  );

  if (!allocatedAmbulance) {
    throw new Error('Ambulance was already booked. Please try again.');
  }

  const driverEmail = allocatedAmbulance.driverEmail || allocatedAmbulance.email || null;
  const doneLink = `http://127.0.0.1:4000/done?ambulanceId=${encodeURIComponent(allocatedAmbulance._id.toString())}`;

  if (driverEmail) {
    await notifyDriver(driverEmail, patientDetails, {
      ambulanceName: allocatedAmbulance.name,
      driverName: allocatedAmbulance.emp_name,
      driverPhone: allocatedAmbulance.phno,
      etaMinutes: bestTime,
      distanceKm: bestDistance,
      doneLink,
    });
  }

  return {
    ambulanceId: allocatedAmbulance._id,
    ambulanceName: allocatedAmbulance.name,
    driver: allocatedAmbulance.emp_name,
    phone: allocatedAmbulance.phno,
    driverEmail,
    doneLink,
    ETA_minutes: bestTime,
    distance_km: bestDistance,
    patientDetails,
  };
}

async function markDone({ ambulanceId, email }) {
  const query = ambulanceId
    ? { _id: ambulanceId }
    : email
      ? { 'patientDetails.email': email }
      : null;

  if (!query) {
    throw new Error('ambulanceId or email is required');
  }

  const ambulance = await Ambulance.findOne(query);

  if (!ambulance) {
    throw new Error('Allocated ambulance not found');
  }

  await Ambulance.updateOne(
    { _id: ambulance._id },
    {
      $set: {
        booked: false,
        alloted_to: null,
        patientDetails: null,
      },
    }
  );

  return {
    ambulanceId: ambulance._id,
    ambulanceName: ambulance.name,
    booked: false,
  };
}

module.exports = { search, nearest, markDone };
