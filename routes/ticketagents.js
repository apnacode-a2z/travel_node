var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
const nodemailer = require('nodemailer');
const models = require('../models');
var bcrypt = require('bcrypt');
var passport = require('passport');
var fs = require('fs');
var path = require('path');
var pdf = require ('pdfkit');
var ejs = require('ejs');
const saltRounds = 10;
var ejs = require("ejs");
var hogan = require('hogan.js');

//sign_in of pre_sales agent
router.get('/sign_in', (req, res, next) => {
    res.render('ticketagent_login');
});

// router.post('./ticketagent_login',(req,res,next){

// })

//for sales dashboard 
router.get('/ticketagent', (req, res, next) => {
    if(req.isAuthenticated()){
        res.render('ticketagent',{layout:'ticketagent_layout.ejs'});
    }
    else{
        res.send('unauthorized')
    }

}); //end


//to show data of the customer who is approved
router.get('/ticketagent_leads', function(req,res) {
    if(req.isAuthenticated()){
    models.Lead.findAll({       
        // limit:1,
        where: {
            approved_quote: true
             },
             order: [ [ 'createdAt', 'DESC' ]],
             hierarchy: true,
             raw: true
    }).then(todos => {
            // console.log("customer todo",todos);
            res.render('ticketagent_leads',{todos:todos,layout:'ticketagent_layout.ejs'})
        })
    }
    else{
        res.send('unauthorized')
    }
});



//pre sales agent login checking
router.post('/ticketagent_login', function (req, res) {
    // console.log(req.body);
    models.Ticketagent.findOne({
      where: {
          email: req.body.email
             },
             raw: true
            }).then(function (user) {
                console.log("user is",user)
                if (!user) {
                    res.redirect('./sign_in');
                } else {
                var admin_user = user.id;

                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    console.log("admin user",admin_user)
                    console.log("admin user result", result);
                if (result == true) {
                    req.login(admin_user, function(err){
                    res.redirect('./ticketagent');
                    });
                } else {
                //  res.send('Incorrect password');
                res.redirect('./sign_in');
                }
            });
         }
     })
    }); 
    //end





    //mailing function with generating e ticket
    router.get('/send_mail/:id', function(req,res) {
        // console.log(req.user);
        if(req.isAuthenticated()){ 
            models.Lead.findAll({       
                limit:1,
                where: {
                id: req.params.id
                    },
                    hierarchy: true,
                    raw: true
            }).then(todos => {
                console.log(todos, "itsme");
                console.log("submitted");
                // var showtemplate = fs.readFileSync('./views/email.ejs', 'utf-8');
                // var compiledtemplate =hogan.compile(showtemplate);
                var compiled = ejs.compile(fs.readFileSync('./views/email.ejs', 'utf8'));
                var html2 = compiled({ todos:todos});
               
                let transporter = nodemailer.createTransport({
                    service: 'Gmail',
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
                    to: `${todos[0].email}`, // list of receivers
                    subject: 'Journey Details', // Subject line
                    // text: 'Hello world?', // plain text body
                    html:html2,
                    text: 'Thank you for requesting the quote,click below link to download your E-ticket.',
                    attachments: [
                        {   
                            // filename: 'airindia.png',
                            path:'./public/images/airindia.png',
                            cid: 'logo1'
                        },
                        {   
                            // filename: 'goflyfirst-logo.png',
                            path:'./public/images/goflyfirst-logo.png',
                            cid: 'logo'
                        }
                    ]
    
                };
                
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // res.render('newpage',{/leadsmsg:'email details sended'});
                    
                });
                res.redirect('../ticketagent_leads'); 
                // fs.unlinkSync(filepath);
                
            })
            
            
        }
        else{
            res.send('unauthorized')
        }
    });




module.exports = router;