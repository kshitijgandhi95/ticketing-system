const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ticketRoutes = require('./routes/routes');
const bodyParser = require('body-parser');
const helper = require('./utility/helper');
const User = require('./models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const saltRounds = process.env.SALT || 10
const secretKey = process.env.SECRETKEY || "secretKey"
mongoose.set('useFindAndModify', false)

app.use(bodyParser.json());

app.use('/api', ticketRoutes);


app.post('/signup', (req, res) => {
    //get username and password
    let userDetails = req.body.userDetails;
    let emailId = userDetails.emailId;
    let password = userDetails.password;
    let name = userDetails.name;
    if (!helper.validateUserDetails(userDetails)) {
        res.status(400)
        res.send("Invalid user details, user details must contain phone number, email id and name");
    }
    bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
        if (err) {
            res.status(500);
            res.send("Oops something went wrong")
        }
        const user = helper.createUser(emailId, name, hashedPassword);
        user.save()
            .then(() => {
                res.status(200)
                res.send("Succesfully Registered");
            },
                (err) => {
                    res.status(500)
                    res.send("Oops something went wrong");
                })
    });
});

app.post('/login', async (req, res) => {
    let emailId = req.body.emailId;
    let password = req.body.password;
    try {
        let answ = await User.find({ emailId: emailId });
        if (!answ.length) {
            res.status(400);
            res.send(`No user with emailId ${emailId}`);
        }
        let user = answ[0];
        let hashedPassword = user.password;
        bcrypt.compare(password, hashedPassword, function (err, result) {
            if (err) {
                res.status(500);
                res.send("Oops something went wrong")
            }
            else if (!result) {
                res.status(400);
                res.send("Wrong password")
            }
            else {
                let accessLevel = user.isAdmin ? 0:1
                let payload = {
                    dtl: {
                        id : user["_id"],
                        acc: accessLevel
                    }
                }            
                jwt.sign({ payload }, secretKey, (err, token) => {
                    if (err) {
                        res.status(500)
                        res.send ("Oops something went wrong")
                    }
                    else {
                        res.json({
                            token
                        });
                    }
                });
            }
        });

    }
    catch (err) {
        res.status(500);
        res.send("Oops something went wrong")
    }

});

app.listen(3000);

mongoose.connect('mongodb://localhost/ticketSys',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) {
            console.log(`Error while connecting to mongoDb  ${err}`);
        }
        console.log("Connected to MongoDb ")
    })

module.exports = app
