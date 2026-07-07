const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const Restaurant = require("../models/restaurant");

// Get all restaurants
exports.getAllRestaurants = catchAsyncErrors(async (req, res, next) => {

    const apiFeatures = new APIFeatures(
        Restaurant.find(),
        req.query
    ).search().sort();

    const restaurants = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: restaurants.length,
        restaurants
    });

});

// Get restaurant by ID
exports.getRestaurant = catchAsyncErrors(async (req, res, next) => {

    const restaurant = await Restaurant.findById(req.params.storeId);

    if (!restaurant) {
        return next(new ErrorHandler("Restaurant not found with this ID", 404));
    }

    res.status(200).json({
        success: true,
        restaurant
    });

});

//update

exports.createRestaurant = catchAsyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
        status: "success",
        data: restaurant,
    });
});

exports.deleteRestaurant = catchAsyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

    if (!restaurant)
        return next(new ErrorHandler("No document found with that ID", 404));

    res.status(204).json({
        status: "success",
    });
});
