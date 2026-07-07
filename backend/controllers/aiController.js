const catchAsync = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Helper function to call Groq API
const callGroq = async (prompt, systemPrompt) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "NOT_SET") {
    return null; // Fallback to mock
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.warn("Groq API responded with error status:", response.status);
      return null;
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Error calling Groq API:", error.message);
    return null;
  }
};

// 1. Generate Description Endpoint
exports.generateDescription = catchAsync(async (req, res, next) => {
  const { name, cuisine, ingredients } = req.body;

  if (!name) {
    return next(new ErrorHandler("Food name is required", 400));
  }

  const systemPrompt = `You are a culinary AI copywriter. Generate a JSON response with the exact keys: "shortDescription", "longDescription", "seoText", "tasteProfile", "servingSuggestion". All values should be strings. Format response as JSON.`;
  const prompt = `Food Name: "${name}". Cuisine: "${cuisine || "Global"}". Ingredients: "${ingredients || "Standard fresh ingredients"}".`;

  let result = await callGroq(prompt, systemPrompt);

  if (!result) {
    // Premium Mock Fallback
    console.log("Using Mock AI Description Generator Fallback...");
    result = {
      shortDescription: `A delicious, chef-crafted signature preparation of ${name} style of cooking.`,
      longDescription: `Indulge in our premium ${name}. Made with authentic techniques and hand-picked fresh ingredients, this recipe highlights the true heritage flavors of ${cuisine || "Global"} cuisine. Every bite is designed to give you an unforgettable dining experience.`,
      seoText: `order ${name} online, buy ${name} nearby, best ${cuisine || "Global"} food delivery`,
      tasteProfile: `A perfect harmony of aromatic spices, savory textures, and mild heat.`,
      servingSuggestion: `Best served piping hot with our signature condiments and side salad.`
    };
  }

  res.status(200).json({
    success: true,
    data: result
  });
});

// 2. Analyze Reviews Endpoint
exports.analyzeReviews = catchAsync(async (req, res, next) => {
  const { reviews } = req.body;

  if (!reviews || !Array.isArray(reviews)) {
    return next(new ErrorHandler("Reviews array is required", 400));
  }

  const reviewsText = reviews.map(r => `[Rating: ${r.rating || r.ratingSum}] Comment: ${r.comment}`).join("\n");
  const systemPrompt = `You are an expert hospitality data analyst. Analyze reviews list and return JSON with exact keys: "overallSentiment", "positivePercent", "negativePercent", "neutralPercent", "mostMentionedDishes" (array of strings), "commonComplaints" (array of strings), "commonPraises" (array of strings), "customerSatisfactionScore" (number from 1 to 5), "summary", "suggestions" (array of strings).`;

  let result = await callGroq(reviewsText, systemPrompt);

  if (!result) {
    // Premium Mock Fallback
    console.log("Using Mock AI Review Analyzer Fallback...");
    const totalReviews = reviews.length || 10;
    const ratingSum = reviews.reduce((sum, r) => sum + (r.rating || 4), 0);
    const avgRating = parseFloat((ratingSum / totalReviews).toFixed(1));

    // Generate simple breakdown percentages
    let pos = Math.round((reviews.filter(r => (r.rating || 4) >= 4).length / totalReviews) * 100);
    let neg = Math.round((reviews.filter(r => (r.rating || 4) <= 2).length / totalReviews) * 100);
    let neu = 100 - pos - neg;
    if (pos === 0 && neg === 0) { pos = 80; neg = 10; neu = 10; }

    result = {
      overallSentiment: avgRating >= 4 ? "Highly Positive" : avgRating >= 3 ? "Neutral/Mixed" : "Mainly Negative",
      positivePercent: pos,
      negativePercent: neg,
      neutralPercent: neu,
      mostMentionedDishes: ["Dum Biryani", "Alfredo Pasta", "Signature Garlic Bread"],
      commonComplaints: ["Slightly high delivery fees", "Slight delays during rainy weather weekends"],
      commonPraises: ["Incredible spice blend and aroma", "Generous meat portions", "Tender paneer quality"],
      customerSatisfactionScore: avgRating,
      summary: `Customers generally praise this establishment, noting high marks for taste and flavor consistency. Minor complaints focus mostly on outer packaging robustness and busy peak-hour delivery wait times.`,
      suggestions: [
        "Upgrade to leak-proof container boxes.",
        "Add mild spice customization slider choices."
      ]
    };
  }

  res.status(200).json({
    success: true,
    data: result
  });
});

// 3. Chatbot Conversation Endpoint
exports.chatbot = catchAsync(async (req, res, next) => {
  const { message, history } = req.body;

  if (!message) {
    return next(new ErrorHandler("Message is required", 400));
  }

  const systemPrompt = `You are FoodGenie AI, a friendly food assistant chatbot. Help users select foods, menus, track cart/orders, recommend food options. Keep responses concise, friendly, and formatted nicely in Markdown.`;

  // Format history messages
  const messages = [
    { role: "system", content: systemPrompt }
  ];
  if (history && Array.isArray(history)) {
    history.forEach(h => {
      messages.push({ role: h.sender === "user" ? "user" : "assistant", content: h.text });
    });
  }
  messages.push({ role: "user", content: message });

  const apiKey = process.env.GROQ_API_KEY;
  let replyText = "";

  if (apiKey && apiKey !== "NOT_SET" && !apiKey.includes("your_groq_api_key")) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const data = await response.json();
        replyText = data.choices[0].message.content;
      }
    } catch (e) {
      console.error("Chatbot Groq failed:", e.message);
    }
  }

  if (!replyText) {
    // Premium Mock Chatbot response
    const msg = message.toLowerCase();
    if (msg.includes("recommend") || msg.includes("suggest") || msg.includes("best")) {
      replyText = `### 🌟 FoodGenie Recommendations for You!
Based on what customers love right now, I highly suggest:
1. **Hyderabadi Dum Biryani** - Fragrant basmati rice layered with rich marinated spices.
2. **Royal Cheese Burger** - Juicy double cheese layers, fresh lettuce, and hand-cut fries.
3. **Chocolate Lava Cake** - Rich dark chocolate pudding cake with a warm oozing molten center.

Would you like me to guide you to any specific restaurant?`;
    } else if (msg.includes("spicy") || msg.includes("hot")) {
      replyText = `### 🌶️ Feeling Adventurous?
Try these spicy hot best-sellers:
* **Chicken 65** (Indian Starter)
* **Spicy Mexican Rice Bowl** (Fast Food Special)
* **Chicken Supreme Pizza** with extra jalapenos!

Keep a cold beverage handy!`;
    } else if (msg.includes("healthy") || msg.includes("veg") || msg.includes("salad")) {
      replyText = `### 🥗 Fresh & Healthy Choices
Here are some delicious and nutritious options:
* **Paneer Tikka** - Spiced grilled paneer cubes.
* **Veggie Garden Salad** - Tossed fresh garden herbs with olive oil.
* **Organic Green Tea** or **Spiced Buttermilk** to refresh!`;
    } else {
      replyText = `Hello! I'm your **FoodGenie Assistant** 🧞‍♂️. 

I can help you browse cuisines, find the best restaurants, suggest spicy or healthy recommendations, or choose desserts!

How can I help satisfy your cravings today?`;
    }
  }

  res.status(200).json({
    success: true,
    reply: replyText
  });
});
