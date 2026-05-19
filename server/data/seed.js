import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Book } from "../models/Book.js";
import { Review } from "../models/Review.js";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { buildUserDocs } from "./users.js";
import { seedBooks } from "./books.js";

async function importData() {
  await Order.deleteMany();
  await Cart.deleteMany();
  await Review.deleteMany();
  await User.deleteMany();
  await Book.deleteMany();

  const userDocs = await buildUserDocs();
  const users = await User.insertMany(userDocs);
  const books = await Book.insertMany(seedBooks);

  // A handful of reviews so the N+1 lookup in bookController.list actually
  // observes the multi-query pattern.
  const reviews = [];
  for (let i = 0; i < Math.min(books.length, 6); i += 1) {
    reviews.push({
      book: books[i]._id,
      user: users[1]._id,
      rating: 4 + (i % 2),
      body: "Great read.",
    });
    reviews.push({
      book: books[i]._id,
      user: users[0]._id,
      rating: 5,
      body: "Recommended.",
    });
  }
  await Review.insertMany(reviews);

  console.log("[seed] imported users:", users.length);
  console.log("[seed] imported books:", books.length);
  console.log("[seed] imported reviews:", reviews.length);
  console.log("[seed] non-admin login: john@learner.aierudit.io / 123456");
  console.log("[seed] admin login:     admin@aierudit.io / AdminPassword!2026");
}

async function destroyData() {
  await Order.deleteMany();
  await Cart.deleteMany();
  await Review.deleteMany();
  await User.deleteMany();
  await Book.deleteMany();
  console.log("[seed] all collections cleared");
}

(async () => {
  await connectDB();
  try {
    if (process.argv.includes("--destroy")) {
      await destroyData();
    } else {
      await importData();
    }
  } catch (err) {
    console.error("[seed] error:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
