const http = require("http");

const testPost = (path, body, callback) => {
  const postData = JSON.stringify(body);
  const options = {
    hostname: "localhost",
    port: 8080,
    path: `/api/v1/ai${path}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      callback(res.statusCode, JSON.parse(data));
    });
  });

  req.on("error", (e) => {
    console.error(`Problem with request to ${path}:`, e.message);
  });

  req.write(postData);
  req.end();
};

// 1. Test Description Generator
testPost("/generate-description", {
  name: "Butter Chicken",
  cuisine: "Indian",
  ingredients: "chicken, cream, tomato, butter, spices"
}, (status, json) => {
  console.log("=== Generate Description Test ===");
  console.log("Status Code:", status);
  console.log("Response data keys:", Object.keys(json.data));
  console.log("Short Description:", json.data.shortDescription);
  console.log("---------------------------------\n");

  // 2. Test Review Analyzer
  testPost("/analyze-reviews", {
    reviews: [
      { rating: 5, comment: "Amazing butter chicken, so sweet and creamy!" },
      { rating: 4, comment: "Taste is awesome, but took 45 minutes to deliver." },
      { rating: 2, comment: "Way too sweet for me, did not enjoy the packaging." }
    ]
  }, (status2, json2) => {
    console.log("=== Analyze Reviews Test ===");
    console.log("Status Code:", status2);
    console.log("Response data keys:", Object.keys(json2.data));
    console.log("Sentiment:", json2.data.overallSentiment);
    console.log("Positive %:", json2.data.positivePercent);
    console.log("Suggestions:", json2.data.suggestions);
    console.log("---------------------------------\n");

    // 3. Test Chatbot
    testPost("/chatbot", {
      message: "Suggest me some spicy foods",
      history: []
    }, (status3, json3) => {
      console.log("=== Chatbot Test ===");
      console.log("Status Code:", status3);
      console.log("Reply length:", json3.reply.length);
      console.log("Reply Preview:\n", json3.reply.substring(0, 300));
      console.log("---------------------------------\n");
    });
  });
});
