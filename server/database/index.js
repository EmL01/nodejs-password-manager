const mongoose = require('mongoose'),
    DB_URI = process.env.DB_URI

module.exports = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.log(`MongoDB error: ${err.message}`);
    }
};