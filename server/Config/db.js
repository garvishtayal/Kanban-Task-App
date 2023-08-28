const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://garvishtayal:X80ygcBSAWP4v0h8@cluster0.lhnyt6g.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

module.exports = db;
