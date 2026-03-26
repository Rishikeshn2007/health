const mongoose = require('mongoose');

const patientDetailsSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    address: {
      type: String,
      trim: true,
    },
    emergency: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    allocatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ambulanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    emp_name: {
      type: String,
      required: true,
      trim: true,
    },
    phno: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    driverEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    booked: {
      type: Boolean,
      default: false,
    },
    alloted_to: {
      type: String,
      trim: true,
      default: null,
    },
    patientDetails: {
      type: patientDetailsSchema,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'ambulance',
  }
);

module.exports = mongoose.models.Ambulance || mongoose.model('Ambulance', ambulanceSchema);
