import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { sendWelcomeEmail } from "../config/mailer.js";

export const register = async (req, res) => {
  const { name, email, password, profileImage } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" });
  }

  if (
    profileImage !== undefined &&
    (typeof profileImage !== "string" ||
      !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(profileImage))
  ) {
    return res.status(400).json({ message: "profileImage must be a JPEG, PNG or WebP data URI" });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "password must be at least 6 character" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: "email already registered" });
  }

  const profileImageUrl = profileImage
    ? (await cloudinary.uploader.upload(profileImage, { folder: "profile-images" })).secure_url
    : undefined;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
    profileImage: profileImageUrl,
  });

  let welcomeEmailSent = true;
  try {
    await sendWelcomeEmail(user);
  } catch (error) {
    console.error("Welcome email could not be sent:", error);
    welcomeEmailSent = false;
  }

  res.status(201).json({
    message: welcomeEmailSent ? "user registered" : "user registered, but welcome email could not be sent",
    welcomeEmailSent,
    user: { id: user._id, name: user.name, email: user.email, profileImage: user.profileImage },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "email and password is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "invalid email or password" });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ message: "login successfully", token });
};
