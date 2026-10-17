const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { SitemapStream, streamToPromise } = require("sitemap");
require("dotenv").config();

const Post = require("./models/Post");
const Category = require("./models/Category");

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const categoryRoutes = require ('./routes/categoryRoutes.js');

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://qube-job-solution.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);
app.use(express.json());

// 🚀 Dynamic Auto Sitemap Route
app.get("/sitemap.xml", async (req, res) => {
  try {
    res.header("Content-Type", "application/xml");

    const smStream = new SitemapStream({
      hostname: "https://qube-job-solution.vercel.app",
    });

    // 1. Static Pages
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    smStream.write({ url: "/contact", changefreq: "monthly", priority: 0.5 });

    // 2. Database Categories
    const categories = await Category.find({}, "slug");
    categories.forEach((cat) => {
      smStream.write({
        url: `/category/${cat.slug}`,
        changefreq: "daily",
        priority: 0.8,
      });
    });

    // 3. Database Posts
    const posts = await Post.find({}, "_id updatedAt");
    posts.forEach((post) => {
      smStream.write({
        url: `/post/${post._id}`,
        lastmod: post.updatedAt,
        changefreq: "weekly",
        priority: 0.7,
      });
    });

    smStream.end();

    const sitemapData = await streamToPromise(smStream);
    res.send(sitemapData.toString());
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).end();
  }
});

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
