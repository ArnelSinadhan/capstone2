const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
require("dotenv").config();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS options
const corsOptions = {
  origin: [
    "https://capstone3-wine.vercel.app",
    "https://capstone3-git-master-arnels-projects-6434d9a7.vercel.app",
    "https://capstone3-hyysdear4-arnels-projects-6434d9a7.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// connecting to mongodb atlas
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);
// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));
// User routes
app.use("/b4/users", userRoutes);
// Product routes
app.use("/b4/products", productRoutes);
// Cart routes
app.use("/b4/carts", cartRoutes);
// Order routes
app.use("/b4/orders", orderRoutes);

// Start the server
const port = process.env.PORT;
app.listen(port, () => console.log(`API is now available on port ${port}`));
