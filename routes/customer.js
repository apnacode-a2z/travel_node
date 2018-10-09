var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
const nodemailer = require('nodemailer');
const models = require('../models');
var bcrypt = require('bcrypt');
var passport = require('passport');
const saltRounds = 10;

// router.get('/sign_up', (req, res, next) => {
//     res.render('customer',{layout:'customer_layout.ejs'});
// });
router.get('/sign_in', (req, res, next) => {
    res.render('customer_login');
});

router.get('/sign_up', (req, res, next) => {
    res.render('customer_signup');
});


router.post('/customer_signup', function (req, res) {
    console.log(req.body.email);
bcrypt.hash(req.body.password, saltRounds, function (err,   hash) {
    models.Customer.create({
        UserName: req.body.UserName,
        email: req.body.email,
        password: hash
    }).then(function() {
        console.log("saved");
        res.render('customer_login');
});
});
});//end

router.get('/customer', (req, res, next) => {
    if(req.isAuthenticated()){
        res.render('customer',{layout:'customer_layout.ejs'});   
    }
    else{
        res.send('unauthorized')
    }
}); //end


router.get('/approved_lead/:id', function(req,res) {
    if(req.isAuthenticated()){
        models.Lead.update(
            {
            approved_quote: true,
            hierarchy: true,
            raw: true
            },
            {returning: true, where: {id: req.params.id} }) 
            
            .then(todos => {
                console.log("approved todo",todos);
                res.redirect('../customer_leads'); 
            
        });
    }
    else{
        res.send('unauthorized')
    }
});



router.get('/view_lead/:id', function(req,res) {
    if(req.isAuthenticated()){
        models.Lead.findAll(
            {
                where: {
                    id: req.params.id
                       },
                       hierarchy: true,
                       raw: true
            
                    }).then(todos => {
                console.log("vview todo",todos);
                res.render('customer_view',{todos:todos,layout:'customer_layout.ejs'})

        });
    }
    else{
        res.send('unauthorized')
    }
});



router.post('/customer_login', function (req, res) {
    // console.log(req.body);
    models.Customer.findOne({
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
                    console.log("sample pasword",user.password);
                    console.log("sample2 pasword",req.body.password)
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    console.log("admin user",admin_user)
                    console.log("admin user result", result);
                if (result == true) {
                    req.login(admin_user, function(err){
                        console.log("sucessfully")
                    res.redirect('./customer'); 
                    });
                } else {
                //  res.send('Incorrect password');
                res.redirect('./sign_in');
                }
            });
         }
     })
    }); 


    router.get('/customer_leads', function(req, res, next) {
            if(req.isAuthenticated()){
                models.Customer.findOne({
                    where: {
                        id: req.user
                           },
                           raw: true
                          }).then(function (customer) {
                              console.log("print user",customer)
                            models.Lead.findAll({
                                where:{
                                email: customer.email
                                }
                            }).then(todos => {
                                // console.log("apna todos",todos)
                                res.render('customer_leads',{todos:todos,layout:'customer_layout.ejs'})
                            });
                          })
               
                }
            else{
                    res.send('unauthorized')
                }
    });

module.exports = router;