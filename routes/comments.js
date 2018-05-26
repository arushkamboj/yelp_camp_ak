var express    = require("express"),
    router     = express.Router(),
    middleware = require("../middleware"),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment");

//COMMENTS NEW
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn,function(req, res){
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
      } else{
        res.render("comments/new", {campground: campground}) ;    
      }
   });
});

//Comments Create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err)
           res.redirect("/campgrounds");
       } else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               }else{
                   comment.author.id = req.user.id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success", "Successfully added a comment.");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
});

//Comment Edit Route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.render("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Comment Update Route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//Comment Delete Route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;