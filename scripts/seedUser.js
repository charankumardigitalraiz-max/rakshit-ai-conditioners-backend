const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'admin@rakshithac.com';
    const password = 'adminpassword123';

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists');
      process.exit();
    }

    await User.create({
      name: 'Admin User',
      email: email,
      password: password,
      role: 'super-admin',
    });

    console.log('Admin user created successfully');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit();
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();
