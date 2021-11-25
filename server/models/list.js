const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    title: {
        type: String,

    },
    cards: [
        {
            type: Schema.Types.ObjectId,
            ref:'cards',
        },
    ],
});

module.exports = list = mongoose.model('list', ListSchema);