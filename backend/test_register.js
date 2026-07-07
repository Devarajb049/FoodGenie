const http = require("http");

const postData = JSON.stringify({
  name: "John Doe",
  email: `johndoe_${Date.now()}@example.com`,
  password: "password123",
  passwordConfirm: "password123",
  phoneNumber: "9876543210",
  avatar: {
    public_id: "avatar_123",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
  }
});

const options = {
  hostname: "localhost",
  port: 8080,
  path: "/api/v1/users/signup",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  let data = "";
  console.log("Registration API Status Code:", res.statusCode);
  
  res.on("data", (chunk) => {
    data += chunk;
  });
  
  res.on("end", () => {
    console.log("Raw response:", data);
  });
});

req.on("error", (e) => {
  console.error("Problem with request:", e.message);
});

req.write(postData);
req.end();
