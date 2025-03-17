
const mongoose = require('mongoose');

const healthAssessmentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  gender: String,
  weight: Number,
  height: Number,
  bloodPressure: String,
  oxygenSaturation: Number,
  recommendations: String
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthAssessment', healthAssessmentSchema);