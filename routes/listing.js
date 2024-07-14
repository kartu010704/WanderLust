const express = require("express");
const router = express.Router();

// Importing necessary modules and middleware
const wrapAsync = require("../util/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../util/ExpressError.js");


//middleware for login aahe ki nahi manun
const { isLoggedIn, isOwner, validationListing } = require("../middleware.js")
const ListingController = require("../controllers/listing.js");



//for  upload file data
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

router.route('/')
    .get(wrapAsync(ListingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validationListing,
        wrapAsync(ListingController.createListing)
    )


// NewRoute
router.get("/new", isLoggedIn, ListingController.rendernewForm);


//Show + Update + Delete Route
router.route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing))



// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = router;
