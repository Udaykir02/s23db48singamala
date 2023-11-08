const mongoose = require('mongoose');

const horseSchema = new mongoose.Schema({
  horse_name: String,
  horse_age: Number,
  horse_price: Number,
});

module.exports = mongoose.model('Horse', horseSchema);
