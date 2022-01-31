const mongoose = require('mongoose')

const PasswordSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Password', PasswordSchema)