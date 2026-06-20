const mongoose = require('mongoose');
const User = require('./models/User.js');

mongoose.connect('mongodb://localhost:27017/devloop')
  .then(async () => {
    console.log('Connected to MongoDB');
    const result = await User.findOneAndUpdate(
      { username: 'KillerClaws1' },
      { verified: true },
      { new: true }
    );
    if (result) {
      console.log('KillerClaws1 set as verified:', result);
    } else {
      console.log('User KillerClaws1 not found');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
