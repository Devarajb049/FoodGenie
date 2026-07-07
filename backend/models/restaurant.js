const mongoose = require("mongoose");
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Restaurant Name"],
        trim: true,
        maxlength: [100, "Restaurant Name Cannot exceed 100 characters"]
    },
    isVeg: {
        type: Boolean,
        default: false
    },

    address: {
        type: String,
        required: [true, "Enter address of Restaurant"]
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },

        }
    ],

    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

restaurantSchema.index({ location: "2dsphere" })
restaurantSchema.index({ address: "text" })
module.exports = mongoose.model("Restaurant", restaurantSchema);
