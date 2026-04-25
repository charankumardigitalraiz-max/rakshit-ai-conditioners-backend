const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const Product = require('../models/products');
        const Enquiry = require('../models/Enquiry');

        const products = await Product.find().limit(2).lean();
        console.log('Sample Products:', JSON.stringify(products, null, 2));

        const enquiries = await Enquiry.find().limit(2).lean();
        console.log('Sample Enquiries:', JSON.stringify(enquiries, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
