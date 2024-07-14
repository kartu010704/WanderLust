//design Schema only
const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
       url:String,
       filename:String
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }

    }







});


//for this validation case : if listings is delete  them--> reviews also be deleted that purpose validation include....

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        // Delete all reviews associated with the deleted listing
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
