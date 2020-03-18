const express = require('express');
const router = express.Router();
const Ticket = require('./../models/ticket');
const User = require('./../models/user');
const helper = require('./../utility/helper');

router.post ('/cancel-ticket', async (req, res) => {
    let seatNum = req.body.seatNum;
    if (!helper.validateSeatNum(seatNum)) {
        res.status (400);
        res.send ("Invalid seat number, seat number should be between 1-40");
    }
    try {
        let answ = await Ticket.findById (seatNum);
        if (!answ.status) {
            res.status(400);
            res.send ("Seat is not booked");
        }
        else {
            let userId = answ.userId;
            User.deleteOne ({_id:userId}, (err, ans) => {
                if (err) {
                    res.status(500);
                    res.send("Oops something went wrong")
                }
                answ = helper.removeBookingDtls(answ)
                answ.save()
                    .then(() => {
                        res.status (200);
                        res.send ("Ticket cancelled successfully");
                    },
                    (err) => {
                        res.status (500);
                        res.send ("Oops something went wrong")
                    })
            })
        }
    }
    catch (err) {
        res.status (500)
        res.send ("Oops something went wrong");
    }
})

router.post('/book-ticket', async (req, res) => {
    let seatNum = req.body.seatNum;
    let userDetails = req.body.userDetails;

    if (!helper.validateSeatNum(seatNum)) {
        res.status(400)
        res.send("Invalid seat number, seat number should be between 1-40");
    }

    if (!helper.validateUserDetails(userDetails)) {
        //set code
        res.status(400)
        res.send("Invalid user details, user details must contain phone number, email id and name");
    }
    try {
        let answ = await Ticket.findById(seatNum);
        if (answ.status) {
            res.status(400)
            res.send("Seat already booked");
        }
        else {
            const user = helper.createUser (userDetails.phoneNumber, userDetails.emailId, userDetails.name)
            user.save()
                .then((user) => {
                    answ = helper.addBookingDtls (answ, user._id);
                    answ.save ()
                    .then (()=>{
                        res.status(200)
                        res.send("Ticket booked succesfully");
                    },
                    (err)=>{
                        res.status(500)
                        res.send("Oops something went wrong")
                    })
                    
                },
                (err) => {
                    res.status(500)
                    res.send("Oops something went wrong")
                })
        }
    }
    catch (err) {
        res.status(500);
        res.send("Oops something went wrong");
    }
})

router.get('/ticket-status/:id', async (req, res) => {
    let seatNum = parseInt(req.params.id);
    if (!helper.validateSeatNum(seatNum)) {
        res.status (400);
        res.send ("Invalid seat number, seat number should be between 1-40")
    }
    try {
        let answ = await Ticket.findById(seatNum);
        res.status (200);
        if (answ.status) {
            res.send ("Ticket is already booked")
        }
        res.send ("Ticket is available for booking");
    }
    catch (err) {
        res.status (500)
        res.send ("Oops something went wrong");
    }
})

router.get('/available-tickets', async (req, res) => {
    try { 
        let tickets = Ticket.find ({status: false})
        const docs = await tickets;
        if (!docs.length) {
            res.status (200);
            res.send ("No available tickets found");
        }
        let availableTickets = helper.extractTicketNum (docs);
        res.status (200);
        res.send (availableTickets);
    }
    catch (err) {
        res.status (500);
        res.send ("Oops something went wrong");
    }
})

router.get('/booked-tickets', async (req, res) => {
    try {
        let tickets = Ticket.find ({status: true})
        const docs = await tickets;
        if (!docs.length) {
            res.status (200);
            res.send ("No booked tickets found");
        }
        let bookedTickets = helper.extractTicketNum (docs);
        res.status (200);
        res.send (bookedTickets);
    }
    catch (err) {
        res.status (500);
        res.send ("Oops something went wrong");
    }
})

router.post ('/reset', async (req, res) => {
    let userId = req.body.userId;
    try {
        let user = await User.findById (userId);
        if (!user) {
            res.status (400);
            res.send ("Not a valid user")
        }
        if (user.isAdmin) {
            Ticket.updateMany ({}, {
                status: false,
                userId: null
            }, (err, answ) => {
                if (err) {
                    res.status(500);
                    res.send ("Oops something went wrong");
                }
                User.deleteMany ({isAdmin: false}, (err, answ) => {
                    if (err) {
                        res.status(500);
                        res.send ("Oops something went wrong");
                    }
                    res.status (200);
                    res.send ("Tickets resetted");
                })
            })
        }
        else {
            res.status (400);
            res.send ("Sorry only admin can reset the tickets");
        }
    }
    catch (err) {
        res.status (500)
        res.send ("Oops something went wrong");
    }
        
})
module.exports = router;