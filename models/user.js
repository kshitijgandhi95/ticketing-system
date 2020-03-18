const mongoose = require ('mongoose');

const userSchema = mongoose.Schema (
    {
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

// userSchema.virtual('phoneNumber').get(function() {
//     return this._id;
// });

module.exports = mongoose.model ('User', userSchema);