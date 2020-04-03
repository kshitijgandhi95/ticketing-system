const express = require('express');
const router = express.Router();
const Ticket = require('./../models/ticket');
const User = require('./../models/user');
const helper = require('./../utility/helper');
const secretKey = process.env.SECRETKEY || "secretKey"

router.use ('/', (req, res, next) => {
    let token = helper.getToken (req.headers['authorization']);
    if (!token) {
        res.status (400);
        res.send ("No token found")
    }
    else {
        helper.verifyToken (token, secretKey)
        .then ((authData) => {
            res.locals.authData = authData.payload;
            next()
        },
        (err) => {
            res.status (400);
            res.send ("Invalid token")
        })
    }
})
router.post ('/cancel-ticket', async (req, res) => {
    let seatNum = req.body.seatNum;
    let authData = res.locals.authData;
    let reqUserId = authData.dtl.id;

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
            if (!userId) {
                res.status(400);
            }
            if (userId != reqUserId) {
                res.status (400);
                res.send ("Seat not booked by you")
            }
            else {
                try {
                    let user = await User.findById (reqUserId);
                    let tickets = user.tickets;
                    let index = tickets.indexOf (seatNum);
                    tickets.splice (index,1);

                    user.save()
                    .then (()=> {
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
                    },
                    (err) => {
                        res.status (500);
                        res.send ("Oops something went wrong")
                    })
                }
                catch (err) {
                    res.status (500)
                    res.send ("Oops something went wrong");
                }
                    
            }
        }
    }
    catch (err) {
        res.status (500)
        res.send ("Oops something went wrong");
    }
})

router.post('/book-ticket', async (req, res) => {
    let seatNum = req.body.seatNum;
    let authData = res.locals.authData;
    let userId = authData.dtl.id;

    if (!helper.validateSeatNum(seatNum)) {
        res.status(400)
        res.send("Invalid seat number, seat number should be between 1-40");
    }
    try {
        let answ = await Ticket.findById(seatNum);
        if (answ.status) {
            res.status(400)
            res.send("Seat already booked");
        }
        else {
            try {
                User.findByIdAndUpdate (userId, {"$push": {"tickets": seatNum}},{ "new": true, "upsert": true }, (err, user) => {
                    answ = helper.addBookingDtls (answ, userId);
                    answ.save()
                    .then(() => {
                        res.status(200)
                        res.send("Ticket booked succesfully");
                    },
                    (err) => {
                        res.status(500)
                        res.send("Oops something went wrong")
                    })  
                })
            }
            catch (err) {
                res.status(500)
                res.send("Oops something went wrong")
            }
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

router.get ('/person-details/:id', async (req, res) => {
    let seatNum = parseInt(req.params.id);
    if (!helper.validateSeatNum(seatNum)) {
        res.status (400);
        res.send ("Invalid seat number, seat number should be between 1-40")
    }
    try {
        let answ = await Ticket.findById(seatNum);
        res.status (200);
        if (!answ.status) {
            res.send ("Ticket is not booked")
        }
        let personDtls = await User.findById (answ.userId);
        res.status (200);
        let returnObj = {
            "emailId": personDtls.emailId,
            "name": personDtls.name,
            "phoneNumber": personDtls.phoneNumber
        }
        res.send (returnObj)
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

router.get ('/reset', async (req, res) => {
    let accessLevel = res.locals.authData.dtl.acc;
    if (accessLevel == 1) {
        res.status(400);
        res.send ("Unauthorized user")
    }
    else {
        Ticket.updateMany ({}, {status:false, userId:null}, (err) => {
            if (err) {
                res.status(500);
                res.send ("Oops something went wrong");
            }
            else {
                User.updateMany ({}, {tickets: []}, (err) => {
                    if (err) {
                        res.status(500);
                        res.send ("Oops something went wrong");
                    } 
                    else {
                        res.status (200);
                        res.send ("Tickets resetted");
                    }
                })
            }
        })
    }
    // else {
    //     try {
    //         let user = await User.findById (userId);
    //         if (!user) {
    //             res.status (400);
    //             res.send ("Not a valid user")
    //         }
    //         if (user.isAdmin) {
    //             Ticket.updateMany ({}, {
    //                 status: false,
    //                 userId: null
    //             }, (err, answ) => {
    //                 if (err) {
    //                     res.status(500);
    //                     res.send ("Oops something went wrong");
    //                 }
    //                 User.deleteMany ({isAdmin: false}, (err, answ) => {
    //                     if (err) {
    //                         res.status(500);
    //                         res.send ("Oops something went wrong");
    //                     }
    //                     res.status (200);
    //                     res.send ("Tickets resetted");
    //                 })
    //             })
    //         }
    //         else {
    //             res.status (400);
    //             res.send ("Sorry only admin can reset the tickets");
    //         }
    //     }
    //     catch (err) {
    //         res.status (500)
    //         res.send ("Oops something went wrong");
    //     }
    // }   
})
module.exports = router;