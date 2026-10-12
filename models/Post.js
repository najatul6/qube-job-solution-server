const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    snippet: {
      type: String, // হোমপেজে অল্প একটু লেখা দেখানোর জন্য
      required: true,
    },
    content: {
      type: String, // মূল নোট বা বিস্তারিত লেখা
      required: true,
    },
    category: {
      type: String, // যেমন: DBMS, Networking, Math
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
); // timestamps true দিলে কখন পোস্ট করা হয়েছে (createdAt) তা অটো সেভ হবে

module.exports = mongoose.model("Post", postSchema);
