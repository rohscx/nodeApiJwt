const mongoose = require('mongoose');

const tesseractSchema = new mongoose.Schema({
    ocrId: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    status: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    progress: {
        type: Number,
        required: true,
    },
    metaData: {
        type: Object,
        required: true,
    },
    result: {
        type: String,
        required: true,
        max: 10240000,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Tesseract', tesseractSchema);