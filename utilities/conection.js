let mongoose = require('mongoose');
let mongoconection = mongoose.createConnection(process.env.MONGO_URI);
module.exports = mongoconection;