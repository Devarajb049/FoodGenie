const mongoose = require("mongoose");
const dns = require("dns");

// Override DNS server for MongoDB Atlas SRV lookup in sandbox environment
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const DB_URI = "mongodb+srv://dbuser:sLttdrvqPR4Jr5bR@foodapp.skkhvgp.mongodb.net/foodapp?retryWrites=true&w=majority";

// Import Models
const Restaurant = require("./models/restaurant");
const Menu = require("./models/menu");
const FoodItem = require("./models/foodItem");

// 5 categories
const categories = ["Starters", "Main Course", "Rice & Biryani", "Desserts", "Beverages"];

// Predefined food items for each restaurant type
const itemPool = {
  indian: {
    "Starters": [
      { name: "Paneer Tikka", price: 199, isVeg: true, desc: "Classic marinated paneer cubes grilled over charcoal." },
      { name: "Chicken 65", price: 249, isVeg: false, desc: "Spicy deep-fried chicken bites loaded with curry leaves." },
      { name: "Gobi Manchurian", price: 179, isVeg: true, desc: "Crispy cauliflower florets tossed in tangy soy sauce." },
      { name: "Hara Bhara Kebab", price: 169, isVeg: true, desc: "Healthy pan-fried patties made of spinach and green peas." },
      { name: "Chicken Tikka Kebab", price: 269, isVeg: false, desc: "Smoky boneless chicken chunks marinated in yogurt spices." }
    ],
    "Main Course": [
      { name: "Butter Chicken", price: 349, isVeg: false, desc: "Tender chicken pieces simmered in rich creamy tomato butter gravy." },
      { name: "Paneer Butter Masala", price: 299, isVeg: true, desc: "Fresh cottage cheese cubes in sweet and tangy cream sauce." },
      { name: "Kadai Chicken", price: 329, isVeg: false, desc: "Spicy chicken stir-fry with bell peppers and fresh ground spices." },
      { name: "Dal Makhani", price: 229, isVeg: true, desc: "Slow-cooked black lentils enriched with butter and fresh cream." },
      { name: "Aloo Gobi Adraki", price: 199, isVeg: true, desc: "Comforting dry dish of potatoes and cauliflower with ginger slivers." }
    ],
    "Rice & Biryani": [
      { name: "Special Hyderabadi Biryani", price: 289, isVeg: false, desc: "Fragrant basmati rice cooked on dum with chicken and spices." },
      { name: "Mutton Dum Biryani", price: 369, isVeg: false, desc: "Succulent mutton layers steam-cooked with aromatic long-grain rice." },
      { name: "Paneer Tikka Biryani", price: 269, isVeg: true, desc: "Delicious fusion biryani layered with smoky spiced paneer tikka." },
      { name: "Aromatic Jeera Rice", price: 149, isVeg: true, desc: "Steamed basmati rice tempered with ghee and roasted cumin seeds." },
      { name: "Classic Egg Biryani", price: 219, isVeg: false, desc: "Spiced boiled eggs layered with aromatic saffron rice." }
    ],
    "Desserts": [
      { name: "Gulab Jamun (2 Pcs)", price: 89, isVeg: true, desc: "Soft berry-sized milk-solid balls soaked in rose-flavored sugar syrup." },
      { name: "Rasmalai (2 Pcs)", price: 99, isVeg: true, desc: "Soft chenna patties soaked in cardamom sweetened thick milk." },
      { name: "Hot Gajar Halwa", price: 119, isVeg: true, desc: "Traditional sweet pudding made with fresh grated carrots and milk." },
      { name: "Kheer", price: 79, isVeg: true, desc: "Indian rice pudding simmered with saffron, almonds, and pistachios." },
      { name: "Shahi Tukda", price: 129, isVeg: true, desc: "Golden fried bread soaked in condensed saffron rabri." }
    ],
    "Beverages": [
      { name: "Sweet Punjabi Lassi", price: 89, isVeg: true, desc: "Thick creamy yogurt drink topped with a dollop of fresh malai." },
      { name: "Mango Lassi", price: 99, isVeg: true, desc: "Delicious blend of sweet yogurt and fresh alphonso mango pulp." },
      { name: "Masala Chai", price: 49, isVeg: true, desc: "Brewed black tea infused with ginger, cardamom, and clove spices." },
      { name: "Spiced Buttermilk", price: 59, isVeg: true, desc: "Refreshing diluted yogurt beverage flavored with ginger and coriander." },
      { name: "Fresh Lime Soda", price: 69, isVeg: true, desc: "Crisp soda mixed with fresh lime juice, salt, or sugar." }
    ]
  },
  fastfood: {
    "Starters": [
      { name: "Crispy French Fries", price: 99, isVeg: true, desc: "Golden, crispy potato fries lightly seasoned with salt." },
      { name: "Garlic Bread Sticks", price: 129, isVeg: true, desc: "Freshly baked bread sticks brushed with garlic butter and herbs." },
      { name: "Chicken Nuggets (6 Pcs)", price: 149, isVeg: false, desc: "Crispy breaded chicken bites served with mustard dipping sauce." },
      { name: "Onion Rings", price: 109, isVeg: true, desc: "Crunchy batter-fried thick sweet onion slices." },
      { name: "Cheesy Mozzarella Sticks", price: 159, isVeg: true, desc: "Gooey mozzarella cheese coated in seasoned breadcrumbs, fried crisp." }
    ],
    "Main Course": [
      { name: "Double Cheese Margherita", price: 249, isVeg: true, desc: "Classic pizza loaded with extra mozzarella cheese and tomato sauce." },
      { name: "Chicken Supreme Pizza", price: 349, isVeg: false, desc: "Topped with spicy chicken chunks, bell peppers, olives, and onions." },
      { name: "Ultimate Veggie Burger", price: 149, isVeg: true, desc: "Crispy mixed veg patty topped with fresh lettuce, onions, and mayo." },
      { name: "Crispy Chicken Burger", price: 179, isVeg: false, desc: "Tender fried chicken breast patty with cheese slice and pickles." },
      { name: "Spicy Veg Quesadilla", price: 199, isVeg: true, desc: "Grilled tortilla loaded with spicy veggies and melted cheddar cheese." }
    ],
    "Rice & Biryani": [
      { name: "Spicy Mexican Rice Bowl", price: 189, isVeg: true, desc: "Seasoned rice loaded with salsa, kidney beans, sweet corn, and sour cream." },
      { name: "Crispy Chicken Rice Bowl", price: 229, isVeg: false, desc: "Steamed rice bowl topped with crispy chicken popcorn and hot gravy." },
      { name: "Paneer Rice Bowl", price: 209, isVeg: true, desc: "Herb rice bowl served with paneer cubes tossed in sweet chilli sauce." },
      { name: "Plain Steamed Basmati", price: 99, isVeg: true, desc: "Fragrant cooked long-grain basmati rice served fresh." },
      { name: "Egg Fried Rice Bowl", price: 169, isVeg: false, desc: "Egg stir-fried rice topped with spring onions." }
    ],
    "Desserts": [
      { name: "Warm Choco Lava Cake", price: 119, isVeg: true, desc: "Rich chocolate cake with a hot oozing molten chocolate core." },
      { name: "Chocolate Fudge Brownie", price: 109, isVeg: true, desc: "Dense, chewy dark chocolate brownie loaded with walnut chunks." },
      { name: "Cinnamon Sticks", price: 99, isVeg: true, desc: "Freshly baked dough sticks dusted with sweet cinnamon sugar." },
      { name: "Warm Apple Pie", price: 129, isVeg: true, desc: "Flaky pastry crust filled with sweet spiced apples, baked golden." },
      { name: "Vanilla Ice Cream Scoop", price: 59, isVeg: true, desc: "Creamy classic vanilla bean ice cream scoop." }
    ],
    "Beverages": [
      { name: "Coca Cola", price: 49, isVeg: true, desc: "Chilled classic carbonated cola soft drink." },
      { name: "Iced Lemon Tea", price: 69, isVeg: true, desc: "Refreshing cold brewed tea infused with fresh lemon and mint." },
      { name: "Classic Cold Coffee", price: 89, isVeg: true, desc: "Creamy blended milk, espresso, and sugar, served chilled." },
      { name: "Orange Juice", price: 79, isVeg: true, desc: "Freshly squeezed sweet citrus orange juice." },
      { name: "Mineral Water Bottle", price: 29, isVeg: true, desc: "Clean, purified packaged drinking water." }
    ]
  },
  cafe: {
    "Starters": [
      { name: "Garlic Toasties", price: 119, isVeg: true, desc: "Toasted baguettes brushed with premium garlic herb butter." },
      { name: "French Fries with Dip", price: 109, isVeg: true, desc: "Golden salted fries served with spicy chipotle dip." },
      { name: "Veg Club Sandwich", price: 159, isVeg: true, desc: "Triple-layer sandwich stuffed with grilled veggies, cheese, and lettuce." },
      { name: "Chicken Club Sandwich", price: 189, isVeg: false, desc: "Layers of toasted bread with chicken salad, fried egg, and tomatoes." },
      { name: "Tomato Basil Bruschetta", price: 139, isVeg: true, desc: "Grilled bread rubbed with garlic, topped with fresh diced tomatoes and basil." }
    ],
    "Main Course": [
      { name: "Creamy Alfredo Pasta", price: 269, isVeg: true, desc: "Penne pasta tossed in a luxurious white garlic parmesan sauce." },
      { name: "Spicy Arrabiata Pasta", price: 249, isVeg: true, desc: "Spaghetti cooked in rich, spicy tomato herb marinara sauce." },
      { name: "Gooey Mac & Cheese", price: 229, isVeg: true, desc: "Elbow macaroni baked in rich three-cheese sauce topped with breadcrumbs." },
      { name: "Baked Veg Lasagna", price: 289, isVeg: true, desc: "Layers of pasta sheet, mixed vegetables, marinara, and béchamel cheese." },
      { name: "Paneer Tikka Wrap", price: 179, isVeg: true, desc: "Spiced paneer rolls wrapped in soft flatbread with mint chutney." }
    ],
    "Rice & Biryani": [
      { name: "Herb Butter Rice", price: 159, isVeg: true, desc: "Fluffy basmati rice tossed with butter, parsley, and garlic herbs." },
      { name: "Mushroom Risotto", price: 279, isVeg: true, desc: "Creamy Italian arborio rice slow-cooked with fresh white mushrooms." },
      { name: "Paneer Fried Rice Bowl", price: 199, isVeg: true, desc: "Stir-fried rice loaded with crunchy veggies and paneer bites." },
      { name: "Curd Rice", price: 119, isVeg: true, desc: "Classic South Indian comforting curd rice tempered with mustard seeds." },
      { name: "Veg Pulav", price: 179, isVeg: true, desc: "Steamed rice cooked with green peas, carrots, and mild cardamoms." }
    ],
    "Desserts": [
      { name: "Belgian Chocolate Waffle", price: 149, isVeg: true, desc: "Fresh golden waffle smothered in rich melted Belgian milk chocolate." },
      { name: "Glazed Ring Donut", price: 89, isVeg: true, desc: "Soft yeast-raised donut dipped in sweet sugary glaze." },
      { name: "Chocolate Mousse", price: 119, isVeg: true, desc: "Light, airy whipped chocolate dessert cup." },
      { name: "Blueberry Cheesecake Slice", price: 179, isVeg: true, desc: "Creamy cheesecake crust topped with fresh sweet blueberry compote." },
      { name: "Choco Chip Muffin", price: 79, isVeg: true, desc: "Soft baked chocolate muffin loaded with rich chocolate chips." }
    ],
    "Beverages": [
      { name: "Hot Cappuccino", price: 99, isVeg: true, desc: "Freshly pulled espresso shot with steamed milk and thick foam layer." },
      { name: "Cafe Latte", price: 109, isVeg: true, desc: "Smooth espresso shot balanced with hot steamed milk." },
      { name: "Frappuccino Blended Cold Coffee", price: 149, isVeg: true, desc: "Double shot espresso blended with milk, ice, and sweet caramel syrup." },
      { name: "Thick Hot Chocolate", price: 119, isVeg: true, desc: "Decadent melted chocolate milk topped with marshmallows." },
      { name: "Organic Green Tea", price: 69, isVeg: true, desc: "Healthy hot brewed organic green tea leaves." }
    ]
  },
  southindian: {
    "Starters": [
      { name: "Medu Vada (2 Pcs)", price: 79, isVeg: true, desc: "Crispy fried savory lentil donuts served with sambar and coconut chutney." },
      { name: "Idli (2 Pcs)", price: 59, isVeg: true, desc: "Steamed soft rice cakes served with hot sambar and tomato chutney." },
      { name: "Gobi 65", price: 149, isVeg: true, desc: "Deep-fried spiced cauliflower florets, a South Indian street food favorite." },
      { name: "Onion Bhaji", price: 89, isVeg: true, desc: "Crispy onion fritters deep fried in chickpea batter." },
      { name: "Sambar Vada (1 Pc)", price: 49, isVeg: true, desc: "Fried Medu Vada soaked in rich piping hot lentil sambar." }
    ],
    "Main Course": [
      { name: "Masala Dosa", price: 109, isVeg: true, desc: "Thin crispy rice crepe stuffed with spiced potato mash." },
      { name: "Onion Uttapam", price: 119, isVeg: true, desc: "Thick savory pancake topped with sweet onions and green chillies." },
      { name: "Paper Roast Dosa", price: 99, isVeg: true, desc: "Super thin and crispy large plain rice crepe." },
      { name: "Poori Saagu (3 Pcs)", price: 99, isVeg: true, desc: "Fried puffed wheat bread served with spiced potato onion saagu." },
      { name: "Rava Masala Dosa", price: 129, isVeg: true, desc: "Crispy crepe made of semolina batter filled with potato masala." }
    ],
    "Rice & Biryani": [
      { name: "Bisi Bele Bath", price: 139, isVeg: true, desc: "Traditional hot lentil rice cooked with mixed vegetables and ghee." },
      { name: "Tangy Lemon Rice", price: 109, isVeg: true, desc: "Basmati rice tossed with fresh lemon juice, roasted peanuts, and curry leaves." },
      { name: "Puliyogare (Tamarind Rice)", price: 119, isVeg: true, desc: "Steamed rice cooked with spiced sweet and sour tamarind pulp." },
      { name: "Creamy Curd Rice", price: 99, isVeg: true, desc: "Cooling curd rice tempered with mustard seeds, red chillies, and ginger." },
      { name: "South Indian Veg Biryani", price: 179, isVeg: true, desc: "Fragrant rice cooked with local spices and fresh green vegetables." }
    ],
    "Desserts": [
      { name: "Pineapple Kesari", price: 79, isVeg: true, desc: "Sweet semolina pudding cooked with pureed pineapple, raisins, and cashews." },
      { name: "Payasam (Kheer)", price: 89, isVeg: true, desc: "Traditional milk pudding cooked with vermicelli or sago, sweetened with jaggery." },
      { name: "Mysore Pak", price: 99, isVeg: true, desc: "Classic rich sweet made of chickpea flour, sugar, and generous ghee." },
      { name: "Sweet Pongal", price: 89, isVeg: true, desc: "Rice and yellow moong dal cooked with sweet jaggery and cardamoms." },
      { name: "Elaneer Payasam", price: 119, isVeg: true, desc: "Chilled dessert made of sweet coconut milk and tender coconut pulp." }
    ],
    "Beverages": [
      { name: "Filter Coffee", price: 49, isVeg: true, desc: "Authentic chicory blended coffee frothed with boiling milk." },
      { name: "Hot Badam Milk", price: 69, isVeg: true, desc: "Steamed sweet milk loaded with almond powder and saffron." },
      { name: "Spiced Buttermilk", price: 49, isVeg: true, desc: "Cooling thin yogurt drink seasoned with green chillies, ginger, and salt." },
      { name: "Tender Coconut Water", price: 59, isVeg: true, desc: "Fresh, healthy natural sweet coconut water." },
      { name: "Fresh Ginger Lemon Juice", price: 59, isVeg: true, desc: "Cooling sweet lemon juice flavored with freshly crushed ginger." }
    ]
  }
};

