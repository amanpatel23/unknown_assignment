const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/unknown_assignment");
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to the database: MONGODB'));
db.once('open', () => console.log('connected to the database: MONGODB'));