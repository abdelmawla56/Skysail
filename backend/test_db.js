const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnect = async () => {
    try {
        const uri = process.env.MONGODB_URI.split('.net/')[0] + '.net/?retryWrites=true&w=majority';
        console.log('Testing connection with base cluster URI...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log('SUCCESS: Connected to Cluster.');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Connection failed.');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
};

testConnect();
