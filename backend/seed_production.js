const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");

// Override DNS server for MongoDB Atlas SRV lookup in sandbox environment
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const DB_URI = "mongodb+srv://dbuser:sLttdrvqPR4Jr5bR@foodapp.skkhvgp.mongodb.net/foodapp?retryWrites=true&w=majority";

// Import Models
const Restaurant = require("./models/restaurant");
const Menu = require("./models/menu");
const FoodItem = require("./models/foodItem");
const User = require("./models/user");
const Order = require("./models/order");
const Cart = require("./models/cartModel");

// Data lists
const restaurantNames = [
  { name: "Meghana's Biryani", cuisine: ["Indian", "South Indian"], isVeg: false, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop" },
  { name: "Paradise Biryani", cuisine: ["Indian", "North Indian"], isVeg: false, img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600&auto=format&fit=crop" },
  { name: "Truffles", cuisine: ["Burgers", "Cafe", "Desserts"], isVeg: false, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" },
  { name: "Empire Restaurant", cuisine: ["Indian", "Chinese"], isVeg: false, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop" },
  { name: "KFC", cuisine: ["Fast Food", "Burgers"], isVeg: false, img: "https://images.unsplash.com/photo-1513639776629-7b61b0ac598e?q=80&w=600&auto=format&fit=crop" },
  { name: "Burger King", cuisine: ["Fast Food", "Burgers"], isVeg: false, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" },
  { name: "Pizza Hut", cuisine: ["Pizza", "Fast Food"], isVeg: false, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop" },
  { name: "Domino's", cuisine: ["Pizza", "Fast Food"], isVeg: false, img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=600&auto=format&fit=crop" },
  { name: "McDonald's", cuisine: ["Burgers", "Fast Food"], isVeg: false, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop" },
  { name: "Barbeque Nation", cuisine: ["Indian", "North Indian"], isVeg: false, img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop" },
  { name: "Dindigul Thalappakatti", cuisine: ["Indian", "South Indian"], isVeg: false, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600&auto=format&fit=crop" },
  { name: "Haldiram's", cuisine: ["Indian", "Desserts", "South Indian"], isVeg: true, img: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop" },
  { name: "Mani's Dum Biryani", cuisine: ["Indian", "South Indian"], isVeg: false, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop" },
  { name: "Imperial Restaurant", cuisine: ["Indian", "Chinese"], isVeg: false, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop" },
  { name: "A2B (Adyar Ananda Bhavan)", cuisine: ["South Indian", "Desserts"], isVeg: true, img: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop" },
  { name: "Starbucks", cuisine: ["Cafe", "Beverages"], isVeg: true, img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop" },
  { name: "Cafe Coffee Day", cuisine: ["Cafe", "Beverages"], isVeg: true, img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop" },
  { name: "Anand Sweets", cuisine: ["Desserts", "Indian"], isVeg: true, img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=600&auto=format&fit=crop" },
  { name: "Bowl Company", cuisine: ["Indian", "Chinese", "Italian"], isVeg: false, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" },
  { name: "Behrouz Biryani", cuisine: ["Indian", "North Indian"], isVeg: false, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop" },
  { name: "California Burrito", cuisine: ["Fast Food", "Cafe"], isVeg: false, img: "https://images.unsplash.com/photo-1562059390-a761a0847685?q=80&w=600&auto=format&fit=crop" },
  { name: "Taco Bell", cuisine: ["Fast Food", "Pizza"], isVeg: false, img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop" },
  { name: "The Belgian Waffle Co.", cuisine: ["Desserts", "Bakery"], isVeg: true, img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=600&auto=format&fit=crop" },
  { name: "Krispy Kreme", cuisine: ["Bakery", "Desserts"], isVeg: true, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop" },
  { name: "Baskin Robbins", cuisine: ["Desserts", "Juice Shop"], isVeg: true, img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop" },
];

const foodSamples = [
  { name: "Paneer Tikka", price: 199, description: "Spiced paneer cubes grilled to golden perfection with onions and bell peppers.", isVeg: true, category: "Starters", img: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop" },
  { name: "Crispy Spring Rolls", price: 149, description: "Golden fried rolls stuffed with seasoned minced vegetables.", isVeg: true, category: "Starters", img: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop" },
  { name: "Butter Chicken", price: 349, description: "Classic Indian dish made with tender chicken cooked in a rich, creamy tomato gravy.", isVeg: false, category: "Main Course", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop" },
  { name: "Paneer Butter Masala", price: 299, description: "Soft paneer cubes simmered in a luscious tomato-butter cream sauce.", isVeg: true, category: "Main Course", img: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop" },
  { name: "Hyderabadi Dum Biryani", price: 249, description: "Fragrant basmati rice layered with spiced vegetables or chicken, cooked on dum.", isVeg: false, category: "Rice & Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop" },
  { name: "Royal Cheese Burger", price: 189, description: "Juicy burger loaded with double cheese layers, fresh lettuce, and tomatoes.", isVeg: false, category: "Burgers", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" },
  { name: "Classic Margherita Pizza", price: 279, description: "Traditional pizza topped with fresh tomato sauce, mozzarella cheese, and basil.", isVeg: true, category: "Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop" },
  { name: "Creamy Alfredo Pasta", price: 249, description: "Penne pasta tossed in a rich, creamy garlic parmesan sauce.", isVeg: true, category: "Pasta", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=600&auto=format&fit=crop" },
  { name: "Veg Fried Rice", price: 169, description: "Stir-fried rice loaded with crunchy fresh garden vegetables and seasoning.", isVeg: true, category: "Chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop" },
  { name: "Chocolate Lava Cake", price: 129, description: "Warm chocolate cake with a molten chocolate center, served fresh.", isVeg: true, category: "Desserts", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=600&auto=format&fit=crop" },
  { name: "Fresh Mojito", price: 99, description: "Refreshing drink made with fresh lime juice, mint leaves, and soda.", isVeg: true, category: "Beverages", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop" },
];

const reviewerNames = [
  "Aarav", "Ananya", "Rohan", "Priya", "Rahul", "Neha", "Arjun", "Sneha", 
  "Vikram", "Kavya", "Sanjay", "Riya", "Aditya", "Ishita", "Rohit", "Pooja", 
  "Karan", "Divya", "Meera", "Amit", "Shreya", "Kunal", "Tanya", "Nikhil", "Preeti"
];

const reviewComments = [
  "Absolutely delicious! The flavors are amazing.",
  "Very tasty but a bit too spicy for me.",
  "Excellent presentation and fresh quality.",
  "Loved the service and food, highly recommend!",
  "Average experience overall. Portion size could be better.",
  "One of the best meals I've had in a long time.",
  "Food arrived a bit cold, but the taste was decent.",
  "Amazing taste and quick delivery!",
  "Loved the quality of ingredients used.",
  "Value for money and great taste."
];

// Helper to get random item
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seed = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(DB_URI);
    console.log("Connected successfully!");

    // Clear old collections
    console.log("Deleting old data...");
    await Restaurant.deleteMany();
    await Menu.deleteMany();
    await FoodItem.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    console.log("Old data deleted successfully.");

    // 1. Seed 100 Users
    console.log("Seeding 100 Users...");
    const users = [];
    const passwordHash = await bcrypt.hash("password123", 12);
    
    // Make first user a custom fixed one for easy testing
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@orderit.com",
      password: "password123",
      passwordConfirm: "password123",
      phoneNumber: "9876543210",
      role: "admin",
      avatar: { public_id: "avatar_id", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150" }
    });
    users.push(adminUser);

    for (let i = 1; i < 100; i++) {
      const email = `user${i}@orderit.com`;
      const phoneSuffix = i.toString().padStart(3, "0");
      const user = await User.create({
        name: `Customer ${i}`,
        email: email,
        password: "password123",
        passwordConfirm: "password123",
        phoneNumber: `9876540${phoneSuffix}`,
        role: "user",
        avatar: { public_id: `avatar_${i}`, url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150` }
      });
      users.push(user);
    }
    console.log(`Seeded ${users.length} Users successfully.`);

    // 2. Seed 25 Restaurants
    console.log("Seeding 25 Restaurants...");
    const seededRestaurants = [];
    
    // We will hardcode one restaurant ID as 66717b16e1a78e67dc8c8df3 to match user requirements
    const targetRestaurantId = new mongoose.Types.ObjectId("66717b16e1a78e67dc8c8df3");

    for (let i = 0; i < restaurantNames.length; i++) {
      const resData = restaurantNames[i];
      const reviews = [];
      const numReviews = 50 + Math.floor(Math.random() * 50); // 50-100 reviews
      let ratingSum = 0;

      for (let j = 0; j < numReviews; j++) {
        const rating = 3 + Math.floor(Math.random() * 3); // 3, 4, 5
        ratingSum += rating;
        reviews.push({
          name: getRandom(reviewerNames) + ` ${j}`,
          rating: rating,
          comment: `${resData.name} was ${getRandom(reviewComments)}`
        });
      }
      
      const ratings = parseFloat((ratingSum / numReviews).toFixed(1));

      const isTarget = i === 0; // Make the first one have the target ID

      const restaurant = await Restaurant.create({
        _id: isTarget ? targetRestaurantId : new mongoose.Types.ObjectId(),
        name: resData.name,
        isVeg: resData.isVeg,
        address: `${100 + i}, Koramangala Outer Ring Road, Bangalore, Karnataka`,
        ratings: ratings,
        numOfReviews: numReviews,
        location: {
          type: "Point",
          coordinates: [77.5946 + (Math.random() - 0.5) * 0.1, 12.9716 + (Math.random() - 0.5) * 0.1]
        },
        reviews: reviews,
        images: [
          {
            public_id: `restaurant_img_${i}`,
            url: resData.img
          }
        ]
      });

      seededRestaurants.push(restaurant);
    }
    console.log(`Seeded ${seededRestaurants.length} Restaurants.`);

    // 3. Seed Menus & FoodItems
    console.log("Seeding Menus & FoodItems (min 1 to 5 items per restaurant)...");
    
    for (const restaurant of seededRestaurants) {
      // Pick 1 to 5 food items randomly to represent the menu
      const numItems = 2 + Math.floor(Math.random() * 4); // 2 to 5 items
      const selectedSamples = [];
      const usedNames = new Set();

      while (selectedSamples.length < numItems) {
        const sample = getRandom(foodSamples);
        if (!usedNames.has(sample.name)) {
          selectedSamples.push(sample);
          usedNames.add(sample.name);
        }
      }

      // Group into categories
      const categoryMap = {};
      const createdFoodItemIds = [];

      // Generate a Menu ID beforehand
      const menuId = new mongoose.Types.ObjectId();

      for (const sample of selectedSamples) {
        // Create FoodItem document
        const foodItem = await FoodItem.create({
          name: sample.name,
          price: sample.price,
          description: sample.description,
          ratings: 3.5 + Math.random() * 1.5,
          images: [
            {
              public_id: `food_img_${Math.floor(Math.random() * 1000)}`,
              url: sample.img
            }
          ],
          menu: menuId,
          stock: 50 + Math.floor(Math.random() * 150),
          restaurant: restaurant._id,
          noOfReviews: 10 + Math.floor(Math.random() * 40),
          reviews: [
            {
              name: getRandom(reviewerNames),
              rating: 4,
              comment: "Really tasted amazing, fresh quality."
            }
          ]
        });

        createdFoodItemIds.push(foodItem._id);

        if (!categoryMap[sample.category]) {
          categoryMap[sample.category] = [];
        }
        categoryMap[sample.category].push(foodItem._id);
      }

      // Format menu categories array
      const menuCategories = Object.keys(categoryMap).map((catName) => ({
        category: catName,
        items: categoryMap[catName], // Correct array of ObjectIds
      }));

      // Create Menu document with restaurant field saved as actual ObjectId
      await Menu.create({
        _id: menuId,
        restaurant: restaurant._id, // Actual ObjectId
        menu: menuCategories
      });
    }
    console.log("Seeded Menus & FoodItems successfully.");

    // 4. Seed Carts (40 carts)
    console.log("Seeding 40 Carts...");
    for (let i = 0; i < 40; i++) {
      const user = users[i + 1]; // pick distinct users
      const restaurant = getRandom(seededRestaurants);
      // Find fooditems for this restaurant
      const foodItems = await FoodItem.find({ restaurant: restaurant._id });
      if (foodItems.length > 0) {
        const cartItems = [{
          foodItem: foodItems[0]._id,
          quantity: 1 + Math.floor(Math.random() * 2)
        }];
        if (foodItems.length > 1 && Math.random() > 0.5) {
          cartItems.push({
            foodItem: foodItems[1]._id,
            quantity: 1
          });
        }

        await Cart.create({
          user: user._id,
          restaurant: restaurant._id,
          items: cartItems
        });
      }
    }
    console.log("Seeded 40 Carts.");

    // 5. Seed Orders (150 completed orders)
    console.log("Seeding 150 Orders...");
    for (let i = 0; i < 150; i++) {
      const user = getRandom(users);
      const restaurant = getRandom(seededRestaurants);
      const foodItems = await FoodItem.find({ restaurant: restaurant._id });

      if (foodItems.length > 0) {
        const itemsCount = 1 + Math.floor(Math.random() * 2);
        const orderItems = [];
        let subtotal = 0;

        for (let j = 0; j < Math.min(itemsCount, foodItems.length); j++) {
          const item = foodItems[j];
          const qty = 1 + Math.floor(Math.random() * 2);
          subtotal += item.price * qty;
          orderItems.push({
            name: item.name,
            quantity: qty,
            image: item.images[0].url,
            price: item.price,
            fooditem: item._id
          });
        }

        const deliveryCharge = 30;
        const taxPrice = parseFloat((subtotal * 0.05).toFixed(2));
        const finalTotal = subtotal + deliveryCharge + taxPrice;

        // Bypassing the pre-save hook that checks stock to avoid triggering insufficient stock exceptions in the seeder
        const order = new Order({
          deliveryInfo: {
            address: `${12 + i}, Koramangala 5th Block`,
            city: "Bangalore",
            phoneNo: "9876543210",
            postalCode: "560095",
            country: "India"
          },
          restaurant: restaurant._id,
          user: user._id,
          orderItems: orderItems,
          paymentInfo: {
            id: `pay_id_${Math.floor(Math.random() * 1000000)}`,
            status: "Succeeded"
          },
          paidAt: new Date(),
          itemsPrice: subtotal,
          taxPrice: taxPrice,
          deliveryCharge: deliveryCharge,
          finalTotal: finalTotal,
          orderStatus: "Delivered",
          deliveredAt: new Date(),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // within last 30 days
        });

        // Use mongoose's save bypassing hooks if needed, but wait: pre-save reduces stock.
        // Let's call save on the order. Since stock was set high (50-200), reduction is safe!
        await order.save();
      }
    }
    console.log("Seeded 150 Orders successfully.");

    console.log("DATABASES FULLY SEEDED!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
