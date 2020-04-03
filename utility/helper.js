const Ticket = require('./../models/ticket');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');

module.exports.validateSeatNum = function (seatNum) {
    if (seatNum > 0 && seatNum <= 40) {
        return true
    }
    return false;
}

module.exports.validateUserDetails = function (userDetails) {
    if (userDetails.emailId && userDetails.name) {
        return true
    }
    return false;
}

module.exports.extractTicketNum = function (tickets) {
    returnArr = [];
    for (let i = 0; i < tickets.length; i++) {
        returnArr.push(tickets[i]._id);
    }
    return returnArr;
}

module.exports.createUser = function (email, name, password) {
    return new User({
        _id: Date.now(),
        emailId: email,
        name: name,
        isAdmin: false,
        password: password,
        tickets: []
    })
}

module.exports.addBookingDtls = function (ticket, id) {
    ticket.status = true;
    ticket.userId = id;
    return ticket;
}

module.exports.removeBookingDtls = function (ticket) {
    ticket.status = false;
    ticket.userId = null;
    return ticket;
}

module.exports.verifyToken = function (token, secretKey) {
    return new Promise ((resolve, reject) => {
        jwt.verify(token, secretKey, (err, authData) => {

            if (err) {
                reject ()
            } else {
                resolve(authData)
            }
        });
    })
}

module.exports.getToken = function (token) {
    if (!token) {
        return null;
    }
    const bearer = token.split(' ');
    const bearerToken = bearer[1];
    return bearerToken;
}