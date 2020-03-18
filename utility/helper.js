const Ticket = require('./../models/ticket');
const User = require('./../models/user');

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

module.exports.createUser = function (email, name) {
    return new User({
        _id: Date.now(),
        emailId: email,
        name: name,
        isAdmin: false
    })
}

module.exports.addBookingDtls = function (ticket, id) {
    ticket.status = true;
    ticket.userId = id;
    return ticket;
}

module.exports.removeBookingDtls = function (ticket) {
    ticket.staus = false;
    ticket.userId = null;
    return ticket;
}