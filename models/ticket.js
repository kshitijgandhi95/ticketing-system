const mongoose = require ('mongoose');

const ticketSchema = new mongoose.Schema (
    {
        _id: {
            type: Number
        },
        status: {
            type: Boolean
        },
        userId: {
            type: String
        }
    }
)

ticketSchema.virtual('seatNumber').get(function() {
    return this._id;
});

module.exports = mongoose.model ('Tickets', ticketSchema);