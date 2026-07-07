const http = require("http");

const url = "http://localhost:8080/api/v1/eats/stores/66717b16e1a78e67dc8c8df3/menus";

http.get(url, (res) => {
  let data = "";
  console.log("Status Code:", res.statusCode);
  
  res.on("data", (chunk) => {
    data += chunk;
  });
  
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      console.log("API Response count:", json.count);
      console.log("Categories in first menu document:");
      if (json.data && json.data.length > 0) {
        json.data[0].menu.forEach((cat) => {
          console.log(`- Category: "${cat.category}" containing ${cat.items.length} items`);
        });
      } else {
        console.log("No menu found in data array!");
      }
    } catch (e) {
      console.log("Error parsing JSON:", e.message);
      console.log("Raw response:", data.substring(0, 500));
    }
  });
}).on("error", (err) => {
  console.log("Error:", err.message);
});
