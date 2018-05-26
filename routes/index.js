var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//SCHEMA SETUP
router.get("/", function(req, res){
   res.render("landing");
});

//Register Form Route
router.get("/register", function(req, res) {
   res.render("register"); 
});

//Register Logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
      if(err){
          return res.render("register", {error: err.message});
      } 
      passport.authenticate("local")(req, res, function(){
         req.flash("info", "Hey " + user.username + "! Welcome! Congratulations on your first login. Have fun camping...");
         res.redirect("/campgrounds"); 
      });
   });
});

//LOGIN Form Route
router.get("/login", function(req, res){
    res.render("login");
});

//Logic logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: "Invalid username or password",
        successFlash: "Welcome back"
    }), function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have successfully logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;