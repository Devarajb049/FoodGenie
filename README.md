# 🍔 Food Genie - Premium AI-Powered Food Delivery Application

Welcome to **Food Genie**, a full-stack premium food delivery application featuring an interactive user experience and powerful AI integrations to supercharge content generation and reviews analysis.

---

## 🚀 Key Features

- **🍔 Interactive Restaurant Directory**: Browse a curated list of popular restaurants, complete with reviews, ratings, and a pure-vegetarian filter.
- **🪄 Food Genie AI Hub**:
  - **AI Description Generator**: Instantly generate SEO keywords, taste profiles, short descriptions, and engaging long descriptions for any dish.
  - **AI Review Sentiment Analyzer**: Understand customer sentiment with real feedback analysis, including positive/neutral/negative distribution, highlights, concerns, and suggestions.
- **🛒 Persistent Auth & Cart Session**: Maintain login state and cart items across page reloads.
- **💳 Payment Integration**: Ready-to-go stripe/payment interfaces and clean checkout flows.
- **✨ Premium Dark UI Redesign**: Beautiful glassmorphic design systems built with high-fidelity color palettes, Outfit typography, and sleek animations.

---

## 📸 Application Screenshots

### 🏠 Homepage - Popular Restaurants
Browse local restaurants, check ratings, and filter for dietary preferences.
![Homepage](documentation/screenshots/homepage.png)

### 📊 Food Genie AI Hub
Use advanced AI to generate description copy and analyze sentiment on reviews.
![AI Hub Dashboard](documentation/screenshots/ai_dashboard.png)

### 🔐 User Authentication (Sign In & Sign Up)
Secure login and registration with interactive input feedback.

| Sign In | Sign Up |
|---|---|
| ![Login](documentation/screenshots/login.png) | ![Register](documentation/screenshots/register.png) |

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React (Vite)
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Custom CSS and Bootstrap
- **Icons & Fonts**: Font Awesome, Material Symbols, Outfit Google Font
- **Routing**: React Router DOM

### Backend
- **Framework**: Node.js & Express
- **Database**: MongoDB & Mongoose
- **File Upload**: Cloudinary & Express File Upload
- **Authentication**: JWT & BcryptJS
- **Mailing**: Nodemailer

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Devarajb049/FoodGenie.git
   cd FoodGenie
   ```

2. **Configure Environment Variables**:
   Configure `.env` files in both the frontend and backend directories following the `.env.example` templates.

3. **Install Dependencies & Start the Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Install Dependencies & Start the Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

5. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in your web browser.