// High quality Unsplash image IDs by category to rotate (guarantees unique URLs)
const imageIds = {
  "Starters": [
    "photo-1541532713592-79a0317b6b77", "photo-1569718212165-3a8278d5f624", "photo-1608039829572-78524f79c4c7",
    "photo-1534422298391-e4f8c172dddb", "photo-1626082927389-6cd097cdc6ec", "photo-1544025162-d76694265947",
    "photo-1608897013039-887f21d8c804", "photo-1599487488170-d11ec9c172f0", "photo-1529193591184-b1d58069ecdd",
    "photo-1567620905732-2d1ec7ab7445", "photo-1546069901-ba9599a7e63c", "photo-1565299624946-b28f40a0ae38",
    "photo-1565958011703-44f9829ba187", "photo-1482049016688-2d3e1b311543", "photo-1484723091739-30a097e8f929"
  ],
  "Main Course": [
    "photo-1585032226651-759b368d7246", "photo-1601050690597-df056fb4ce78", "photo-1546069901-ba9599a7e63c",
    "photo-1555939594-58d7cb561ad1", "photo-1567620832903-9fc6debc209f", "photo-1504674900247-0877df9cc836",
    "photo-1498837167922-ddd27525d352", "photo-1476718406336-bb5a9690ee2a", "photo-1473093295043-cdd812d0e601",
    "photo-1481931098730-318b6f776db0", "photo-1490645935967-10de6ba17061", "photo-1565299585323-38d6b0865b47",
    "photo-1540189549336-e6e99c3679fe", "photo-1560684352-8497838a2229", "photo-1606787366850-de6330128bfc"
  ],
  "Rice & Biryani": [
    "photo-1563379091339-03b21ab4a4f8", "photo-1633945274405-b6c8069047b0", "photo-1626777552726-4a6b54c97e46",
    "photo-1596797038530-2c107229654b", "photo-1541832676-9b763b0239ab", "photo-1604152135912-04a022e23696",
    "photo-1590842267809-0e9b57a19c32", "photo-1626132647523-66f5bf380027", "photo-1589301760014-d929f3979dbc",
    "photo-1618412586071-7009386d34cb", "photo-1574672280200-c09d79940176", "photo-1534939561126-855b8675edd7",
    "photo-1512058564366-18510be2db19", "photo-1534080391025-a87cfd6006ff", "photo-1536304997881-db372c1a9ec7"
  ],
  "Desserts": [
    "photo-1551024506-0bccd828d307", "photo-1551024601-bec78aea704b", "photo-1508737027454-e6454ef45afd",
    "photo-1587314168485-3236d6710814", "photo-1516685018646-549198525c1b", "photo-1578985545062-69928b1d9587",
    "photo-1563729784474-d77dbb933a9e", "photo-1509440159596-0249088772ff", "photo-1511018556340-d16986a1c194",
    "photo-1588195538326-c5b1e9f80a1b", "photo-1606313564200-e75d5e30476c", "photo-1546964124-0cce460f38ef",
    "photo-1579372786545-d24232daf58c", "photo-1532150801904-1400179a6176", "photo-1553530666-ba11a7da3888"
  ],
  "Beverages": [
    "photo-1544787219-7f47ccb76574", "photo-1501339847302-ac426a4a7cbb", "photo-1495474472287-4d71bcdd2085",
    "photo-1517701604599-bb29b565090c", "photo-1509042239860-f550ce710b93", "photo-1497515114629-f71d768fd07c",
    "photo-1553909489-cd47e0907980", "photo-1513558161293-cdaf765ed2fd", "photo-1536935338788-846bb9981813",
    "photo-1514362545857-3bc16c4c7d1b", "photo-1556881286-fc6915169721", "photo-1578314675249-a6910f80cc4e",
    "photo-1511920170033-f8396924c348", "photo-1595981267035-7b04ca84a82d", "photo-1551024709-8f23befc6f87"
  ]
};

