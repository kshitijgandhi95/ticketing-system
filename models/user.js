const mongoose = require ('mongoose');

const userSchema = mongoose.Schema (
    {
        _id: {
            type: Number
        },
        emailId: {
            type: String
        },
        phoneNUmber: {
            type: Number
        },
        name: {
            type: String
        },
        isAdmin: {
            type: Boolean
        }
    }
)

module.exports = mongoose.model ('User', userSchema);