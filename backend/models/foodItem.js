const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your foodItem name"],
        trim: true,
        maxLength: [100, "Food name cannot exceed 100 characters"]
    },

    price: {
        type: Number,
        required: [true, "Enter your food price"],
        maxLength: [5, "Price cannot exceed 5 digits"],
        default: 0.0
    },

    description: {
        type: String,
        required: [true, "Enter your food description"],
    },

    ratings: {
        type: Number,
        default: 0
    },

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
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu"
    },
    stock: {
        type: Number,
        required: [true, "Enter your foodItem Stock"],
        maxLength: [5, "Stock cannot exceed 5 digits"],
        default: 0
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
    noOfReviews: {
        type: Number,
        default: 0
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
    createdAt: {
        type: Date,
        default: Date.now()
    }

});

const food = mongoose.model("FoodItem", foodSchema);
module.exports = food;