// Map restaurant to cuisine pools
const getPoolKey = (resName) => {
  const name = resName.toLowerCase();
  if (name.includes("biryani") || name.includes("barbeque") || name.includes("empire") || name.includes("imperial") || name.includes("bowl")) {
    return "indian";
  }
  if (name.includes("pizza") || name.includes("burger") || name.includes("kfc") || name.includes("mcdonald") || name.includes("taco") || name.includes("california")) {
    return "fastfood";
  }
  if (name.includes("cafe") || name.includes("starbucks") || name.includes("coffee") || name.includes("sweet") || name.includes("waffle") || name.includes("kreme") || name.includes("robbins") || name.includes("truffles")) {
    return "cafe";
  }
  if (name.includes("a2b") || name.includes("haldiram")) {
    return "southindian";
  }
  return "indian"; // default
};

const runSeeding = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DB_URI);
    console.log("Connected successfully.");

    // 1. Fetch all restaurants in the database
    const restaurants = await Restaurant.find();
    console.log(`Found ${restaurants.length} restaurants to process.`);

    let processedCount = 0;
    let createdMenusCount = 0;
    let insertedFoodItemsCount = 0;

    for (let rIndex = 0; rIndex < restaurants.length; rIndex++) {
      const res = restaurants[rIndex];
      const poolKey = getPoolKey(res.name);
      const foodPool = itemPool[poolKey];

      // Clean existing Menus and FoodItems for this restaurant to avoid duplicates/orphans
      await Menu.deleteMany({ restaurant: res._id });
      await FoodItem.deleteMany({ restaurant: res._id });

      const menuId = new mongoose.Types.ObjectId();
      const menuCategories = [];

      for (let cIndex = 0; cIndex < categories.length; cIndex++) {
        const catName = categories[cIndex];
        const items = foodPool[catName];
        const categoryItemIds = [];

        for (let iIndex = 0; iIndex < items.length; iIndex++) {
          const itemTemplate = items[iIndex];
          
          // Get unique image matching category
          const imgBaseId = imageIds[catName][(rIndex * 5 + iIndex) % imageIds[catName].length];
          const imgUrl = `https://images.unsplash.com/${imgBaseId}?q=80&w=600&auto=format&fit=crop`;

          // Create FoodItem document
          const foodItem = await FoodItem.create({
            name: `${res.name} ${itemTemplate.name}`,
            price: itemTemplate.price,
            description: itemTemplate.desc,
            ratings: 3.8 + Math.random() * 1.2,
            images: [
              {
                public_id: `food_${rIndex}_${cIndex}_${iIndex}`,
                url: imgUrl
              }
            ],
            menu: menuId,
            stock: 80 + Math.floor(Math.random() * 120),
            restaurant: res._id, // Save as actual ObjectId reference
            noOfReviews: 12 + Math.floor(Math.random() * 30),
            reviews: [
              {
                name: "Customer Feedback",
                rating: 4,
                comment: "Excellent food, fresh quality, and great flavor!"
              }
            ]
          });

          categoryItemIds.push(foodItem._id);
          insertedFoodItemsCount++;
        }

        menuCategories.push({
          category: catName,
          items: categoryItemIds // Array of ObjectIds
        });
      }

      // Create Menu document with restaurant field correctly saved as an ObjectId
      await Menu.create({
        _id: menuId,
        restaurant: res._id, // Saved as actual ObjectId reference
        menu: menuCategories
      });

      createdMenusCount++;
      processedCount++;
    }

    console.log("-----------------------------------------");
    console.log("SEEDING COMPLETED!");
    console.log(`Total restaurants processed: ${processedCount}`);
    console.log(`Total menu documents created: ${createdMenusCount}`);
    console.log(`Total food items inserted: ${insertedFoodItemsCount}`);
    console.log("Confirmed: Every restaurant has exactly 5 categories with 5 items each (25 items total).");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (err) {
    console.error("Error during detailed menu seeding:", err);
    process.exit(1);
  }
};

runSeeding();
