const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const categoryRoutes = require ('./routes/categoryRoutes.js');

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://qube-job-solution.vercel.app", "http://localhost:5173"],
  }),
);
app.use(express.json());

// API Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/categories', categoryRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Failed:", err));

// Basic Test Route
app.get("/", (req, res) => {
  res.send("Qube Job Solution Backend API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
