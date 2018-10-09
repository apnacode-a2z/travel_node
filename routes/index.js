var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const models = require('../models');

 
// to create a form link to /todo/new
router.get('/', function(req, res, next) {
    res.render('newpage');
    // next();
});


 









router.post('/', (req, res, next) => {
    models.Lead.create({
        from: req.body.from,
        to: req.body.to,
        depart: req.body.depart,
        dreturn: req.body.dreturn,
        passengers: req.body.passengers,
        fullname: req.body.fullname,
        email: req.body.email,
        PreSalesAgent_id: 1
    }).then(function(){
        console.log("submitted");
        const output = `
        <p> Thank you for Connecting Goflyfirst, <br /> 
            Here is Your Quote information. </p>
        <h4> Contact Details </h4>
        <ul>
            <li> From:  ${req.body.from} </li>
            <li> To:  ${req.body.to}</li>
            <li> Depart: ${req.body.depart} </li>
            <li> Return: ${req.body.dreturn} </li>
            <li> Passengers: ${req.body.passengers}</li>
            <li> Full Name: ${req.body.fullname}</li>
            <li> Email: ${req.body.email}</li>
        <p>Thank you...!</p>
        </ul>`
        
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            // host: 'localhost',
            // port: 25,
            // secure: false, // true for 465, false for other ports
            auth: {
                user: 'tripthi31@gmail.com', // generated ethereal user
                pass: 'malathimurali' // generated ethereal password
            },
            tls:{
                rejectUnauthorized: false
               
            },
            // debug: true
        });
        
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'tripthi31@gmail.com', // sender address
            to: `${req.body.email}`, // list of receivers
            subject: 'Journey Details', // Subject line
            // text: 'Hello world?', // plain text body
            html: output // html body
        };
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            // res.render('newpage',{msg:'email details sended'});
            
        });
        
        // res.redirect('/views/');
        res.render('newpage');
    })
});


module.exports = router;
