const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv/config');

const nodemailer = require('nodemailer');
const { query } = require('@angular/animations');

const app = express();
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    var emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

    switch(emailRegex.test(req.query.userEmail)) {
        case false:
            res.status(200).json({ mess: 'Your email is invalid' });

            return;
        case '':
            res.status(200).json({ mess: 'Please enter your email' });

            return;
    }

    switch(req.query.userName) {
        case '':
            res.status(200).json({ mess: 'Please enter your name' });

            return;
    }

    if(req.query.userName.length < 3) {
        res.status(200).json({ mess: 'Your name have to be at least 3 characters long' });

        return;
    }

    switch(req.query.userCountry) {
        case 'country':
            res.status(200).json({ mess: 'Please choose your country' });

            return;
    }

    const userEmail = req.query.userEmail;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS
        }
    });
    
    var mailOptions = {
        from: process.env.AUTH_USER,
        to: userEmail,
        subject: 'Email from dynamic form'
    };
    mailOptions.html = `<p>Your name: <b>${req.query.userName}</b></p><br><p>Your email: <b>${req.query.userEmail}</b></p><br><p>Your contry: <b>${req.query.userCountry}</b></p>`;
    
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        } else {
            res.status(200).json({ mess: 'mail sent' })
            console.log('Email sent:' + info.response);
        }
    })

    // res.status(200).json({ mess: 'mail sent' })
})

const port = process.env.PORT || 5000;
// const hostname = '199.188.204.226';
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});