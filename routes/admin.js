var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();
var expressValidator = require('express-validator');
const nodemailer = require('nodemailer');
const models = require('../models');
var bcrypt = require('bcrypt');
var passport = require('passport');
var dateFormat = require('dateformat');
const saltRounds = 10;

//register: storing name, email and password and redirecting to home page after signup
   router.post('/create', function (req, res) {
   bcrypt.hash('GoFlyFirst&27', saltRounds, function (err,   hash) {
       models.admin.create({
           email: 'admin2@goflyfirst.com',
           password: hash
       }).then(function() {
           console.log("saved");
           res.send("details saved")
   });
   });
   });//end

   router.post('/create_sales_agent', function (req, res) {
   	console.log(req.body.email);
   bcrypt.hash('GoFlyFirst&27', saltRounds, function (err,   hash) {
       models.PreSalesAgent.create({
       	   Name: req.body.Name,
           email: req.body.email,
           password: hash
       }).then(function() {
           console.log("saved");
           res.send("Sales agent details saved")
   });
   });
   });//end


   router.post('/create_ticket_agent', function (req, res) {
    console.log(req.body.email);
    bcrypt.hash('GoFlyFirst&27', saltRounds, function (err,   hash) {
        models.Ticketagent.create({
            userName: req.body.userName,
            email: req.body.email,
            password: hash
        }).then(function() {
            console.log("saved");
            res.send("Ticket agent details saved")
        });
        });
    });//end



//this is for admin sign in page rendering
   router.get('/sign_in', (req, res, next) => {
       res.render('login');
   });//end

 

//this is for signout
   router.get('/sign_out', (req, res, next) => {
       req.logout();
       req.session.destroy();
       res.clearCookie('connect.sid');
       res.redirect('./sign_in');
    });//end


  // this is for after successfully login  
   router.get('/dashboard', (req, res, next) => {
       console.log(req.user);
       console.log(req.isAuthenticated());
       res.render('dashboard',{layout:'layout_admin.ejs'});
   });//end



// to show all data from database
router.get('/edit_records', (req, res, next) => {
    console.log(req.user);
    if(req.isAuthenticated()){
    models.Lead.findAll({
        hierarchy: true,
        raw: true
    }).then(todos => {
        res.render('edit_records',{todos:todos,layout:'layout_admin.ejs'})
    });
    }
    else{
        res.send('unauthorized')
    }
});//

// //to delete
router.get('/delete_lead/:id', function(req,res) {
    // console.log(req.params,"sample")
    if(req.isAuthenticated()){
    models.Lead.findOne({
      where: {
          id: req.params.id
             },
            }).then(function (lead) {
                // console.log("Lead is deleted")
                    lead.destroy({ truncate : true, cascade: false });
                    // res.redirect('back');
                res.redirect('../edit_records');  
                // return res.back(); 
            });
        }
        else{
            res.send('unauthorized')
        }
            // res.redirect('../edit_records');
            
});
//end




router.get('/edit_lead/:id', function(req,res) {
    // console.log(req.user);
    if(req.isAuthenticated()){
    models.Lead.findAll({
        include: [ {model: models.PreSalesAgent, required: true, attributes: ['Name']} ] ,       
        limit:1,
        where: {
          id: req.params.id
             },
             order: [ [ 'createdAt', 'DESC' ]],
             hierarchy: true,
             raw: true
    }).then(todos => {
        models.PreSalesAgent.findAll({
            hierarchy: true,
            raw: true
        }).then(todoss => {
            var data = {
                Lead:todos,
                PreSalesAgent:todoss
            }
            // console.log(data);
            res.render('edit_lead',{data:data,layout:'layout_admin.ejs', date_format: dateFormat})
        })
    });
    }
    else{
        res.send('unauthorized')
    }
});





// //to edit and put
router.post('/lead_updation/:id', function(req,res) {
    console.log("req body",req.body);
    models.Lead.update(
       {
        PreSalesAgent_id:req.body.PreSalesAgent_id,
        from: req.body.from,
        to: req.body.to,
        depart: req.body.depart,
        dreturn: req.body.dreturn,
        passengers: req.body.passengers,
        fullname: req.body.fullname,
        email: req.body.email,
       },
       {returning: true, where: {id: req.params.id} })
       .then(todos => {
                console.log("todos",todos);
                res.redirect('../leads');
            });  
});
//end

 //edit records  from database
router.get('/leads', function(req, res, next) {
    console.log(req.user);
    if(req.isAuthenticated()){
    models.Lead.findAll({
        include: [ {model: models.PreSalesAgent, required: true, attributes: ['Name']} ],    	
        hierarchy: true,
        raw: true
    }).then(todos => {
        console.log("todos",todos);
        res.render('leads',{leads:todos,layout:'layout_admin.ejs'})
    });
    }
    else{
        res.send('unauthorized')
    }
});


//admin lead creation
   router.get('/admin_lead_creation', (req, res, next) => {
    if(req.isAuthenticated()){
        res.render('admin_lead_creation',{layout:'layout_admin.ejs'});
    }
    else{
        res.send('unauthorized')
    }
    });//end


        router.post('/admin_lead_creation', (req, res, next) => {
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
                    // res.render('newpage',{/leadsmsg:'email details sended'});
                    
                });
                
                // res.redirect('/views/');
                res.render('dashboard',{layout:'layout_admin.ejs'});
            })
        });
        


  // for admin login creation path is localhost:5000/admmin/sign_in 
   router.post('/login', function (req, res) {
       // console.log(req.body);
       models.admin.findOne({
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
                       res.redirect('./dashboard');
                   	});
                   } else {
                   //  res.send('Incorrect password');
                   res.redirect('./sign_in');
                   }
               });
            }
        });

        });//end 




// this is for validation of user 
passport.serializeUser(function(admin_user, done) {
   done(null,admin_user);
});
passport.deserializeUser(function(admin_user, done) {
   done(null, admin_user);
});//end









module.exports = router;
