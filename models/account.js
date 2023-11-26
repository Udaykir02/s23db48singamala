const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const accountSchema = new mongoose.Schema({
  username: String,
  password: String,
});

accountSchema.plugin(passportLocalMongoose);

// Manually define the validPassword method
accountSchema.methods.validPassword = function(password) {
  return password === this.password;
};

module.exports = mongoose.model('Account', accountSchema);
