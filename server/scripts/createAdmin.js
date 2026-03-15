import dotenv from "dotenv";
import connectDB from "../src/config/db.js";
import User from "../src/models/user.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB(); // 👈 reuse your existing DB config

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: process.env.ADMIN_EMAIL,
      passwordHash: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("🔥 Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
