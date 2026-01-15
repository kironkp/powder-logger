const mongoose = require('mongoose');

const rideReportSchema = mongoose.Schema({
  rideName: {type: String, required: true},
  conditions: {type: String, enum: ['Really Bad','Bad', 'So-So', 'Good', 'Incredible'], required: true},
  notes: {type: String},
})

const userSchema = mongoose.Schema({
  // in username Schema we will have 1. username 2. password and 3. the whole rideReportSchema in the array of what a user 'is'
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rideReports: [rideReportSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
