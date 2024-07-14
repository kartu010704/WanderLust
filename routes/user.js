const express=require("express");
const passport = require("passport");
const router=express.Router();
const User=require("../models/user.js");
const Listing = require("../models/listing.js");

const { savedRedirectUrl } = require("../middleware.js");



router.route("/signup")
.get((req,res)=>{
    res.render("users/signup.ejs");
})
.post(async(req,res)=>{

    try{
        let {username, email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password)
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
        req.flash("success","Welcome to Wanderlust !");
        res.redirect("/listings");
        })
        
    }
    catch(err)
    {
        req.flash("error",err.message);
        res.redirect("/signup");
    }

})


router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(
    savedRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    
    }),
    async(req,res)=>{
        req.flash("success","Welcome back to Wanderlust !");
    
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
    )




router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    })
})


// router.route("/showsearch").post((req,res)=>{

//       // Use the name attribute of the input field

//     // Log the value to the console
//     console.log(req);
  
   



router.route('/showsearch')
.get(async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery;
        let listings = await Listing.find({ location: searchQuery })
            .populate('owner')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            });

        // Check if listings were found
        if (listings.length === 0) {
            req.flash('error', 'No listings found for the specified location');
            return res.redirect('/listings');
        }

        // Pass the data to the template
        res.render('users/showsearch', { allListings: listings, searchQuery });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Internal Server Error. Please try again later.');
        res.redirect('/listings');
    }
});


module.exports=router;
