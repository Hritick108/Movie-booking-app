import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt-secret_here";
const TOKEN_EXPIRES_IN = "24h";

/* ---------------- helpers ---------------- */
const emailIsValid = (e) => /\S+@\S+\.\S+/.test(String(e || ""));
const extractCleanPhone = (p) => String(p || "").replace(/\D/g, "");
const mkToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

// REGISTER FUNCITON

export const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, phone, birthDate, password } =
      req.body || {};

    if (!fullName || !username || !email || !phone || !birthDate || !password) {
      return res.status(400).json({
        success: false,
        message: "All files are required",
      });
    }

    if (typeof fullName !== "string" || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name must be atleast 2 characters.",
      });
    }

    if (typeof username !== "string" || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be atleast 3 characters.",
      });
    }

    if (!emailIsValid(email)) {
      return res.status(400).json({
        success: false,
        message: "Email is not valid",
      });
    }

    const cleanedPhone = extractCleanPhone(phone);
    if (cleanedPhone.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Phone number is invalid",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be 6 characters long",
      });
    }

    const parsedBirth = new Date(birthDate);
    // the gettme() returns a timestamp of time from 1st jan 1970 till now in milliseconds which is a random number
    // the isNaN checks if the input is not a number if its NaN then returns ture if not returns false
    // Invalid date if getTime() returns NaN
    // This checks whether the provided birth date is invalid by verifying that getTime() returns NaN.
    if (Number.isNaN(parsedBirth.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Birth date is Invalid",
      });
    }

    const exitstingByEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (exitstingByEmail) {
      return res.status(400).json({
        success: false,
        message: " Email already exist",
      });
    }

    const exitstingByUsername = await User.findOne({
      username: username.trim().toLowerCase(),
    });
    if (exitstingByEmail) {
      return res.status(400).json({
        success: false,
        message: " Username already in Use",
      });
    }

    // HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      phone: phone,
      birthDate: parsedBirth,
      password: hashedPassword,
    });

    const token = mkToken({ id: newUser._id });

    const userToReturn = {
      id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      birthDate: newUser.birthDate,
    };

    return res.status(200).json({
      success: true,
      message: "User registered Successfully",
      token,
      user: userToReturn,
    });
  } catch (err) {
    console.error("Registered error : ", err);
    if (err.code === 11000) {
      const dupKey = Object.keys(err.keyValue || {})[0];
      return res.status(400).json({
        success: false,
        message: `${dupKey} already exists.`,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//LOGIN FUNCITON

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fiels are Mandatory",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(4001).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password MisMatched",
      });
    }

    const token = mkToken({ id: user._id.toString() });
    return res.status(200).json({
      success: true,
      message: "Login SucessfuLL",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error", err);
    return res.status(500).json({
      success: false,
      message: " Server Error",
    });
  }
}
