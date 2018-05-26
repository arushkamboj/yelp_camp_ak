var express    = require("express"),
    router     = express.Router(),
    middleware = require("../middleware");

var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            req.flash("error", "Oops! This is not something we expeted. Pleaes try again later.");
        }else{
           res.render("campgrounds/index", {campgrounds:allCampgrounds}); 
        }
    });    
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //Save the new campground to the DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "Something went wrong! Cannot create campground.");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - more info about one campground
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});     
        }
    });
});

//Campground Edit and Update
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           req.flash("error", "Error! Campground not found.");
       } else{
           res.render("campgrounds/edit", {campground: foundCampground});
       }
   });
});

//update route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//Destroy Campground Route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else{
           req.flash("success", "You have successfully removed a campground from the database.");
           res.redirect("/campgrounds");
       }
    });
});

module.exports = router;