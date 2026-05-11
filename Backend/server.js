import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://shanmuganathans2005:shan26072005@shanmugam.kqynwfs.mongodb.net/?appName=Shanmugam", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("Shan", UserSchema);

// Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.json({ message: "User registered successfully ✅" });
  } catch (err) {
    res.status(400).json({ error: "User already exists ❌" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found ❌" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password ❌" });

  const token = jwt.sign({ id: user._id }, "secret123");
  res.json({ message: "Login successful 🎉", token });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
