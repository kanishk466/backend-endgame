var express = require('express');
var router = express.Router();

const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/profile",isLoggedIn, async function(req,res){
 
  res.render('profile' );
})


// Create user object
router.post("/register", function(req,res){
  var userdata = new userModel({  // Initialize userModel
    username : req.body.username,

      email:req.body.email
  })

  // Register user with hashed password
  userModel.register(userdata,req.body.password)  // Register user
   .then(function(registereduser){ // On successful registration
    passport.authenticate("local")(req,res,function(){ // Authenticate user
      res.redirect('/profile') // Redirect to profile
    })
   })
})


router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){})


// Logout user
router.get("/logout",function(req, res, next) {
   // Handle logout errors
   req.logout(function(err) {
       if(err) {
           // Return error if present
           return next(err);
       }
       // Redirect to homepage after logout
       res.redirect('/');
   })
})


function isLoggedIn(req,res,next){
  // If user is authenticated
  if(req.isAuthenticated()){
    // Move to the next middleware
    return next();
  }
  // Otherwise, redirect to home page
  res.redirect('/');
}


module.exports = router;
