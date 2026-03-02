const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    license: {
        type: String,
        required: [true, 'Please add car license']
    },
    brand: {
        type: String,
        required: [true, 'Please add car brand']
    },
    model: {
        type: String,
        required: [true, 'Please add car model']
    },
    city: {
        type: String,
        required: [true, 'Please add car city']
    },
    provider:{
        type: mongoose.Schema.ObjectId,
        ref: 'Provider',
        required: true
    }
});

module.exports = mongoose.model('Car', CarSchema);