var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
const nodemailer = require('nodemailer');
const models = require('../models');
var bcrypt = require('bcrypt');
var passport = require('passport');
const saltRounds = 10;




//sign_in of pre_sales agent
router.get('/sign_in', (req, res, next) => {
    res.render('sales_login');
});


router.get('/manage_profile', (req, res, next) => {
    res.render('message',{layout:'sales_layout.ejs'});
});
router.get('/change_password', (req, res, next) => {
    res.render('message',{layout:'sales_layout.ejs'});
});

router.put('/lead/:id',(req, res, next) => {
    
});

//this is for signout
router.get('/sign_out', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('./sign_in');
 });//end


//for sales dashboard 
router.get('/sales', (req, res, next) => {
    if(req.isAuthenticated()){
        res.render('sales',{layout:'sales_layout.ejs'});
        
    }
    else{
        res.send('unauthorized')
    }

}); //end
        


router.get('/sales_leads', function(req, res, next) {
    console.log("sample",req.user);
        if(req.isAuthenticated()){
            models.Lead.findAll({
               include:[{
                   model:models.PreSalesAgent,
                   where:{
                    id :req.user
                   }
               }]
            }).then(todos => {
                res.render('sales_leads',{todos:todos,layout:'sales_layout.ejs'})
            });
            }
        else{
                res.send('unauthorized')
            }
});



 
//pre sales agent login checking
router.post('/sales_login', function (req, res) {
    // console.log(req.body);
    models.PreSalesAgent.findOne({
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
                    res.redirect('./sales');
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



// router.post('/send_lead/:id', function(req,res) {
//     models.Lead.update(
//         {
//         send_quote: true,
//         },
//         {returning: true, where: {id: req.params.id} }) 
//         .then(todos => {
//         console.log(" updated todos",todos);
        
//     });
// });//





//for sending mail through presalesagent
router.get('/send_lead/:id', function(req,res) {
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
            models.Lead.update(
                {
                send_quote: true,
                hierarchy: true,
                raw: true
                },
                {returning: true, where: {id: req.params.id} }) 
                
                .then(todos => {
                console.log(" updated todos",todos);
                
            });
            console.log("submitted");
            const output = `
            <p> Thank you for Connecting Goflyfirst,  </p>
            <p> Here is Your Quote information. </p>
            <h3> Contact Details </h3>
            <ul>
                <li> From:  ${todos[0].from} </li>
                <li> To:  ${todos[0].to}</li>
                <li> Depart: ${todos[0].depart} </li>
                <li> Return: ${todos[0].dreturn} </li>
                <li> Passengers: ${todos[0].passengers}</li>
                <li> Full Name: ${todos[0].fullname}</li>
                <li> Email: ${todos[0].email}</li>
                Thank you for requesting the quote,click below link to track your details
                <button><a href = "https://node-express-goflyfirst.herokuapp.com/customer/sign_in"> sign_in </a></button>
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
                to: `${todos[0].email}`, // list of receivers
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
                // res.render('newpage',{/leadsmsg:'email details sended'});
                
            });
            res.redirect('../sales_leads'); 
            // // res.redirect('/views/');
            // res.render('sales_leads',{todos:todos,layout:'sales_layout.ejs'})
        })
        
        
    }
    else{
        res.send('unauthorized')
    }
});

module.exports = router;