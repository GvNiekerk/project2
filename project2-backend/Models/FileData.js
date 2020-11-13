const { boolean } = require('@hapi/joi');
const mongoose = require('mongoose');

const Meta = {
    email : boolean,
    id: boolean,
    mobile: boolean
}

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    meta: {
        type: Meta,
        required: true
    }
});

module.exports = mongoose.model('FileData', fileSchema);