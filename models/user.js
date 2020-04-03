const mongoose = require ('mongoose');

const userSchema = mongoose.Schema (
    {
        _id: {
            type: Number
        },
        emailId: {
            type: String,
            unique: true
        },
        name: {
            type: String
        },
        isAdmin: {
            type: Boolean
        },
        password: {
            type: String
        },
        tickets: {
            type : Array
        }
    }
)

module.exports = mongoose.model ('User', userSchema);