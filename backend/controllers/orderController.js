const Order = require("../models/order");
const FoodItem = require("../models/foodItem");
const Cart = require("../models/cartModel");
const { ObjectId } = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");

//setting up config file
dotenv.config({ path: "./config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { session_id, deliveryInfo: clientDeliveryInfo, upi_transaction_id } = req.body;

  let deliveryInfo;
  let paymentInfo;
  let deliveryCharge = 55;
  let itemsPrice = 0;
  let finalTotal = 0;
  let orderItems = [];
  let restaurantId;

  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: "items.foodItem",
      select: "name price images",
    })
    .populate({
      path: "restaurant",
      select: "name",
    });

  if (!cart) {
    return next(new ErrorHandler("Cart is empty or not found", 400));
  }
  restaurantId = cart.restaurant?._id;

  orderItems = cart.items.map((item) => ({
    name: item.foodItem.name,
    quantity: item.quantity,
    image: item.foodItem.images[0]?.url || "",
    price: item.foodItem.price,
    fooditem: item.foodItem._id,
  }));

  itemsPrice = cart.items.reduce((acc, item) => acc + (item.foodItem?.price || 0) * item.quantity, 0);
  const gst = parseFloat((itemsPrice * 0.05).toFixed(2));
  deliveryCharge = itemsPrice > 0 ? 55 : 0;
  finalTotal = itemsPrice + deliveryCharge + gst;

  // Check if it's a Stripe session or direct UPI payment
  if (session_id && session_id.startsWith("cs_")) {
    // Stripe checkout session flow
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer"],
    });

    deliveryInfo = {
      address:
        session.shipping_details.address.line1 +
        (session.shipping_details.address.line2 ? " " + session.shipping_details.address.line2 : ""),
      city: session.shipping_details.address.city,
      phoneNo: session.customer_details.phone || "N/A",
      postalCode: session.shipping_details.address.postal_code,
      country: session.shipping_details.address.country,
    };

    paymentInfo = {
      id: session.payment_intent || session.id,
      status: session.payment_status,
    };

    deliveryCharge = +session.shipping_cost?.amount_subtotal / 100 || 55;
    itemsPrice = +session.amount_subtotal / 100 || itemsPrice;
    finalTotal = +session.amount_total / 100 || finalTotal;
  } else {
    // UPI or Custom manual checkout flow
    if (!clientDeliveryInfo) {
      return next(new ErrorHandler("Delivery information is required for UPI checkout", 400));
    }
    deliveryInfo = {
      address: clientDeliveryInfo.address,
      city: clientDeliveryInfo.city,
      phoneNo: clientDeliveryInfo.phoneNo,
      postalCode: clientDeliveryInfo.postalCode,
      country: clientDeliveryInfo.country || "IN",
    };

    paymentInfo = {
      id: upi_transaction_id || `upi_txn_${Date.now()}`,
      status: "paid",
    };
  }

  const order = await Order.create({
    orderItems,
    deliveryInfo,
    paymentInfo,
    deliveryCharge,
    itemsPrice,
    taxPrice: gst,
    finalTotal,
    user: req.user.id,
    restaurant: restaurantId,
    paidAt: Date.now(),
  });

  console.log(order);

  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});

// Get single order   =>   /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // Get the user ID from req.user
  const userId = new ObjectId(req.user.id);
  // Find orders for the specific user using the retrieved user ID
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.finalTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
