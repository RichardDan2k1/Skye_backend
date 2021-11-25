const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,

    },

    label: {
        type: String,
    },

    cheklist: [
        {
            text: {
                type: String,
            },
            conplete: {
                type: Boolean,
            },
        },
    ],
});

module.exports = card = mongoose.model('card', CardSchema);