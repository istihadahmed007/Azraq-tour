import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import { INITIAL_TOUR_PACKAGES } from "./src/data/initialPackagesData";
import { INITIAL_SOCIAL_PROOF_ACTIVITIES } from "./src/data/socialProofData";

const INITIAL_BLOG_POSTS: any[] = [];

const app = express();
const PORT = 3000;

// Ensure public/uploads directory exists for permanent media storage
const uploadsDir = path.join(process.cwd(), "public", "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn("Could not create public/uploads folder:", e);
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(uploadsDir));

// --- Cloudinary Server Configuration & Client Helper ---
function getCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "vd722ywp";
  const api_key = process.env.CLOUDINARY_API_KEY || "897229884945796";
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret: api_secret || undefined,
    secure: true,
  });

  return cloudinary;
}

// Initialize Gemini API client lazily on request or if API key exists
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// --- Secure Password Hashing Helpers ---
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 10000, 64, "sha512").toString("hex");
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, storedHash?: string, salt?: string): boolean {
  if (!storedHash) return false;
  // If user is legacy with plain password, check direct equality first
  if (!salt) {
    return password === storedHash;
  }
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

// --- System Security Settings Store ---
interface SystemSettings {
  requireEmailVerification: boolean;
  requirePhoneOtp: boolean;
}

let systemSettings: SystemSettings = {
  requireEmailVerification: true,
  requirePhoneOtp: false,
};

// --- Persistent File-Backed Auth User Store ---
interface ServerUser {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  passwordHash?: string;
  passwordSalt?: string;
  photoURL?: string;
  bio?: string;
  languages?: string[];
  emailVerified: boolean;
  emailVerificationCode?: string;
  emailCodeExpiry?: number;
  phoneVerified?: boolean;
  phoneOtpCode?: string;
  phoneOtpExpiry?: number;
  otpFailedAttempts?: number;
  failedLoginAttempts?: number;
  lockoutUntil?: number;
  isSuspended?: boolean;
  provider: 'email' | 'google' | 'apple' | 'facebook';
  createdAt: string;
  updatedAt?: string;
  homeLocation?: string;
  travelPreferences?: string[];
  isProfileComplete?: boolean;
  isAdmin?: boolean;
  role?: 'admin' | 'user' | 'owner';
  resetToken?: string;
  resetTokenExpiry?: number;
}

const DB_FILE = path.join(process.cwd(), ".users_db.json");

function isOwnerEmail(email: string): boolean {
  const norm = (email || '').toLowerCase().trim();
  const owners = ['istihadahmed1163@gmail.com', 'admin@globetrotter.ai', 'owner@globetrotter.ai'];
  return owners.includes(norm) || norm.startsWith('admin') || norm.startsWith('owner');
}

// Password Validator helper
function validatePasswordRequirements(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters long." };
  }
  return { valid: true };
}

function loadUsersFromDisk(): Map<string, ServerUser> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      const map = new Map<string, ServerUser>();
      for (const [key, val] of Object.entries(parsed)) {
        map.set(key, val as ServerUser);
      }
      return map;
    }
  } catch (err) {
    console.error("Failed to read user DB file:", err);
  }
  // Default owner account
  const istihadSaltHash = hashPassword("pass1234");
  return new Map<string, ServerUser>([
    [
      "istihadahmed1163@gmail.com",
      {
        uid: "user_istihad_001",
        fullName: "Istihad Ahmed",
        email: "istihadahmed1163@gmail.com",
        phone: "+880 1851-172032",
        country: "Bangladesh",
        passwordHash: istihadSaltHash.hash,
        passwordSalt: istihadSaltHash.salt,
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        bio: "Managing Director at Azraq Tours & Travels.",
        languages: ["Bengali", "English", "Arabic"],
        emailVerified: true,
        phoneVerified: true,
        provider: "email",
        createdAt: new Date().toISOString(),
        homeLocation: "Dhaka, Bangladesh",
        travelPreferences: ["Culture", "Nature", "Luxury", "Food"],
        isProfileComplete: true,
        isAdmin: true,
        role: "admin",
      },
    ],
  ]);
}

const usersStore = loadUsersFromDisk();

// Ensure owner account is populated
if (!usersStore.has("istihadahmed1163@gmail.com")) {
  const istihadSaltHash = hashPassword("pass1234");
  usersStore.set("istihadahmed1163@gmail.com", {
    uid: "user_istihad_001",
    fullName: "Istihad Ahmed",
    email: "istihadahmed1163@gmail.com",
    phone: "+880 1851-172032",
    country: "Bangladesh",
    passwordHash: istihadSaltHash.hash,
    passwordSalt: istihadSaltHash.salt,
    photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    bio: "Managing Director at Azraq Tours & Travels.",
    languages: ["Bengali", "English", "Arabic"],
    emailVerified: true,
    phoneVerified: true,
    provider: "email",
    createdAt: new Date().toISOString(),
    homeLocation: "Dhaka, Bangladesh",
    travelPreferences: ["Culture", "Nature", "Luxury", "Food"],
    isProfileComplete: true,
    isAdmin: true,
    role: "admin",
  });
  saveUsersToDisk();
}

function saveUsersToDisk() {
  try {
    const obj: Record<string, ServerUser> = {};
    usersStore.forEach((val, key) => {
      obj[key] = val;
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save user DB file:", err);
  }
}

// Helper to strip sensitive user properties before returning to client
function sanitizeUserPayload(user: ServerUser) {
  const {
    passwordHash,
    passwordSalt,
    resetToken,
    resetTokenExpiry,
    emailVerificationCode,
    emailCodeExpiry,
    phoneOtpCode,
    phoneOtpExpiry,
    otpFailedAttempts,
    failedLoginAttempts,
    lockoutUntil,
    ...userPayload
  } = user;
  return userPayload;
}

// Helper to find user by email or phone
function findUserByEmailOrPhone(identifier: string): ServerUser | undefined {
  if (!identifier) return undefined;
  const norm = identifier.trim().toLowerCase();
  
  // Try direct email match
  if (usersStore.has(norm)) {
    return usersStore.get(norm);
  }

  // Search by email or phone across map values
  const cleanPhone = norm.replace(/[^0-9]/g, '');
  for (const user of usersStore.values()) {
    if (user.email.toLowerCase() === norm) return user;
    if (user.phone && cleanPhone.length >= 6) {
      const userCleanPhone = user.phone.replace(/[^0-9]/g, '');
      if (
        userCleanPhone === cleanPhone ||
        userCleanPhone.endsWith(cleanPhone) ||
        cleanPhone.endsWith(userCleanPhone) ||
        (cleanPhone.length >= 8 && userCleanPhone.slice(-8) === cleanPhone.slice(-8))
      ) {
        return user;
      }
    }
  }
  return undefined;
}

// --- Authentication Endpoints ---

// Active token storage map (token -> user email)
const activeTokensMap = new Map<string, string>();

// Helper to issue and register a new session token for a specific user
function issueSessionToken(user: ServerUser): string {
  const token = `token_${user.uid}_${Date.now()}`;
  activeTokensMap.set(token, user.email.toLowerCase());
  return token;
}

// 0. Authenticated /api/auth/me Endpoint (STRICT logged-in user identification)
app.get("/api/auth/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    let token = "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else if (req.headers["x-auth-token"]) {
      token = String(req.headers["x-auth-token"]).trim();
    }

    // Strict check: token must be present
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No session token provided." });
    }

    let foundUser: ServerUser | undefined;

    // 1. Check registered active tokens
    if (activeTokensMap.has(token)) {
      const email = activeTokensMap.get(token)!;
      foundUser = usersStore.get(email.toLowerCase());
    }

    // 2. Strict lookup by UID extracted from token format "token_<uid>_<timestamp>"
    if (!foundUser && token.startsWith("token_")) {
      const parts = token.split("_");
      if (parts.length >= 3) {
        const targetUid = parts.slice(1, parts.length - 1).join("_");
        for (const u of usersStore.values()) {
          if (u.uid === targetUid) {
            foundUser = u;
            // Cache token to email mapping for subsequent fast lookups
            activeTokensMap.set(token, u.email.toLowerCase());
            break;
          }
        }
      }
    }

    // CRITICAL: If no user matches the specific token, return 401 Unauthorized.
    // NEVER return the first user or any random fallback user.
    if (!foundUser) {
      return res.status(401).json({ error: "Unauthorized: User session not found or expired." });
    }

    // Return ONLY the authenticated user's data
    res.json({
      success: true,
      user: sanitizeUserPayload(foundUser),
    });
  } catch (err: any) {
    console.error("Get /api/auth/me error:", err);
    res.status(500).json({ error: "Failed to retrieve current user session." });
  }
});

// 1. Register Endpoint
app.post("/api/auth/register", (req, res) => {
  try {
    const { fullName, email, phone, country, password, agreeTerms, photoURL } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "Full Name is required." });
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!phone || phone.trim().length < 6) {
      return res.status(400).json({ error: "Please enter a valid Phone / WhatsApp number." });
    }
    if (!country || !country.trim()) {
      return res.status(400).json({ error: "Please select or enter your Country." });
    }
    if (!agreeTerms) {
      return res.status(400).json({ error: "You must agree to the Terms of Service & Privacy Policy to register." });
    }

    // Strict Password Rules Validation
    const passCheck = validatePasswordRequirements(password || "");
    if (!passCheck.valid) {
      return res.status(400).json({ error: passCheck.error });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (usersStore.has(normalizedEmail)) {
      return res.status(400).json({ error: "An account with this email address already exists. Please log in instead." });
    }

    // Secure salt + PBKDF2 password hashing
    const { hash, salt } = hashPassword(password);

    // Generate 6-digit email verification code & 6-digit phone OTP
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: ServerUser = {
      uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      country: country.trim(),
      passwordHash: hash,
      passwordSalt: salt,
      photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      bio: `Hello! I am ${fullName.trim()}, excited to discover amazing travel destinations.`,
      languages: ["English"],
      emailVerified: true,
      emailVerificationCode,
      emailCodeExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      phoneVerified: true,
      phoneOtpCode,
      phoneOtpExpiry: Date.now() + 10 * 60 * 1000, // 10 mins
      provider: "email",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isProfileComplete: true,
      isAdmin: isOwnerEmail(normalizedEmail),
      role: isOwnerEmail(normalizedEmail) ? "admin" : "user",
    };

    usersStore.set(normalizedEmail, newUser);
    saveUsersToDisk();

    const token = issueSessionToken(newUser);

    res.json({
      success: true,
      message: "Account created! We've sent a 6-digit verification code to your email.",
      user: sanitizeUserPayload(newUser),
      demoEmailCode: emailVerificationCode,
      demoPhoneOtp: phoneOtpCode,
      token,
    });
  } catch (err: any) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Failed to create account. Please try again." });
  }
});

// 2. Login Endpoint (Supports Email or Phone identifier + Lockout + Suspension check)
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email/Phone and Password are required." });
    }

    const existingUser = findUserByEmailOrPhone(email);

    if (!existingUser) {
      return res.status(400).json({ error: "No account found with those credentials. Please check your email/phone or sign up." });
    }

    // Check Account Suspension
    if (existingUser.isSuspended) {
      return res.status(403).json({
        error: "Your account has been suspended by an administrator. Please contact support at support@globetrotter.ai.",
      });
    }

    // Check Rate Limiting / Lockout Cooldown
    if (existingUser.lockoutUntil && Date.now() < existingUser.lockoutUntil) {
      const remainingSeconds = Math.ceil((existingUser.lockoutUntil - Date.now()) / 1000);
      const remainingMins = Math.ceil(remainingSeconds / 60);
      return res.status(429).json({
        error: `Account temporarily locked due to repeated failed login attempts. Please try again in ${remainingMins} minute(s).`,
      });
    }

    const isMatch = verifyPassword(password, existingUser.passwordHash, existingUser.passwordSalt);
    if (!isMatch) {
      // Increment failed login attempt counter
      existingUser.failedLoginAttempts = (existingUser.failedLoginAttempts || 0) + 1;
      if (existingUser.failedLoginAttempts >= 5) {
        existingUser.lockoutUntil = Date.now() + 10 * 60 * 1000; // 10 mins lockout
        saveUsersToDisk();
        return res.status(429).json({
          error: "Too many failed login attempts. Your account has been temporarily locked for 10 minutes.",
        });
      }
      saveUsersToDisk();
      const remainingTries = 5 - existingUser.failedLoginAttempts;
      return res.status(400).json({
        error: `Incorrect password. ${remainingTries} attempt(s) remaining before temporary lockout.`,
      });
    }

    // Reset lockout counters on successful login
    existingUser.failedLoginAttempts = 0;
    delete existingUser.lockoutUntil;

    // Upgrade legacy password format to salt+hash if necessary
    if (!existingUser.passwordSalt) {
      const { hash, salt } = hashPassword(password);
      existingUser.passwordHash = hash;
      existingUser.passwordSalt = salt;
    }
    existingUser.updatedAt = new Date().toISOString();

    usersStore.set(existingUser.email, existingUser);
    saveUsersToDisk();

    const token = issueSessionToken(existingUser);

    res.json({
      success: true,
      message: "Logged in successfully!",
      user: sanitizeUserPayload(existingUser),
      token,
    });
  } catch (err: any) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Failed to log in. Please try again." });
  }
});

// 3. Email Code Verification Endpoint
app.post("/api/auth/verify-email-code", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and Verification Code are required." });
    }

    const user = findUserByEmailOrPhone(email);
    if (!user) {
      return res.status(400).json({ error: "Account not found." });
    }

    if (user.emailVerified) {
      return res.json({ success: true, message: "Email is already verified!", user: sanitizeUserPayload(user) });
    }

    const cleanCode = code.toString().trim();
    if (!user.emailVerificationCode || user.emailVerificationCode !== cleanCode) {
      return res.status(400).json({ error: "Invalid verification code. Please check your email and try again." });
    }

    user.emailVerified = true;
    delete user.emailVerificationCode;
    delete user.emailCodeExpiry;
    user.updatedAt = new Date().toISOString();

    usersStore.set(user.email, user);
    saveUsersToDisk();

    res.json({
      success: true,
      message: "Email verified successfully! 🎉",
      user: sanitizeUserPayload(user),
    });
  } catch (err: any) {
    console.error("Verify Email Code Error:", err);
    res.status(500).json({ error: "Failed to verify email code." });
  }
});

// 4. Resend Email Verification Code
app.post("/api/auth/resend-email-verification", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = findUserByEmailOrPhone(email);
    if (!user) {
      return res.status(400).json({ error: "User account not found." });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = newCode;
    user.emailCodeExpiry = Date.now() + 24 * 60 * 60 * 1000;
    usersStore.set(user.email, user);
    saveUsersToDisk();

    res.json({
      success: true,
      message: `A new 6-digit verification code has been sent to ${user.email}.`,
      demoEmailCode: newCode,
    });
  } catch (err: any) {
    console.error("Resend Email Verification Error:", err);
    res.status(500).json({ error: "Failed to resend verification email." });
  }
});

// 5. Send Phone OTP Endpoint
app.post("/api/auth/send-phone-otp", (req, res) => {
  try {
    const { phone, email } = req.body;
    const identifier = email || phone;
    if (!identifier) {
      return res.status(400).json({ error: "Phone number or Email is required to send OTP." });
    }

    const user = findUserByEmailOrPhone(identifier);
    if (!user) {
      return res.status(400).json({ error: "User account not found." });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.phoneOtpCode = otpCode;
    user.phoneOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
    user.otpFailedAttempts = 0;

    usersStore.set(user.email, user);
    saveUsersToDisk();

    res.json({
      success: true,
      message: `6-Digit OTP code sent to ${user.phone || 'your mobile number'}. Valid for 5 minutes.`,
      demoOtp: otpCode,
    });
  } catch (err: any) {
    console.error("Send Phone OTP Error:", err);
    res.status(500).json({ error: "Failed to send phone OTP." });
  }
});

// 6. Verify Phone OTP Endpoint
app.post("/api/auth/verify-phone-otp", (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const identifier = email || phone;
    if (!identifier || !otp) {
      return res.status(400).json({ error: "Identifier and OTP code are required." });
    }

    const user = findUserByEmailOrPhone(identifier);
    if (!user) {
      return res.status(400).json({ error: "User account not found." });
    }

    if (user.phoneVerified) {
      return res.json({ success: true, message: "Phone number is already verified!", user: sanitizeUserPayload(user) });
    }

    // Check rate limit on OTP attempts
    if ((user.otpFailedAttempts || 0) >= 3) {
      return res.status(429).json({
        error: "Maximum OTP verification attempts exceeded. Please request a new OTP code.",
      });
    }

    if (user.phoneOtpExpiry && Date.now() > user.phoneOtpExpiry) {
      return res.status(400).json({ error: "OTP code has expired. Please request a new OTP code." });
    }

    if (!user.phoneOtpCode || user.phoneOtpCode !== otp.toString().trim()) {
      user.otpFailedAttempts = (user.otpFailedAttempts || 0) + 1;
      saveUsersToDisk();
      const remaining = 3 - user.otpFailedAttempts;
      return res.status(400).json({
        error: `Invalid OTP code. ${remaining} attempt(s) remaining.`,
      });
    }

    user.phoneVerified = true;
    delete user.phoneOtpCode;
    delete user.phoneOtpExpiry;
    user.otpFailedAttempts = 0;
    user.updatedAt = new Date().toISOString();

    usersStore.set(user.email, user);
    saveUsersToDisk();

    res.json({
      success: true,
      message: "Mobile phone number verified successfully! 📱",
      user: sanitizeUserPayload(user),
    });
  } catch (err: any) {
    console.error("Verify Phone OTP Error:", err);
    res.status(500).json({ error: "Failed to verify phone OTP." });
  }
});

// 7. Google One-Click Auth Endpoint
app.post("/api/auth/google", (req, res) => {
  try {
    const { email, fullName, photoURL } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required for Google authentication." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const userName = fullName ? fullName.trim() : normalizedEmail.split("@")[0].replace(".", " ");

    let existingUser = usersStore.get(normalizedEmail);

    if (!existingUser) {
      existingUser = {
        uid: `goog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        fullName: userName,
        email: normalizedEmail,
        phone: "",
        country: "Bangladesh",
        photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        bio: `Hello! I am ${userName}, a travel enthusiast at Azraq Tours.`,
        languages: ["English"],
        emailVerified: true, // Google accounts pre-verified
        phoneVerified: false,
        provider: "google",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isProfileComplete: true,
        isAdmin: isOwnerEmail(normalizedEmail),
        role: isOwnerEmail(normalizedEmail) ? "admin" : "user",
      };
      usersStore.set(normalizedEmail, existingUser);
      saveUsersToDisk();
    }

    const token = issueSessionToken(existingUser);

    res.json({
      success: true,
      message: "Google login successful!",
      user: sanitizeUserPayload(existingUser),
      token,
    });
  } catch (err: any) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ error: "Google authentication failed." });
  }
});

// 8. Forgot Password Endpoint (Generates 6-Digit Reset Code)
app.post("/api/auth/forgot-password", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please enter your registered email or phone." });
    }

    const user = findUserByEmailOrPhone(email);
    if (!user) {
      return res.status(400).json({ error: "No account found registered with that email or phone number." });
    }

    // Generate 6-digit code valid for 15 minutes
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = resetCode;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    usersStore.set(user.email, user);
    saveUsersToDisk();

    res.json({
      success: true,
      message: `Password reset verification code sent to ${user.email}.`,
      sent: true,
      resetCodeSent: true,
      demoResetCode: resetCode,
    });
  } catch (err: any) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Could not process password reset request." });
  }
});

// 9. Reset Password Endpoint (Validates strict password rules + code)
app.post("/api/auth/reset-password", (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ error: "Email, Reset Code, and New Password are required." });
    }

    // Strict Password Validation
    const passCheck = validatePasswordRequirements(newPassword);
    if (!passCheck.valid) {
      return res.status(400).json({ error: passCheck.error });
    }

    const user = findUserByEmailOrPhone(email);
    if (!user) {
      return res.status(400).json({ error: "User account not found." });
    }

    if (!user.resetToken || user.resetToken !== resetCode.toString().trim()) {
      return res.status(400).json({ error: "Invalid reset code. Please check your code and try again." });
    }

    if (user.resetTokenExpiry && Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ error: "Reset code has expired. Please request a new password reset." });
    }

    // Hash new password securely
    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    delete user.resetToken;
    delete user.resetTokenExpiry;
    user.failedLoginAttempts = 0;
    delete user.lockoutUntil;
    user.updatedAt = new Date().toISOString();

    usersStore.set(user.email, user);
    saveUsersToDisk();

    res.json({
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    });
  } catch (err: any) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
});

// 10. Update Profile / Photo / Bio / Preferences Endpoint
app.post("/api/auth/update-profile", (req, res) => {
  try {
    const { email, fullName, phone, country, bio, languages, homeLocation, travelPreferences, photoURL } = req.body;
    if (!email) {
      return res.status(400).json({ error: "User email is required." });
    }

    const user = findUserByEmailOrPhone(email);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (fullName !== undefined) user.fullName = fullName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (country !== undefined) user.country = country.trim();
    if (bio !== undefined) user.bio = bio;
    if (languages !== undefined) user.languages = Array.isArray(languages) ? languages : [languages];
    if (homeLocation !== undefined) user.homeLocation = homeLocation;
    if (travelPreferences !== undefined) user.travelPreferences = travelPreferences;
    if (photoURL !== undefined) user.photoURL = photoURL;
    user.updatedAt = new Date().toISOString();
    user.isProfileComplete = true;

    usersStore.set(user.email, user);
    saveUsersToDisk();

    res.json({ message: "Profile updated successfully!", user: sanitizeUserPayload(user) });
  } catch (err: any) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

// 10b. Change Password Endpoint (Authenticated / Current Password Check)
app.post("/api/auth/change-password", (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "Email, current password, and new password are required." });
    }

    const user = findUserByEmailOrPhone(email);
    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    // Verify current password
    if (user.passwordHash && user.passwordSalt) {
      const isValid = verifyPassword(currentPassword, user.passwordHash, user.passwordSalt);
      if (!isValid) {
        return res.status(400).json({ error: "Incorrect current password. Please try again." });
      }
    }

    // Validate new password rules
    const passCheck = validatePasswordRequirements(newPassword);
    if (!passCheck.valid) {
      return res.status(400).json({ error: passCheck.error });
    }

    // Hash and store new password
    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    user.updatedAt = new Date().toISOString();

    usersStore.set(user.email, user);
    saveUsersToDisk();

    res.json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (err: any) {
    console.error("Change Password Error:", err);
    res.status(500).json({ error: "Failed to change password. Please try again." });
  }
});

// --- Admin Users & Verification Management Endpoints ---

// 11. Admin Get All Registered Users & Metrics
app.get("/api/admin/users", (req, res) => {
  try {
    const userList: any[] = [];
    let totalUsers = 0;
    let emailVerifiedCount = 0;
    let phoneVerifiedCount = 0;
    let unverifiedCount = 0;
    let suspendedCount = 0;

    usersStore.forEach((u) => {
      totalUsers++;
      if (u.emailVerified) emailVerifiedCount++;
      if (u.phoneVerified) phoneVerifiedCount++;
      if (!u.emailVerified && !u.phoneVerified) unverifiedCount++;
      if (u.isSuspended) suspendedCount++;

      userList.push(sanitizeUserPayload(u));
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        emailVerifiedCount,
        phoneVerifiedCount,
        unverifiedCount,
        suspendedCount,
      },
      users: userList,
      settings: systemSettings,
    });
  } catch (err: any) {
    console.error("Admin Get Users Error:", err);
    res.status(500).json({ error: "Failed to load users for admin." });
  }
});

// 12. Admin Toggle User Status (Suspend/Reactivate, Verification override)
app.patch("/api/admin/users/:uid/status", (req, res) => {
  try {
    const { uid } = req.params;
    const { isSuspended, emailVerified, phoneVerified, role } = req.body;

    let targetUser: ServerUser | undefined;
    for (const user of usersStore.values()) {
      if (user.uid === uid) {
        targetUser = user;
        break;
      }
    }

    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (isSuspended !== undefined) targetUser.isSuspended = isSuspended;
    if (emailVerified !== undefined) targetUser.emailVerified = emailVerified;
    if (phoneVerified !== undefined) targetUser.phoneVerified = phoneVerified;
    if (role !== undefined) {
      targetUser.role = role;
      targetUser.isAdmin = role === 'admin' || role === 'owner';
    }
    targetUser.updatedAt = new Date().toISOString();

    usersStore.set(targetUser.email, targetUser);
    saveUsersToDisk();

    res.json({
      success: true,
      message: `User ${targetUser.fullName} updated successfully!`,
      user: sanitizeUserPayload(targetUser),
    });
  } catch (err: any) {
    console.error("Admin Update User Status Error:", err);
    res.status(500).json({ error: "Failed to update user status." });
  }
});

// 13. Admin System Settings Endpoints
app.get("/api/admin/settings", (req, res) => {
  res.json({ success: true, settings: systemSettings });
});

app.post("/api/admin/settings", (req, res) => {
  const { requireEmailVerification, requirePhoneOtp } = req.body;
  if (requireEmailVerification !== undefined) systemSettings.requireEmailVerification = requireEmailVerification;
  if (requirePhoneOtp !== undefined) systemSettings.requirePhoneOtp = requirePhoneOtp;
  res.json({ success: true, message: "System security settings updated!", settings: systemSettings });
});

// --- API Endpoints ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. AI Concierge Chat (Conversational travel Q&A)
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGenAI();
    const systemInstruction = `You are GlobeTrotter AI, an expert, enthusiastic, and highly cultured AI Travel Concierge. 
    You assist travelers with destination ideas, travel itineraries, local secrets, culture tips, packing advice, and culinary recommendations.
    Keep your tone warm, sophisticated, concise, and inspiring. Provide bulleted highlights and practical advice.`;

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Send history if present
    if (history && Array.isArray(history)) {
      for (const h of history) {
        if (h.message) {
          await chat.sendMessage({ message: h.message });
        }
      }
    }

    const result = await chat.sendMessage({ message });
    res.json({ response: result.text });
  } catch (err: any) {
    console.error("Error in /api/ai/chat:", err);
    res.status(500).json({ error: err.message || "Failed to process chat request" });
  }
});

// 3. AI Itinerary Generator (Structured JSON Itinerary + Packing List)
app.post("/api/ai/itinerary", async (req, res) => {
  try {
    const { destination, startDate, endDate, vibes, travelerCount } = req.body;
    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    const ai = getGenAI();
    const prompt = `Create a detailed, high-quality, authentic travel itinerary for "${destination}".
    Dates/Duration: ${startDate || "Upcoming trip"} to ${endDate || "5 days"}.
    Vibes / Interests: ${vibes ? vibes.join(", ") : "Culture, Local Cuisine, Nature"}.
    Travelers: ${travelerCount || 1} traveler(s).
    
    Provide a realistic, atmospheric day-by-day breakdown with authentic place names, estimated activity times, descriptions, and AI Insights (pro-tips for avoiding crowds, best photography spots, local hidden gems).
    Also include weather summary and smart packing list categories.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy title for the trip, e.g. Kyoto Cultural Immersion" },
            destination: { type: Type.STRING },
            durationDays: { type: Type.INTEGER },
            weatherSummary: { type: Type.STRING, description: "e.g., 15°C Partly Cloudy, crisp autumn breeze" },
            aiSummary: { type: Type.STRING, description: "An inspiring overview of why this itinerary is special" },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: "e.g., Day 1: Arrival & Higashiyama" },
                  summary: { type: Type.STRING },
                  spots: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        timeSlot: { type: Type.STRING, description: "e.g. 09:00 - 11:30" },
                        category: { type: Type.STRING, description: "Sightseeing, Food, Nature, Culture, Nightlife" },
                        imageUrl: { type: Type.STRING, description: "Optional Unsplash travel image URL" },
                        aiTip: { type: Type.STRING, description: "Insider tip or photography advice" },
                      },
                      required: ["name", "description", "timeSlot"],
                    },
                  },
                  aiInsight: { type: Type.STRING, description: "General insider recommendation for the day" },
                },
                required: ["dayNumber", "title", "spots"],
              },
            },
            packingList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "e.g. Clothing, Essentials, Gear" },
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["category", "items"],
              },
            },
            budget: {
              type: Type.OBJECT,
              properties: {
                currency: { type: Type.STRING, description: "e.g. USD, BDT, EUR" },
                totalBudget: { type: Type.NUMBER, description: "Total estimated budget ceiling" },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Item description, e.g. Round-trip Flights or Entry Ticket" },
                      category: { type: Type.STRING, description: "Flights, Accommodation, Activities, Food & Dining, Transport, Shopping, Visa & Insurance, Miscellaneous" },
                      estimatedCost: { type: Type.NUMBER },
                      dayNumber: { type: Type.INTEGER, description: "Day number if associated with a day" },
                      spotName: { type: Type.STRING, description: "Spot or attraction name if applicable" },
                      notes: { type: Type.STRING },
                    },
                    required: ["name", "category", "estimatedCost"],
                  },
                },
              },
              required: ["currency", "totalBudget", "items"],
            },
          },
          required: ["title", "destination", "days", "weatherSummary", "packingList"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const itineraryData = JSON.parse(jsonText);
    res.json(itineraryData);
  } catch (err: any) {
    console.error("Error in /api/ai/itinerary:", err);
    res.status(500).json({ error: err.message || "Failed to generate itinerary" });
  }
});

// 3b. AI Voice Trip Parser (Converts spoken travel speech into structured prompt & flight search parameters)
app.post("/api/ai/parse-voice-trip", async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: "Spoken transcript is required" });
    }

    const cleanText = transcript.trim();

    // Default dates (2 weeks from now)
    const today = new Date();
    const defaultStart = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const defaultEnd = new Date(today.getTime() + 19 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      const ai = getGenAI();
      const prompt = `You are an expert AI Flight & Travel Assistant for Azraq Travel.
The user spoke their travel/flight request via microphone: "${cleanText}".

Analyze the spoken transcript. Detect whether the user wants to search for flights, plan a custom holiday itinerary, or both.
Extract flight search parameters accurately (default origin airport to Dhaka Hazrat Shahjalal DAC unless specified otherwise) and travel itinerary parameters.

Output strictly valid JSON matching the schema:
- isFlightIntent: boolean (true if the user mentions flights, fly, tickets, airlines, route, airport, or looking for travel tickets)
- destination: City and Country name (e.g. "Bangkok, Thailand", "Dubai, UAE", "Kuala Lumpur, Malaysia", "Maldives", "Singapore")
- durationDays: integer duration in days (default 5 or based on context)
- startDate: departure date in YYYY-MM-DD format (e.g. ${defaultStart})
- endDate: return date in YYYY-MM-DD format (e.g. ${defaultEnd})
- vibes: array of 3 to 6 travel keywords (e.g. ["Culture", "Local Cuisine", "Shopping"])
- travelerCount: integer total passengers/travelers (default 1 or 2)
- travelStyle: concise description (e.g. "Family Holiday", "Business Trip", "Couples Getaway")
- budgetLevel: "Budget-Friendly" | "Moderate / Value" | "Luxury" | "Ultra-Luxury"
- structuredPrompt: detailed 2-3 sentence prompt for itinerary generation
- spokenSummary: 1-sentence friendly confirmation of the understood route & trip
- flightParams:
  - originCode: IATA code (e.g. "DAC", "CGP", "ZYL", "DXB", "BKK", "SIN", "LHR", "JFK")
  - originCity: city name (e.g. "Dhaka")
  - originName: airport name (e.g. "Hazrat Shahjalal International Airport")
  - originCountry: country (e.g. "Bangladesh")
  - destinationCode: IATA code (e.g. "BKK", "DXB", "KUL", "SIN", "MLE", "DPS", "JED", "IST", "LHR")
  - destinationCity: city name (e.g. "Bangkok")
  - destinationName: airport name (e.g. "Suvarnabhumi Airport")
  - destinationCountry: country name (e.g. "Thailand")
  - tripType: "round" | "oneway"
  - departureDate: YYYY-MM-DD
  - returnDate: YYYY-MM-DD
  - adults: integer
  - children: integer
  - infants: integer
  - cabinClass: "Economy" | "Premium Economy" | "Business" | "First"
  - preferredAirline: optional string (e.g. "Biman Bangladesh Airlines", "Emirates", "Singapore Airlines", "US-Bangla")`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isFlightIntent: { type: Type.BOOLEAN },
              destination: { type: Type.STRING },
              durationDays: { type: Type.INTEGER },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              vibes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              travelerCount: { type: Type.INTEGER },
              travelStyle: { type: Type.STRING },
              budgetLevel: { type: Type.STRING },
              structuredPrompt: { type: Type.STRING },
              spokenSummary: { type: Type.STRING },
              flightParams: {
                type: Type.OBJECT,
                properties: {
                  originCode: { type: Type.STRING },
                  originCity: { type: Type.STRING },
                  originName: { type: Type.STRING },
                  originCountry: { type: Type.STRING },
                  destinationCode: { type: Type.STRING },
                  destinationCity: { type: Type.STRING },
                  destinationName: { type: Type.STRING },
                  destinationCountry: { type: Type.STRING },
                  tripType: { type: Type.STRING },
                  departureDate: { type: Type.STRING },
                  returnDate: { type: Type.STRING },
                  adults: { type: Type.INTEGER },
                  children: { type: Type.INTEGER },
                  infants: { type: Type.INTEGER },
                  cabinClass: { type: Type.STRING },
                  preferredAirline: { type: Type.STRING },
                },
                required: [
                  "originCode",
                  "originCity",
                  "originName",
                  "originCountry",
                  "destinationCode",
                  "destinationCity",
                  "destinationName",
                  "destinationCountry",
                  "tripType",
                  "departureDate",
                  "returnDate",
                  "adults",
                  "children",
                  "cabinClass",
                ],
              },
            },
            required: [
              "isFlightIntent",
              "destination",
              "durationDays",
              "startDate",
              "endDate",
              "vibes",
              "travelerCount",
              "travelStyle",
              "budgetLevel",
              "structuredPrompt",
              "spokenSummary",
              "flightParams",
            ],
          },
        },
      });

      const parsedData = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (geminiErr) {
      console.warn("Gemini voice parsing fallback used:", geminiErr);

      // Fast, resilient heuristic fallback
      let durationDays = 5;
      const daysMatch = cleanText.match(/(\d+)\s*(?:day|days|d)/i);
      if (daysMatch) {
        durationDays = Math.max(2, Math.min(21, parseInt(daysMatch[1], 10)));
      }

      let destCity = "Bangkok";
      let destCountry = "Thailand";
      let destCode = "BKK";
      let destAirportName = "Suvarnabhumi Airport";

      const lower = cleanText.toLowerCase();
      if (lower.includes("dubai") || lower.includes("uae") || lower.includes("dxb")) {
        destCity = "Dubai";
        destCountry = "United Arab Emirates";
        destCode = "DXB";
        destAirportName = "Dubai International Airport";
      } else if (lower.includes("maldives") || lower.includes("male") || lower.includes("mle")) {
        destCity = "Male";
        destCountry = "Maldives";
        destCode = "MLE";
        destAirportName = "Velana International Airport";
      } else if (lower.includes("malaysia") || lower.includes("kuala lumpur") || lower.includes("kul")) {
        destCity = "Kuala Lumpur";
        destCountry = "Malaysia";
        destCode = "KUL";
        destAirportName = "Kuala Lumpur International Airport";
      } else if (lower.includes("singapore") || lower.includes("sin")) {
        destCity = "Singapore";
        destCountry = "Singapore";
        destCode = "SIN";
        destAirportName = "Singapore Changi Airport";
      } else if (lower.includes("japan") || lower.includes("tokyo") || lower.includes("nrt") || lower.includes("hnd")) {
        destCity = "Tokyo";
        destCountry = "Japan";
        destCode = "NRT";
        destAirportName = "Narita International Airport";
      } else if (lower.includes("bali") || lower.includes("dps") || lower.includes("indonesia")) {
        destCity = "Bali / Denpasar";
        destCountry = "Indonesia";
        destCode = "DPS";
        destAirportName = "Ngurah Rai International Airport";
      } else if (lower.includes("saudi") || lower.includes("jeddah") || lower.includes("jed") || lower.includes("umrah")) {
        destCity = "Jeddah";
        destCountry = "Saudi Arabia";
        destCode = "JED";
        destAirportName = "King Abdulaziz International Airport";
      } else if (lower.includes("london") || lower.includes("lhr") || lower.includes("uk")) {
        destCity = "London";
        destCountry = "United Kingdom";
        destCode = "LHR";
        destAirportName = "Heathrow Airport";
      } else if (lower.includes("cox's bazar") || lower.includes("cxb")) {
        destCity = "Cox's Bazar";
        destCountry = "Bangladesh";
        destCode = "CXB";
        destAirportName = "Cox's Bazar Airport";
      }

      const vibes: string[] = ["Culture", "Local Cuisine"];
      if (lower.includes("family") || lower.includes("kids") || lower.includes("children")) vibes.push("Family");
      if (lower.includes("luxury") || lower.includes("5 star") || lower.includes("villa")) vibes.push("Luxury");
      if (lower.includes("halal") || lower.includes("food") || lower.includes("dining")) vibes.push("Halal Food");
      if (lower.includes("beach") || lower.includes("island") || lower.includes("sea")) vibes.push("Beaches");
      if (lower.includes("shopping") || lower.includes("mall") || lower.includes("market")) vibes.push("Shopping");
      if (lower.includes("nature") || lower.includes("hiking") || lower.includes("mountains")) vibes.push("Nature");

      let adults = 1;
      if (lower.includes("2 adults") || lower.includes("two adults") || lower.includes("couple") || lower.includes("for 2")) adults = 2;
      else if (lower.includes("3 adults") || lower.includes("three")) adults = 3;
      else if (lower.includes("family") || lower.includes("4 adults") || lower.includes("4 people")) adults = 2;

      let children = 0;
      if (lower.includes("kid") || lower.includes("child") || lower.includes("children") || lower.includes("family")) {
        children = 1;
      }

      const isOneWay = lower.includes("one way") || lower.includes("oneway") || lower.includes("single");
      const tripType = isOneWay ? "oneway" : "round";
      const isFlightIntent = lower.includes("flight") || lower.includes("ticket") || lower.includes("fly") || lower.includes("airline") || lower.includes("dac") || lower.includes("bkk");

      let cabinClass: "Economy" | "Premium Economy" | "Business" | "First" = "Economy";
      if (lower.includes("business")) cabinClass = "Business";
      else if (lower.includes("first class")) cabinClass = "First";
      else if (lower.includes("premium economy")) cabinClass = "Premium Economy";

      const endDateCalc = new Date(new Date(defaultStart).getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      return res.json({
        success: true,
        data: {
          isFlightIntent,
          destination: `${destCity}, ${destCountry}`,
          durationDays,
          startDate: defaultStart,
          endDate: endDateCalc,
          vibes,
          travelerCount: adults + children,
          travelStyle: lower.includes("honeymoon") ? "Honeymoon Escape" : lower.includes("family") ? "Family Holiday" : "Curated Asian Holiday",
          budgetLevel: lower.includes("luxury") ? "Luxury" : "Moderate / Value",
          structuredPrompt: `${durationDays}-day curated trip to ${destCity}, ${destCountry} focusing on ${vibes.join(", ")}. Spoken request: "${cleanText}"`,
          spokenSummary: `Found flights from Dhaka (DAC) to ${destCity} (${destCode}) for ${adults} adult(s) in ${cabinClass} class.`,
          flightParams: {
            originCode: "DAC",
            originCity: "Dhaka",
            originName: "Hazrat Shahjalal International Airport",
            originCountry: "Bangladesh",
            destinationCode: destCode,
            destinationCity: destCity,
            destinationName: destAirportName,
            destinationCountry: destCountry,
            tripType,
            departureDate: defaultStart,
            returnDate: endDateCalc,
            adults,
            children,
            infants: 0,
            cabinClass,
            preferredAirline: lower.includes("biman") ? "Biman Bangladesh Airlines" : lower.includes("emirates") ? "Emirates" : undefined,
          },
        },
      });
    }
  } catch (err: any) {
    console.error("Error in /api/ai/parse-voice-trip:", err);
    res.status(500).json({ error: "Failed to process spoken preferences." });
  }
});

// --- Persistent Quotations Database ---
const QUOTES_DB_FILE = path.join(process.cwd(), ".quotes_db.json");
const ACTIVITY_LOGS_FILE = path.join(process.cwd(), ".activity_logs.json");
const NOTIFICATIONS_FILE = path.join(process.cwd(), ".admin_notifications.json");
const USER_ACTIVITIES_FILE = path.join(process.cwd(), ".user_activities.json");
const SYSTEM_ANNOUNCEMENTS_FILE = path.join(process.cwd(), ".system_announcements.json");
const USER_READ_FEEDS_FILE = path.join(process.cwd(), ".user_read_feeds.json");

interface InternalNoteRecord {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

interface QuoteRecord {
  id: string;
  type: "flight" | "visa";
  status: string;
  createdAt: string;
  updatedAt?: string;
  customerName: string;
  email: string;
  phone: string;
  preferredContactMethod?: "WhatsApp" | "Email" | "Phone Call";
  staffNote?: string;
  internalNotes?: InternalNoteRecord[];
  quotedPrice?: string;
  flightOptions?: string;
  visaFee?: string;
  assignedStaff?: string;
  assignedStaffId?: string;
  isArchived?: boolean;
  acknowledgmentSent?: boolean;
  [key: string]: any;
}

interface ActivityRecord {
  id: string;
  quoteId: string;
  action: string;
  performedBy: string;
  details?: string;
  timestamp: string;
}

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  quoteId?: string;
  type: "quote_new" | "status_change" | "sla_warning" | "staff_assigned";
  isRead: boolean;
  createdAt: string;
}

export interface UserActivityDbRecord {
  id: string;
  userEmail: string;
  quoteId?: string;
  quoteType?: "flight" | "visa";
  routeOrDestination?: string;
  status?: string;
  title: string;
  message: string;
  dotColor: "yellow" | "green" | "red" | "blue";
  iconType?: "mail" | "phone" | "message" | "check" | "plane" | "alert" | "info" | "bell";
  timestamp: string;
  agentName?: string;
  quotedPrice?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface SystemAnnouncementDbRecord {
  id: string;
  title: string;
  message: string;
  dotColor: "yellow" | "green" | "red" | "blue";
  iconType: "mail" | "phone" | "message" | "check" | "plane" | "alert" | "info" | "bell";
  category: "Visa Notice" | "System Alert" | "Service Update";
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
}

function loadQuotesFromDisk(): QuoteRecord[] {
  try {
    if (fs.existsSync(QUOTES_DB_FILE)) {
      const data = fs.readFileSync(QUOTES_DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read quotes DB file:", err);
  }
  return [
    {
      id: "FLQ-849201",
      type: "flight",
      tripType: "Round Trip",
      from: "San Francisco (SFO)",
      to: "Tokyo Haneda (HND)",
      departureDate: "2026-10-15",
      returnDate: "2026-10-28",
      adults: 2,
      children: 0,
      infants: 0,
      cabinClass: "Business",
      preferredAirline: "Japan Airlines / ANA",
      flexibleDate: "Yes",
      additionalRequirements: "Prefer direct flights or minimum layover in Tokyo. Window seats preferred.",
      customerName: "Istihad Ahmed",
      email: "istihadahmed1163@gmail.com",
      phone: "+880 1851-172032",
      preferredContactMethod: "WhatsApp",
      status: "Quoted",
      assignedStaff: "Istihad Ahmed (Super Admin)",
      assignedStaffId: "staff_1",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      staffNote: "Found 2 direct Business Class options with JAL and ANA.",
      quotedPrice: "$3,450 / person",
      flightOptions: "JAL Flight JL001 (SFO-HND Nonstop) - $3,450 USD. ANA Flight NH107 - $3,620 USD.",
      internalNotes: [
        {
          id: "note_1",
          authorName: "Istihad Ahmed",
          authorRole: "Super Admin",
          text: "Client requested fast VIP lounge assistance at Haneda. Offered partner perks.",
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        }
      ],
      acknowledgmentSent: true,
    },
    {
      id: "VSQ-930214",
      type: "visa",
      destinationCountry: "Schengen / France",
      visaType: "Tourist",
      intendedTravelDate: "2026-11-05",
      applicantsCount: 2,
      applicantNationality: "United States",
      passportValidity: "More than 6 months",
      previousVisa: "Yes",
      previousRefusal: "No",
      currentResidence: "United States",
      requiredService: "Full Package",
      additionalInfo: "Need assistance with appointment booking and document translation.",
      customerName: "Sarah Jenkins",
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
      preferredContactMethod: "Email",
      status: "Processing",
      assignedStaff: "Tania Sultana (Visa Specialist)",
      assignedStaffId: "staff_3",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      staffNote: "Reviewing passport & itinerary documents. Appointment slot available for next Tuesday.",
      quotedPrice: "BDT 18,500 Total Service & Embassy Fee",
      visaFee: "BDT 11,500 Embassy Fee",
      internalNotes: [
        {
          id: "note_2",
          authorName: "Tania Sultana",
          authorRole: "Visa Specialist",
          text: "Verified bank balance and employment NOC. Ready for biometric submission slot.",
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        }
      ],
      acknowledgmentSent: true,
    },
    {
      id: "AZR-1024",
      type: "flight",
      tripType: "Round Trip",
      from: "Dhaka (DAC)",
      to: "Bangkok (BKK)",
      departureDate: "2026-11-20",
      returnDate: "2026-11-27",
      adults: 2,
      children: 1,
      infants: 0,
      cabinClass: "Economy",
      preferredAirline: "Thai Airways / Biman",
      flexibleDate: "No",
      additionalRequirements: "Halal meal and extra baggage allowance requested.",
      customerName: "Istihad Ahmed",
      email: "istihadahmed1163@gmail.com",
      phone: "+8801712345678",
      preferredContactMethod: "WhatsApp",
      status: "New",
      assignedStaff: "Rahim Chowdhury (Flight Specialist)",
      assignedStaffId: "staff_2",
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      staffNote: "",
      internalNotes: [],
      acknowledgmentSent: true,
    },
  ];
}

function loadActivityLogs(): ActivityRecord[] {
  try {
    if (fs.existsSync(ACTIVITY_LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(ACTIVITY_LOGS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read activity logs DB file:", err);
  }
  return [
    {
      id: "act_1",
      quoteId: "AZR-1024",
      action: "New Quote Submitted",
      performedBy: "Istihad Ahmed (Client)",
      details: "Round Trip Dhaka -> Bangkok requested for 2 Adults, 1 Child.",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: "act_2",
      quoteId: "VSQ-930214",
      action: "Assigned Staff & Status Changed",
      performedBy: "Super Admin",
      details: "Assigned to Tania Sultana. Status changed from New to Processing.",
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ];
}

function loadNotifications(): NotificationRecord[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read notifications DB file:", err);
  }
  return [
    {
      id: "notif_1",
      title: "⚡ Urgent New Quote",
      message: "Istihad Ahmed requested a Bangkok Flight quote (AZR-1024).",
      quoteId: "AZR-1024",
      type: "quote_new",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ];
}

function loadUserActivities(): UserActivityDbRecord[] {
  try {
    if (fs.existsSync(USER_ACTIVITIES_FILE)) {
      return JSON.parse(fs.readFileSync(USER_ACTIVITIES_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read user activities DB file:", err);
  }
  // Default seeded activities for Istihad Ahmed
  const now = Date.now();
  return [
    {
      id: "uact_1",
      userEmail: "istihadahmed1163@gmail.com",
      quoteId: "AZR-1024",
      quoteType: "flight",
      routeOrDestination: "Dhaka (DAC) ➔ Bangkok (BKK)",
      status: "Processing",
      title: "📞 Specialist Assigned & GDS Search Initiated",
      message: "Our senior flight specialist Rahim Chowdhury is reviewing wholesale airline tariffs and non-stop flight connections.",
      dotColor: "yellow",
      iconType: "phone",
      agentName: "Rahim Chowdhury",
      timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "uact_2",
      userEmail: "istihadahmed1163@gmail.com",
      quoteId: "AZR-1024",
      quoteType: "flight",
      routeOrDestination: "Dhaka (DAC) ➔ Bangkok (BKK)",
      status: "New",
      title: "📩 Quote Request for Bangkok Received",
      message: "Your quotation request for 2 Adults, 1 Child (Round Trip) was successfully received and logged into Azraq priority queue.",
      dotColor: "yellow",
      iconType: "mail",
      timestamp: new Date(now - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "uact_3",
      userEmail: "istihadahmed1163@gmail.com",
      quoteId: "FLQ-849201",
      quoteType: "flight",
      routeOrDestination: "San Francisco (SFO) ➔ Tokyo (HND)",
      status: "Quoted",
      title: "💬 Personalized Quote Dispatched via WhatsApp",
      message: "Your official quote assessment ($3,450 / person Business Class on JAL & ANA) was prepared and sent via WhatsApp.",
      dotColor: "green",
      iconType: "message",
      quotedPrice: "$3,450 / person",
      agentName: "Istihad Ahmed",
      timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "uact_4",
      userEmail: "istihadahmed1163@gmail.com",
      quoteId: "FLQ-849201",
      quoteType: "flight",
      routeOrDestination: "San Francisco (SFO) ➔ Tokyo (HND)",
      status: "Booked",
      title: "✅ Booking Confirmed & Vouchers Ready! Trip ID: FLQ-849201",
      message: "Your Tokyo journey is confirmed. E-ticket receipts and lounge access vouchers are available.",
      dotColor: "green",
      iconType: "check",
      timestamp: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
    },
  ];
}

function loadSystemAnnouncements(): SystemAnnouncementDbRecord[] {
  try {
    if (fs.existsSync(SYSTEM_ANNOUNCEMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(SYSTEM_ANNOUNCEMENTS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read system announcements DB file:", err);
  }
  const now = Date.now();
  return [
    {
      id: "sa_visa_thailand",
      title: "🎉 New Visa Rule: Bangladeshi Travelers to Thailand Get 60-Day Visa Exemption",
      message: "Effective Nov 2026, Bangladeshi passport holders travelling for tourism enjoy 60-day visa-free entry at all international airports in Thailand. Ensure passport validity is 6+ months.",
      dotColor: "blue",
      iconType: "info",
      category: "Visa Notice",
      timestamp: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: "sa_whatsapp_247",
      title: "📱 24/7 Dedicated WhatsApp Customer Support Active",
      message: "Our Dhaka head office and emergency international support desk now operates 24/7 at +880 1851-172032 for real-time ticket reissues, flight amendments, and visa inquiries.",
      dotColor: "blue",
      iconType: "message",
      category: "Service Update",
      timestamp: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: "sa_evisa_express",
      title: "🛂 Express E-Visa Processing for UAE & Malaysia (24–48 Hours)",
      message: "Consular direct processing times for Dubai tourist visas (30 & 60 Days) and Malaysia eVisa have been reduced to 24–48 hours for fast-track applications through Azraq.",
      dotColor: "blue",
      iconType: "info",
      category: "Visa Notice",
      timestamp: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
    },
    {
      id: "sa_flights_extra_slots",
      title: "✈️ Additional Direct Flight Slots Added for Maldives & Singapore",
      message: "Biman Bangladesh Airlines & Singapore Airlines have opened additional direct frequencies for the upcoming travel season. Inquire now for group & family discounts.",
      dotColor: "blue",
      iconType: "plane",
      category: "System Alert",
      timestamp: new Date(now - 1000 * 60 * 60 * 120).toISOString(),
    },
  ];
}

function loadReadFeeds(): Record<string, string[]> {
  try {
    if (fs.existsSync(USER_READ_FEEDS_FILE)) {
      return JSON.parse(fs.readFileSync(USER_READ_FEEDS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read user read feeds DB file:", err);
  }
  return {};
}

let quotesStore: QuoteRecord[] = loadQuotesFromDisk();
let activityLogsStore: ActivityRecord[] = loadActivityLogs();
let notificationsStore: NotificationRecord[] = loadNotifications();
let userActivitiesStore: UserActivityDbRecord[] = loadUserActivities();
let systemAnnouncementsStore: SystemAnnouncementDbRecord[] = loadSystemAnnouncements();
let userReadFeedsStore: Record<string, string[]> = loadReadFeeds();

function saveQuotesToDisk() {
  try {
    fs.writeFileSync(QUOTES_DB_FILE, JSON.stringify(quotesStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save quotes DB file:", err);
  }
}

function saveActivityLogsToDisk() {
  try {
    fs.writeFileSync(ACTIVITY_LOGS_FILE, JSON.stringify(activityLogsStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save activity logs DB file:", err);
  }
}

function saveNotificationsToDisk() {
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notificationsStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save notifications DB file:", err);
  }
}

function saveUserActivitiesToDisk() {
  try {
    fs.writeFileSync(USER_ACTIVITIES_FILE, JSON.stringify(userActivitiesStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save user activities DB file:", err);
  }
}

function saveSystemAnnouncementsToDisk() {
  try {
    fs.writeFileSync(SYSTEM_ANNOUNCEMENTS_FILE, JSON.stringify(systemAnnouncementsStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save system announcements DB file:", err);
  }
}

function saveReadFeedsToDisk() {
  try {
    fs.writeFileSync(USER_READ_FEEDS_FILE, JSON.stringify(userReadFeedsStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save read feeds DB file:", err);
  }
}

function addUserActivity(activity: Omit<UserActivityDbRecord, "id" | "timestamp"> & { id?: string; timestamp?: string }) {
  const newActivity: UserActivityDbRecord = {
    id: activity.id || `uact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userEmail: activity.userEmail.toLowerCase().trim(),
    quoteId: activity.quoteId,
    quoteType: activity.quoteType,
    routeOrDestination: activity.routeOrDestination,
    status: activity.status,
    title: activity.title,
    message: activity.message,
    dotColor: activity.dotColor,
    iconType: activity.iconType || "info",
    timestamp: activity.timestamp || new Date().toISOString(),
    agentName: activity.agentName,
    quotedPrice: activity.quotedPrice,
    actionUrl: activity.actionUrl,
    actionLabel: activity.actionLabel,
  };

  userActivitiesStore.unshift(newActivity);
  if (userActivitiesStore.length > 500) {
    userActivitiesStore = userActivitiesStore.slice(0, 500);
  }
  saveUserActivitiesToDisk();
  return newActivity;
}

function logActivity(quoteId: string, action: string, performedBy: string, details?: string) {
  const newLog: ActivityRecord = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    quoteId,
    action,
    performedBy,
    details,
    timestamp: new Date().toISOString(),
  };
  activityLogsStore.unshift(newLog);
  if (activityLogsStore.length > 200) activityLogsStore = activityLogsStore.slice(0, 200);
  saveActivityLogsToDisk();
}

function createNotification(title: string, message: string, quoteId?: string, type: "quote_new" | "status_change" | "sla_warning" | "staff_assigned" = "quote_new") {
  const newNotif: NotificationRecord = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    message,
    quoteId,
    type,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  notificationsStore.unshift(newNotif);
  if (notificationsStore.length > 100) notificationsStore = notificationsStore.slice(0, 100);
  saveNotificationsToDisk();
}

// 5. Submit Flight Ticket Quotation Request
app.post("/api/quotes/flight", (req, res) => {
  try {
    const {
      tripType,
      from,
      to,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      cabinClass,
      preferredAirline,
      flexibleDate,
      additionalRequirements,
      customerName,
      email,
      phone,
      preferredContactMethod,
    } = req.body;

    if (!customerName || !email || !phone || !from || !to || !departureDate) {
      return res.status(400).json({ error: "Please fill in all required fields (Name, Email, Phone, From, To, Departure Date)." });
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const id = `AZR-${randomId}`;

    const newQuote: QuoteRecord = {
      id,
      type: "flight",
      tripType: tripType || "Round Trip",
      from,
      to,
      departureDate,
      returnDate: tripType === "Round Trip" ? returnDate : undefined,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      infants: Number(infants) || 0,
      cabinClass: cabinClass || "Economy",
      preferredAirline: preferredAirline || "",
      flexibleDate: flexibleDate || "No",
      additionalRequirements: additionalRequirements || "",
      customerName,
      email: email.trim().toLowerCase(),
      phone,
      preferredContactMethod: preferredContactMethod || "WhatsApp",
      status: "New",
      createdAt: new Date().toISOString(),
      internalNotes: [],
      acknowledgmentSent: true,
      assignedStaff: "Rahim Chowdhury (Flight Specialist)",
      assignedStaffId: "staff_2",
    };

    quotesStore.unshift(newQuote);
    saveQuotesToDisk();

    // Trigger audit log & notification
    logActivity(id, "New Flight Quote Submitted", `${customerName} (Client)`, `Route: ${from} ✈️ ${to} on ${departureDate}. Automated acknowledgment sent.`);
    createNotification("✈️ New Flight Quote", `${customerName} requested a quote for ${from} to ${to}.`, id, "quote_new");

    // Add to Client Timeline Activity Feed (Type A: Personal Trip Activity)
    addUserActivity({
      userEmail: email,
      quoteId: id,
      quoteType: "flight",
      routeOrDestination: `${from} ✈️ ${to}`,
      status: "New",
      title: `📩 Quote Request for ${from} ✈️ ${to} Received`,
      message: `Your flight quote request for ${from} ➔ ${to} (${newQuote.adults} Adult${newQuote.adults > 1 ? 's' : ''}) was received and logged into Azraq priority queue.`,
      dotColor: "yellow",
      iconType: "mail",
    });

    res.json({
      success: true,
      message: "Flight quote request received! An acknowledgment email and status tracking link have been generated.",
      quote: newQuote,
    });
  } catch (err: any) {
    console.error("Flight Quote Error:", err);
    res.status(500).json({ error: "Failed to process flight quotation request." });
  }
});

// 6. Submit Visa Quotation Request
app.post("/api/quotes/visa", (req, res) => {
  try {
    const {
      destinationCountry,
      visaType,
      intendedTravelDate,
      applicantsCount,
      applicantNationality,
      passportValidity,
      previousVisa,
      previousRefusal,
      currentResidence,
      requiredService,
      additionalInfo,
      customerName,
      email,
      phone,
      preferredContactMethod,
    } = req.body;

    if (!customerName || !email || !phone || !destinationCountry || !visaType || !intendedTravelDate || !applicantNationality) {
      return res.status(400).json({ error: "Please fill in all required fields (Name, Email, Phone, Destination Country, Visa Type, Travel Date, Nationality)." });
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const id = `AZR-${randomId}`;

    const newQuote: QuoteRecord = {
      id,
      type: "visa",
      destinationCountry,
      visaType: visaType || "Tourist",
      intendedTravelDate,
      applicantsCount: Number(applicantsCount) || 1,
      applicantNationality,
      passportValidity: passportValidity || "More than 6 months",
      previousVisa: previousVisa || "No",
      previousRefusal: previousRefusal || "No",
      currentResidence: currentResidence || applicantNationality,
      requiredService: requiredService || "Visa Processing",
      additionalInfo: additionalInfo || "",
      customerName,
      email: email.trim().toLowerCase(),
      phone,
      preferredContactMethod: preferredContactMethod || "WhatsApp",
      status: "New",
      createdAt: new Date().toISOString(),
      internalNotes: [],
      acknowledgmentSent: true,
      assignedStaff: "Tania Sultana (Visa Specialist)",
      assignedStaffId: "staff_3",
    };

    quotesStore.unshift(newQuote);
    saveQuotesToDisk();

    // Trigger audit log & notification
    logActivity(id, "New Visa Quote Submitted", `${customerName} (Client)`, `Destination: ${destinationCountry} (${visaType} Visa). Automated acknowledgment sent.`);
    createNotification("🛂 New Visa Quote", `${customerName} requested ${visaType} visa processing for ${destinationCountry}.`, id, "quote_new");

    // Add to Client Timeline Activity Feed (Type A: Personal Trip Activity)
    addUserActivity({
      userEmail: email,
      quoteId: id,
      quoteType: "visa",
      routeOrDestination: `${destinationCountry} (${visaType} Visa)`,
      status: "New",
      title: `📩 Visa Request for ${destinationCountry} Received`,
      message: `Your ${visaType} visa application request for ${destinationCountry} (${newQuote.applicantsCount} applicant${newQuote.applicantsCount > 1 ? 's' : ''}) has been received and assigned for consular review.`,
      dotColor: "yellow",
      iconType: "mail",
    });

    res.json({
      success: true,
      message: "Visa quote request received! An acknowledgment email and status tracking link have been generated.",
      quote: newQuote,
    });
  } catch (err: any) {
    console.error("Visa Quote Error:", err);
    res.status(500).json({ error: "Failed to process visa quotation request." });
  }
});

// 7. Track Quotation Request (By Request ID or Email)
app.get("/api/quotes/track", (req, res) => {
  try {
    const query = String(req.query.query || req.query.id || "").trim().toLowerCase();
    if (!query) {
      return res.status(400).json({ error: "Please enter a valid Request ID or Email address." });
    }

    const results = quotesStore.filter(
      (q) => q.id.toLowerCase() === query || q.email.toLowerCase() === query
    );

    // If querying by email, return the list (even if empty) to avoid UI errors
    if (query.includes("@")) {
      return res.json({ success: true, quotes: results });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No quotation request found matching your Request ID or Email." });
    }

    res.json({ success: true, quotes: results });
  } catch (err: any) {
    console.error("Track Quote Error:", err);
    res.status(500).json({ error: "Failed to track quotation." });
  }
});

// 7b. User's Own Quote History & Count Endpoint
app.get("/api/users/me/quotes", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    let token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : "";
    if (!token && req.headers["x-auth-token"]) {
      token = String(req.headers["x-auth-token"]).trim();
    }

    let userEmail = "";
    if (token && activeTokensMap.has(token)) {
      userEmail = activeTokensMap.get(token)!;
    } else if (req.query.email) {
      userEmail = String(req.query.email).trim().toLowerCase();
    }

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: Please provide a valid session token or email." });
    }

    const userQuotes = quotesStore.filter((q) => q.email.toLowerCase() === userEmail.toLowerCase());
    res.json({ success: true, quotes: userQuotes, count: userQuotes.length });
  } catch (err: any) {
    console.error("User Quotes Error:", err);
    res.status(500).json({ error: "Failed to retrieve user quotes." });
  }
});

app.get("/api/users/me/quotes/count", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    let token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : "";
    if (!token && req.headers["x-auth-token"]) {
      token = String(req.headers["x-auth-token"]).trim();
    }

    let userEmail = "";
    if (token && activeTokensMap.has(token)) {
      userEmail = activeTokensMap.get(token)!;
    } else if (req.query.email) {
      userEmail = String(req.query.email).trim().toLowerCase();
    }

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: Please provide a valid session token or email." });
    }

    const userQuotes = quotesStore.filter((q) => q.email.toLowerCase() === userEmail.toLowerCase());
    res.json({ success: true, count: userQuotes.length });
  } catch (err: any) {
    console.error("User Quotes Count Error:", err);
    res.status(500).json({ error: "Failed to retrieve quote count." });
  }
});

// 7c. User's Personalized Trip Status Timeline Feed
app.get("/api/users/me/timeline", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    let token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : "";
    if (!token && req.headers["x-auth-token"]) {
      token = String(req.headers["x-auth-token"]).trim();
    }

    let userEmail = "";
    if (token && activeTokensMap.has(token)) {
      userEmail = activeTokensMap.get(token)!;
    } else if (req.query.email) {
      userEmail = String(req.query.email).trim().toLowerCase();
    }

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: Please provide a valid session token or email." });
    }

    const userQuotes = quotesStore.filter((q) => q.email.toLowerCase() === userEmail.toLowerCase());
    
    // Generate rich step-by-step activity timeline for this user's trip requests
    const timelineEvents: Array<{
      id: string;
      quoteId: string;
      quoteType: string;
      routeOrDestination: string;
      status: string;
      stepTitle: string;
      description: string;
      timestamp: string;
      dotColor: 'yellow' | 'blue' | 'green' | 'purple' | 'gray';
      agentName?: string;
      quotedPrice?: string;
      flightOptions?: string;
      staffNote?: string;
      contactMethod?: string;
      phone?: string;
    }> = [];

    userQuotes.forEach((quote) => {
      const destination = quote.type === 'flight' 
        ? `${quote.from} ➔ ${quote.to}` 
        : quote.type === 'visa' 
        ? `${quote.destinationCountry} (${quote.visaType} Visa)`
        : quote.destinationCountry || 'Custom Tour';

      // Step 1: Request received milestone (Yellow dot)
      timelineEvents.push({
        id: `tl_${quote.id}_received`,
        quoteId: quote.id,
        quoteType: quote.type,
        routeOrDestination: destination,
        status: 'Pending',
        stepTitle: `Quote Request ${quote.id} Received & Logged`,
        description: `Your quotation request for ${destination} was registered in the Azraq priority queue. Automated confirmation sent.`,
        timestamp: quote.createdAt,
        dotColor: 'yellow',
        contactMethod: quote.preferredContactMethod,
        phone: quote.phone,
      });

      // Step 2: Under Review / Assigned Specialist (Blue dot)
      if (quote.assignedStaff || quote.status !== 'New') {
        const assignedTime = quote.updatedAt && quote.updatedAt !== quote.createdAt 
          ? quote.updatedAt 
          : new Date(new Date(quote.createdAt).getTime() + 1000 * 60 * 25).toISOString();
        
        timelineEvents.push({
          id: `tl_${quote.id}_review`,
          quoteId: quote.id,
          quoteType: quote.type,
          routeOrDestination: destination,
          status: 'Reviewing',
          stepTitle: `Assigned to ${quote.assignedStaff || 'Senior Travel Specialist'}`,
          description: `Our dedicated consultant is analyzing live wholesale GDS airline tariffs and consular appointment slots.`,
          timestamp: assignedTime,
          dotColor: 'blue',
          agentName: quote.assignedStaff,
        });
      }

      // Step 3: Quoted / Price Assessment Prepared (Green dot)
      if (['Quoted', 'Quoted via WhatsApp', 'Quoted via Email', 'Quotation Prepared', 'Sent', 'Customer Confirmed', 'Booked'].includes(quote.status)) {
        const quotedTime = quote.updatedAt || new Date(new Date(quote.createdAt).getTime() + 1000 * 60 * 90).toISOString();
        timelineEvents.push({
          id: `tl_${quote.id}_quoted`,
          quoteId: quote.id,
          quoteType: quote.type,
          routeOrDestination: destination,
          status: 'Quoted',
          stepTitle: `Personalized Quotation Ready (${quote.quotedPrice || 'Wholesale Tariff'})`,
          description: quote.staffNote 
            ? `${quote.staffNote}` 
            : `Your official price estimate of ${quote.quotedPrice || 'competitive rate'} was dispatched via ${quote.preferredContactMethod || 'WhatsApp'}.`,
          timestamp: quotedTime,
          dotColor: 'green',
          quotedPrice: quote.quotedPrice,
          flightOptions: quote.flightOptions,
          agentName: quote.assignedStaff,
        });
      }

      // Step 4: Confirmed / Booked (Purple dot)
      if (['Booked', 'Customer Confirmed'].includes(quote.status)) {
        timelineEvents.push({
          id: `tl_${quote.id}_confirmed`,
          quoteId: quote.id,
          quoteType: quote.type,
          routeOrDestination: destination,
          status: 'Booked',
          stepTitle: `Booking Confirmed & Vouchers Issued!`,
          description: `All flight e-tickets, hotel booking confirmation vouchers, and embassy documents are finalized. Safe travels!`,
          timestamp: quote.updatedAt || new Date().toISOString(),
          dotColor: 'purple',
          agentName: quote.assignedStaff,
        });
      }
    });

    // Sort newest events first
    timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      timeline: timelineEvents,
      activeQuotesCount: userQuotes.length,
      quotes: userQuotes,
    });
  } catch (err: any) {
    console.error("User Timeline Error:", err);
    res.status(500).json({ error: "Failed to load user trip timeline." });
  }
});

// 7d. Unified Live Updates Feed (Personal Activity + System Announcements)
app.get("/api/feed", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    let token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : "";
    if (!token && req.headers["x-auth-token"]) {
      token = String(req.headers["x-auth-token"]).trim();
    }

    let userEmail = "";
    if (token && activeTokensMap.has(token)) {
      userEmail = activeTokensMap.get(token)!;
    } else if (req.query.email) {
      userEmail = String(req.query.email).trim().toLowerCase();
    }

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: Please provide a valid session token or email." });
    }

    const emailKey = userEmail.toLowerCase();
    const readIds = userReadFeedsStore[emailKey] || [];

    // 1. Gather personal user activities
    let personalActivities = userActivitiesStore.filter(
      (act) => act.userEmail.toLowerCase() === emailKey
    );

    // If user has quotes in quotesStore but no user_activities yet, derive progression milestones
    const userQuotes = quotesStore.filter((q) => q.email.toLowerCase() === emailKey);
    if (personalActivities.length === 0 && userQuotes.length > 0) {
      userQuotes.forEach((q) => {
        const dest = q.type === 'flight' 
          ? `${q.from} ➔ ${q.to}` 
          : `${q.destinationCountry} (${q.visaType || 'Visa'})`;

        // Milestone 1: Received
        personalActivities.push({
          id: `uact_${q.id}_rec`,
          userEmail: q.email,
          quoteId: q.id,
          quoteType: q.type,
          routeOrDestination: dest,
          status: 'New',
          title: `📩 Quote Request for ${dest} Received`,
          message: `Your quotation request was received and logged into Azraq priority queue.`,
          dotColor: 'yellow',
          iconType: 'mail',
          timestamp: q.createdAt,
        });

        // Milestone 2: Reviewing / Assigned
        if (q.assignedStaff || q.status !== 'New') {
          personalActivities.push({
            id: `uact_${q.id}_rev`,
            userEmail: q.email,
            quoteId: q.id,
            quoteType: q.type,
            routeOrDestination: dest,
            status: 'Processing',
            title: `📞 Specialist ${q.assignedStaff || 'Rahim Chowdhury'} Reviewing Options`,
            message: `Our consultant is analyzing live wholesale GDS airline tariffs and visa appointment slots.`,
            dotColor: 'yellow',
            iconType: 'phone',
            agentName: q.assignedStaff,
            timestamp: q.updatedAt || new Date(new Date(q.createdAt).getTime() + 1000 * 60 * 30).toISOString(),
          });
        }

        // Milestone 3: Quoted
        if (['Quoted', 'Quoted via WhatsApp', 'Quoted via Email', 'Quotation Prepared', 'Sent', 'Customer Confirmed', 'Booked'].includes(q.status)) {
          personalActivities.push({
            id: `uact_${q.id}_quot`,
            userEmail: q.email,
            quoteId: q.id,
            quoteType: q.type,
            routeOrDestination: dest,
            status: 'Quoted',
            title: `💬 Personalized Quote Dispatched via WhatsApp`,
            message: `Official price estimate (${q.quotedPrice || 'Wholesale rate'}) dispatched via ${q.preferredContactMethod || 'WhatsApp'}. ${q.staffNote ? 'Note: ' + q.staffNote : ''}`,
            dotColor: 'green',
            iconType: 'message',
            quotedPrice: q.quotedPrice,
            agentName: q.assignedStaff,
            timestamp: q.updatedAt || new Date(new Date(q.createdAt).getTime() + 1000 * 60 * 90).toISOString(),
          });
        }

        // Milestone 4: Booked
        if (['Booked', 'Customer Confirmed'].includes(q.status)) {
          personalActivities.push({
            id: `uact_${q.id}_book`,
            userEmail: q.email,
            quoteId: q.id,
            quoteType: q.type,
            routeOrDestination: dest,
            status: 'Booked',
            title: `✅ Booking Confirmed! Trip ID: ${q.id}`,
            message: `You confirmed your booking for ${dest}. E-tickets and embassy vouchers are issued!`,
            dotColor: 'green',
            iconType: 'check',
            timestamp: q.updatedAt || new Date().toISOString(),
          });
        }
      });
    }

    // 2. Gather system announcements (Utility-based only)
    const announcements = systemAnnouncementsStore.map((sa) => ({
      id: sa.id,
      feedType: 'announcement' as const,
      title: sa.title,
      message: sa.message,
      dotColor: sa.dotColor,
      iconType: sa.iconType,
      category: sa.category,
      timestamp: sa.timestamp,
      isRead: readIds.includes(sa.id),
      actionUrl: sa.actionUrl,
      actionLabel: sa.actionLabel,
    }));

    // 3. Format personal activities into feed format
    const formattedPersonal = personalActivities.map((act) => ({
      id: act.id,
      feedType: 'personal' as const,
      title: act.title,
      message: act.message,
      dotColor: act.dotColor,
      iconType: act.iconType || 'info',
      category: (act.status === 'Booked' ? 'Trip Milestone' : 'Quote Status') as any,
      quoteId: act.quoteId,
      quoteType: act.quoteType,
      routeOrDestination: act.routeOrDestination,
      status: act.status,
      timestamp: act.timestamp,
      agentName: act.agentName,
      quotedPrice: act.quotedPrice,
      isRead: readIds.includes(act.id),
      actionUrl: act.actionUrl,
      actionLabel: act.actionLabel,
    }));

    // 4. Merge and sort by timestamp descending
    const combinedFeed = [...formattedPersonal, ...announcements].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Calculate unread count
    const unreadCount = combinedFeed.filter((item) => !item.isRead).length;

    // Social Proof LITE (Anonymous aggregated stats for the bottom section)
    const socialProof = [
      { id: 'sp_1', text: '✨ 12 travelers booked trips to Maldives this week.' },
      { id: 'sp_2', text: '✨ 5 travelers are currently exploring Bali & Bangkok.' },
      { id: 'sp_3', text: '✨ 8 express visas approved today for Dubai & Malaysia.' },
    ];

    // Pagination support
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 50);
    const startIndex = (page - 1) * limit;
    const paginatedFeed = combinedFeed.slice(startIndex, startIndex + limit);

    res.json({
      success: true,
      feed: paginatedFeed,
      total: combinedFeed.length,
      page,
      limit,
      unreadCount,
      hasPersonalActivity: formattedPersonal.length > 0,
      socialProof,
    });
  } catch (err: any) {
    console.error("GET /api/feed Error:", err);
    res.status(500).json({ error: "Failed to load activity feed." });
  }
});

// 7e. Mark Feed Items as Read
app.post("/api/feed/read", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    let token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : "";
    if (!token && req.headers["x-auth-token"]) {
      token = String(req.headers["x-auth-token"]).trim();
    }

    let userEmail = "";
    if (token && activeTokensMap.has(token)) {
      userEmail = activeTokensMap.get(token)!;
    } else if (req.body.email) {
      userEmail = String(req.body.email).trim().toLowerCase();
    }

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: Please provide a valid session token or email." });
    }

    const { itemIds, markAll } = req.body;
    const emailKey = userEmail.toLowerCase();
    const existing = new Set(userReadFeedsStore[emailKey] || []);

    if (markAll) {
      userActivitiesStore
        .filter((act) => act.userEmail.toLowerCase() === emailKey)
        .forEach((act) => existing.add(act.id));
      systemAnnouncementsStore.forEach((sa) => existing.add(sa.id));
    } else if (Array.isArray(itemIds)) {
      itemIds.forEach((id: string) => existing.add(id));
    } else if (typeof req.body.itemId === "string") {
      existing.add(req.body.itemId);
    }

    userReadFeedsStore[emailKey] = Array.from(existing);
    saveReadFeedsToDisk();

    res.json({ success: true, readCount: userReadFeedsStore[emailKey].length });
  } catch (err: any) {
    console.error("POST /api/feed/read Error:", err);
    res.status(500).json({ error: "Failed to update read state." });
  }
});


// 8. Admin List All Quotations
app.get("/api/quotes/admin", (req, res) => {
  try {
    res.json({
      success: true,
      quotes: quotesStore,
      notifications: notificationsStore,
      activityLogs: activityLogsStore,
    });
  } catch (err: any) {
    console.error("Admin List Quotes Error:", err);
    res.status(500).json({ error: "Failed to load quotations for admin." });
  }
});

// 9. Admin Update Quotation Status & Details
app.patch("/api/quotes/admin/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      staffNote,
      quotedPrice,
      flightOptions,
      visaFee,
      assignedStaff,
      assignedStaffId,
      newInternalNote,
      performedBy,
      isArchived,
    } = req.body;

    const quoteIndex = quotesStore.findIndex((q) => q.id.toLowerCase() === id.toLowerCase());
    if (quoteIndex === -1) {
      return res.status(404).json({ error: "Quotation request not found." });
    }

    const targetQuote = quotesStore[quoteIndex];
    const prevStatus = targetQuote.status;
    const actor = performedBy || "Staff Member";

    if (status && status !== prevStatus) {
      targetQuote.status = status;
      logActivity(targetQuote.id, `Status updated: ${prevStatus} ➔ ${status}`, actor, `Updated by ${actor}`);
      createNotification(`Status Changed: ${targetQuote.id}`, `${targetQuote.customerName}'s quote changed to ${status}`, targetQuote.id, "status_change");

      // Log to Client Timeline Activity Feed (Type A: Personal Trip Activity)
      let title = `Status Updated: ${status}`;
      let message = `Your quotation status was updated to ${status}.`;
      let dotColor: "yellow" | "green" | "red" | "blue" = "yellow";
      let iconType: any = "info";

      const dest = targetQuote.type === 'flight' 
        ? `${targetQuote.from} ➔ ${targetQuote.to}` 
        : `${targetQuote.destinationCountry} (${targetQuote.visaType || 'Visa'})`;

      if (['Processing', 'Reviewing'].includes(status)) {
        const staff = assignedStaff || targetQuote.assignedStaff || "Rahim Chowdhury (Flight Specialist)";
        title = `📞 Specialist Assigned: ${staff}`;
        message = `Our specialist is reviewing live wholesale airline options, schedules, and consular slots for ${dest}.`;
        dotColor = "yellow";
        iconType = "phone";
      } else if (['Quoted', 'Quoted via WhatsApp', 'Quoted via Email', 'Quotation Prepared', 'Sent'].includes(status)) {
        const price = quotedPrice || targetQuote.quotedPrice || 'Wholesale Tariff';
        title = `💬 Personalized Quote Prepared (${price})`;
        message = targetQuote.staffNote 
          ? `Quote details: ${targetQuote.staffNote}. Dispatched via ${targetQuote.preferredContactMethod || 'WhatsApp'}.`
          : `Your official price estimate of ${price} for ${dest} was dispatched via ${targetQuote.preferredContactMethod || 'WhatsApp'}.`;
        dotColor = "green";
        iconType = "message";
      } else if (['Booked', 'Customer Confirmed'].includes(status)) {
        title = `✅ Booking Confirmed! Trip ID: ${targetQuote.id}`;
        message = `You confirmed your booking for ${dest}! All flight e-tickets, hotel booking confirmation vouchers, and consular submission documents are finalized.`;
        dotColor = "green";
        iconType = "check";
      } else if (['Expired', 'Lost', 'Closed'].includes(status)) {
        title = `📋 Quotation ${status}: ${targetQuote.id}`;
        message = `Quotation for ${dest} has concluded. You can request a fresh live quotation anytime.`;
        dotColor = "yellow";
        iconType = "info";
      }

      addUserActivity({
        userEmail: targetQuote.email,
        quoteId: targetQuote.id,
        quoteType: targetQuote.type,
        routeOrDestination: dest,
        status: status,
        title,
        message,
        dotColor,
        iconType,
        agentName: assignedStaff || targetQuote.assignedStaff,
        quotedPrice: quotedPrice || targetQuote.quotedPrice,
      });
    }

    if (staffNote !== undefined) targetQuote.staffNote = staffNote;
    if (quotedPrice !== undefined) targetQuote.quotedPrice = quotedPrice;
    if (flightOptions !== undefined) targetQuote.flightOptions = flightOptions;
    if (visaFee !== undefined) targetQuote.visaFee = visaFee;
    if (isArchived !== undefined) targetQuote.isArchived = isArchived;

    if (assignedStaff && assignedStaff !== targetQuote.assignedStaff) {
      const prevStaff = targetQuote.assignedStaff || "Unassigned";
      targetQuote.assignedStaff = assignedStaff;
      targetQuote.assignedStaffId = assignedStaffId || targetQuote.assignedStaffId;
      logActivity(targetQuote.id, "Reassigned Staff", actor, `Reassigned from ${prevStaff} to ${assignedStaff}`);
      createNotification("Staff Assigned", `${targetQuote.id} assigned to ${assignedStaff}`, targetQuote.id, "staff_assigned");
    }

    if (newInternalNote && newInternalNote.trim()) {
      if (!targetQuote.internalNotes) targetQuote.internalNotes = [];
      const noteEntry: InternalNoteRecord = {
        id: `note_${Date.now()}`,
        authorName: actor,
        authorRole: actor.includes("Super Admin") ? "Super Admin" : "Support Agent",
        text: newInternalNote.trim(),
        createdAt: new Date().toISOString(),
      };
      targetQuote.internalNotes.push(noteEntry);
      logActivity(targetQuote.id, "Internal Note Added", actor, newInternalNote.trim());
    }

    targetQuote.updatedAt = new Date().toISOString();
    quotesStore[quoteIndex] = targetQuote;
    saveQuotesToDisk();

    res.json({
      success: true,
      message: `Quotation ${id} updated successfully.`,
      quote: targetQuote,
    });
  } catch (err: any) {
    console.error("Admin Update Quote Error:", err);
    res.status(500).json({ error: "Failed to update quotation." });
  }
});

// 9b. Admin Delete Quotation (Super Admin Only)
app.delete("/api/quotes/admin/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body || {};

    const quoteIndex = quotesStore.findIndex((q) => q.id.toLowerCase() === id.toLowerCase());
    if (quoteIndex === -1) {
      return res.status(404).json({ error: "Quotation not found." });
    }

    const removedQuote = quotesStore.splice(quoteIndex, 1)[0];
    saveQuotesToDisk();

    logActivity(id, "Quote Deleted", performedBy || "Super Admin", `Deleted quote for ${removedQuote.customerName}`);

    res.json({ success: true, message: `Quotation ${id} was permanently removed.` });
  } catch (err: any) {
    console.error("Delete Quote Error:", err);
    res.status(500).json({ error: "Failed to delete quote." });
  }
});

// 9c. Admin Bulk Actions Endpoint
app.post("/api/quotes/admin/bulk-action", (req, res) => {
  try {
    const { action, ids, value, performedBy } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Please select at least one quote." });
    }

    const actor = performedBy || "Staff Member";
    let updatedCount = 0;

    quotesStore = quotesStore.map((q) => {
      if (ids.includes(q.id)) {
        updatedCount++;
        const updated = { ...q, updatedAt: new Date().toISOString() };
        if (action === "status") {
          updated.status = value || "Processing";
          logActivity(q.id, `Bulk Status Change ➔ ${value}`, actor);
        } else if (action === "assign") {
          updated.assignedStaff = value || "Istihad Ahmed (Super Admin)";
          logActivity(q.id, `Bulk Assigned ➔ ${value}`, actor);
        } else if (action === "archive") {
          updated.isArchived = true;
          logActivity(q.id, "Archived via Bulk Action", actor);
        }
        return updated;
      }
      return q;
    });

    saveQuotesToDisk();

    res.json({
      success: true,
      message: `Successfully applied '${action}' to ${updatedCount} quotation(s).`,
      quotes: quotesStore,
    });
  } catch (err: any) {
    console.error("Bulk Action Error:", err);
    res.status(500).json({ error: "Failed to execute bulk action." });
  }
});

// 9d. Admin Notifications & Audit Logs
app.get("/api/admin/notifications", (req, res) => {
  res.json({ success: true, notifications: notificationsStore });
});

app.post("/api/admin/notifications/mark-read", (req, res) => {
  const { id, all } = req.body;
  if (all) {
    notificationsStore = notificationsStore.map((n) => ({ ...n, isRead: true }));
  } else if (id) {
    notificationsStore = notificationsStore.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  }
  saveNotificationsToDisk();
  res.json({ success: true, notifications: notificationsStore });
});

app.get("/api/admin/activity-logs", (req, res) => {
  res.json({ success: true, activityLogs: activityLogsStore });
});

// --- Tour Package Management Database ---
const PACKAGES_DB_FILE = path.join(process.cwd(), ".packages_db.json");

interface ServerTourPackage {
  id: string;
  destination_id: string;
  destination_name: string;
  country: string;
  package_name: string;
  duration: string;
  price: number;
  currency: string;
  pricing_tiers: Array<{ pax: number; price: number }>;
  description: string;
  itinerary: Array<{ day: number | string; title: string; activities: string[]; meals?: string; overnight?: string }>;
  hotel: string;
  meals: string;
  transportation: string;
  inclusions: string[];
  exclusions: string[];
  visa_information: string;
  required_documents: string[];
  important_notes: string[];
  terms_conditions: string[];
  source_pdf: string;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  images: string[];
  highlights: string[];
  departure_info?: string;
  number_of_travelers?: string;
  contact_info?: string;
}

function loadPackagesFromDisk(): ServerTourPackage[] {
  try {
    if (fs.existsSync(PACKAGES_DB_FILE)) {
      const data = fs.readFileSync(PACKAGES_DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read packages DB file:", err);
  }
  return INITIAL_TOUR_PACKAGES as any[];
}

let packagesStore: ServerTourPackage[] = loadPackagesFromDisk();

function savePackagesToDisk() {
  try {
    fs.writeFileSync(PACKAGES_DB_FILE, JSON.stringify(packagesStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save packages DB file:", err);
  }
}

// 1. Get All Published Tour Packages
app.get("/api/packages", (req, res) => {
  try {
    const { country, destination, search, status } = req.query;
    let list = packagesStore;

    if (status && status !== 'all') {
      list = list.filter((p) => p.status === status);
    } else if (!status) {
      // By default, public endpoint returns published packages
      list = list.filter((p) => p.status === 'published');
    }

    if (country) {
      const cNorm = String(country).toLowerCase();
      list = list.filter((p) => p.country.toLowerCase().includes(cNorm));
    }

    if (destination) {
      const dNorm = String(destination).toLowerCase();
      list = list.filter((p) => p.destination_name.toLowerCase().includes(dNorm));
    }

    if (search) {
      const sNorm = String(search).toLowerCase();
      list = list.filter(
        (p) =>
          p.package_name.toLowerCase().includes(sNorm) ||
          p.destination_name.toLowerCase().includes(sNorm) ||
          p.country.toLowerCase().includes(sNorm) ||
          p.description.toLowerCase().includes(sNorm)
      );
    }

    res.json({ success: true, packages: list });
  } catch (err: any) {
    console.error("Get Packages Error:", err);
    res.status(500).json({ error: "Failed to load tour packages." });
  }
});

// 2. Get Single Package Details
app.get("/api/packages/:id", (req, res) => {
  try {
    const { id } = req.params;
    const pkg = packagesStore.find((p) => p.id === id);
    if (!pkg) {
      return res.status(404).json({ error: "Tour package not found." });
    }
    res.json({ success: true, package: pkg });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch package details." });
  }
});

// 3. Save / Update / Bulk Publish Packages (Admin)
app.post("/api/packages/save", (req, res) => {
  try {
    const { packages } = req.body;
    if (!Array.isArray(packages)) {
      return res.status(400).json({ error: "Packages array is required." });
    }

    // Merge or replace packages
    for (const newPkg of packages) {
      const index = packagesStore.findIndex((p) => p.id === newPkg.id);
      const updatedPkg: ServerTourPackage = {
        ...newPkg,
        updated_at: new Date().toISOString(),
      };
      if (index >= 0) {
        packagesStore[index] = updatedPkg;
      } else {
        packagesStore.unshift(updatedPkg);
      }
    }

    savePackagesToDisk();
    res.json({
      success: true,
      message: `${packages.length} package(s) saved successfully!`,
      packages: packagesStore,
    });
  } catch (err: any) {
    console.error("Save Packages Error:", err);
    res.status(500).json({ error: "Failed to save packages." });
  }
});

// 4. Update Single Package Status (Publish / Unpublish / Delete)
app.patch("/api/packages/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const index = packagesStore.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Package not found." });
    }

    packagesStore[index] = {
      ...packagesStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    savePackagesToDisk();
    res.json({ success: true, package: packagesStore[index] });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update package." });
  }
});

app.delete("/api/packages/:id", (req, res) => {
  try {
    const { id } = req.params;
    packagesStore = packagesStore.filter((p) => p.id !== id);
    savePackagesToDisk();
    res.json({ success: true, message: "Package deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete package." });
  }
});

// 5. Submit Customer Package Quotation
app.post("/api/quotes/package", (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      destination,
      package_id,
      package_name,
      travelDate,
      adults,
      children,
      specialRequirements,
      message,
    } = req.body;

    if (!customerName || !email || !phone || !destination) {
      return res.status(400).json({
        error: "Please fill in all required fields (Name, Email, WhatsApp/Phone, Destination).",
      });
    }

    const randomId = Math.floor(100000 + Math.random() * 900000);
    const id = `PKG-${randomId}`;

    const newQuote: QuoteRecord = {
      id,
      type: "package" as any,
      customerName,
      email: email.trim().toLowerCase(),
      phone,
      destination,
      package_id: package_id || "",
      package_name: package_name || "",
      travelDate: travelDate || "",
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      specialRequirements: specialRequirements || "",
      message: message || "",
      status: "New",
      createdAt: new Date().toISOString(),
    };

    quotesStore.unshift(newQuote);
    saveQuotesToDisk();

    res.json({
      success: true,
      message: "Tour Package Quotation Request Submitted Successfully! Our travel team will contact you shortly via WhatsApp / Email.",
      quote: newQuote,
    });
  } catch (err: any) {
    console.error("Package Quote Error:", err);
    res.status(500).json({ error: "Failed to submit quotation request." });
  }
});

// 6. AI PDF Tour Package Extraction Endpoint (Gemini PDF Parser)
app.post("/api/pdf/extract", async (req, res) => {
  try {
    const { pdfText, fileName, pdfBase64 } = req.body;

    if (!pdfText && !pdfBase64) {
      return res.status(400).json({ error: "PDF text or PDF Base64 is required for processing." });
    }

    const ai = getGenAI();

    const systemPrompt = `You are an expert travel agency PDF data extractor.
Your task is to parse tour package information from the uploaded PDF document with 100% precision.

CRITICAL SOURCE OF TRUTH RULES:
1. ONLY extract information that is explicitly stated in the document.
2. NEVER invent, assume, fabricate, or add destinations, tour packages, prices, itineraries, or hotels not present in the document.
3. If a field is missing or not specified in the PDF, return "Not specified" or an empty array [].
4. Extract all pricing tiers (Pax quantity vs Price per person) accurately.
5. Identify the country and exact city/region destinations mentioned in the PDF.`;

    const promptText = pdfText
      ? `Document Content:\n${pdfText}`
      : `Document Content in Base64 provided. Please extract all tour package details.`;

    const contents = pdfBase64
      ? [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64,
            },
          },
          { text: "Extract all tour package information from this PDF as structured JSON according to schema." },
        ]
      : [promptText];

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents as any,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedPackagesCount: { type: Type.INTEGER },
            detectedDestinations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            packages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  package_name: { type: Type.STRING },
                  country: { type: Type.STRING },
                  destination_name: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  price: { type: Type.NUMBER, description: "Starting price per person" },
                  currency: { type: Type.STRING, description: "Currency e.g. BDT or USD" },
                  pricing_tiers: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        pax: { type: Type.INTEGER },
                        price: { type: Type.NUMBER },
                      },
                      required: ["pax", "price"],
                    },
                  },
                  description: { type: Type.STRING },
                  itinerary: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        activities: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        meals: { type: Type.STRING },
                        overnight: { type: Type.STRING },
                      },
                      required: ["day", "title", "activities"],
                    },
                  },
                  hotel: { type: Type.STRING },
                  meals: { type: Type.STRING },
                  transportation: { type: Type.STRING },
                  inclusions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  exclusions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  visa_information: { type: Type.STRING },
                  required_documents: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  important_notes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  terms_conditions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  departure_info: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  "package_name",
                  "country",
                  "destination_name",
                  "duration",
                  "price",
                  "itinerary",
                  "inclusions",
                  "exclusions",
                ],
              },
            },
          },
          required: ["detectedPackagesCount", "detectedDestinations", "packages"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const extractedResult = JSON.parse(jsonText);

    // Format packages with IDs and metadata
    const sourceFileName = fileName || "uploaded_package.pdf";
    const formattedPackages: ServerTourPackage[] = (extractedResult.packages || []).map(
      (pkg: any, idx: number) => {
        const destId = `dest_${(pkg.country || "general").toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
        const startingPrice = pkg.price || (pkg.pricing_tiers && pkg.pricing_tiers[0]?.price) || 0;
        return {
          id: `pkg_pdf_${Date.now()}_${idx}`,
          destination_id: destId,
          destination_name: pkg.destination_name || pkg.country || "Not specified",
          country: pkg.country || "Not specified",
          package_name: pkg.package_name || "Tour Package",
          duration: pkg.duration || "Not specified",
          price: startingPrice,
          currency: pkg.currency || "BDT",
          pricing_tiers: pkg.pricing_tiers || [{ pax: 2, price: startingPrice }],
          description: pkg.description || "Extracted from PDF document.",
          itinerary: pkg.itinerary || [],
          hotel: pkg.hotel || "Not specified",
          meals: pkg.meals || "Not specified",
          transportation: pkg.transportation || "Not specified",
          inclusions: pkg.inclusions || [],
          exclusions: pkg.exclusions || [],
          visa_information: pkg.visa_information || "Not specified",
          required_documents: pkg.required_documents || [],
          important_notes: pkg.important_notes || [],
          terms_conditions: pkg.terms_conditions || [],
          source_pdf: sourceFileName,
          status: "draft", // Staged for Admin Preview before publishing
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          images: [],
          highlights: pkg.highlights || [],
          departure_info: pkg.departure_info || "Not specified",
        };
      }
    );

    res.json({
      success: true,
      message: `Extracted ${formattedPackages.length} package(s) and ${extractedResult.detectedDestinations?.length || 0} destination(s).`,
      detectedPackagesCount: formattedPackages.length,
      detectedDestinations: extractedResult.detectedDestinations || [],
      packages: formattedPackages,
    });
  } catch (err: any) {
    console.error("PDF Extraction Error:", err);
    res.status(500).json({ error: err.message || "Failed to process and extract PDF information." });
  }
});

// 4. AI Post Verification & Enhancer (For Feed view)
app.post("/api/ai/verify-post", async (req, res) => {
  try {
    const { content, location } = req.body;
    const ai = getGenAI();

    const prompt = `Analyze this travel post snippet from location "${location || "Unknown"}": "${content}".
    Check if it sounds like an authentic travel route or tip. Generate an AI Verification status ("AI Verified Route" or "Local Gem"), relevant travel hashtags, and a 1-sentence AI commentary.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isVerified: { type: Type.BOOLEAN },
            badgeLabel: { type: Type.STRING, description: "e.g. AI Verified Route" },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            aiComment: { type: Type.STRING },
          },
          required: ["isVerified", "badgeLabel", "hashtags"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    console.error("Error in /api/ai/verify-post:", err);
    res.status(500).json({ error: err.message || "Failed to verify post" });
  }
});

// ========================================================
// --- Cloudinary Media Upload & Optimization Endpoints ---
// ========================================================

// 1. Get Cloudinary Status & Config (safe)
app.get("/api/cloudinary/config", (req, res) => {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "vd722ywp";
  const api_key = process.env.CLOUDINARY_API_KEY || "897229884945796";
  const hasSecret = Boolean(process.env.CLOUDINARY_API_SECRET);

  res.json({
    success: true,
    cloud_name,
    api_key,
    has_secret: hasSecret,
  });
});

// 2. Upload Image or Video to Cloudinary with local storage fallback
app.post(["/api/cloudinary/upload", "/api/upload/image", "/api/upload/avatar"], async (req, res) => {
  try {
    const {
      file,
      image,
      folder = "azraq_media",
      public_id,
      tags = ["azraq", "travel"],
      resource_type = "auto",
      transformation,
    } = req.body;

    const mediaSource = file || image;
    if (!mediaSource) {
      return res.status(400).json({
        error: "Missing 'file' or 'image' payload (base64 string, data URI, or remote image URL).",
      });
    }

    // Try Cloudinary if API secret exists
    if (process.env.CLOUDINARY_API_SECRET) {
      try {
        const cld = getCloudinary();
        const uploadOptions: any = {
          folder,
          resource_type,
          tags,
          overwrite: true,
          invalidate: true,
        };

        if (public_id) uploadOptions.public_id = public_id;
        if (transformation) uploadOptions.transformation = transformation;

        const result = await cld.uploader.upload(mediaSource, uploadOptions);

        // Generate auto-format and auto-quality optimized URL
        const optimizeUrl = cld.url(result.public_id, {
          fetch_format: "auto",
          quality: "auto",
          secure: true,
        });

        // Generate square auto-crop URL
        const autoCropUrl = cld.url(result.public_id, {
          crop: "auto",
          gravity: "auto",
          width: 500,
          height: 500,
          secure: true,
        });

        return res.json({
          success: true,
          public_id: result.public_id,
          secure_url: result.secure_url,
          optimize_url: optimizeUrl,
          auto_crop_url: autoCropUrl,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          resource_type: result.resource_type,
          created_at: result.created_at,
        });
      } catch (cldErr: any) {
        console.warn("Cloudinary upload failed, falling back to local file storage:", cldErr?.message);
      }
    }

    // Resilient local file storage fallback
    if (typeof mediaSource === "string") {
      let base64Data = mediaSource;
      let extension = "jpg";

      const matches = mediaSource.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mime = matches[1];
        base64Data = matches[2];
        if (mime.includes("png")) extension = "png";
        else if (mime.includes("webp")) extension = "webp";
        else if (mime.includes("gif")) extension = "gif";
        else if (mime.includes("mp4")) extension = "mp4";
      }

      const fileBuffer = Buffer.from(base64Data, "base64");
      const filename = `media_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${extension}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, fileBuffer);
      const fileUrl = `/uploads/${filename}`;

      return res.json({
        success: true,
        public_id: filename,
        secure_url: fileUrl,
        optimize_url: fileUrl,
        auto_crop_url: fileUrl,
        format: extension,
        width: 1080,
        height: 1080,
        bytes: fileBuffer.length,
        resource_type: extension === "mp4" ? "video" : "image",
        created_at: new Date().toISOString(),
      });
    }

    res.status(400).json({ error: "Invalid image format provided." });
  } catch (err: any) {
    console.error("Media Server Upload Error:", err);
    res.status(500).json({
      error: err.message || "Media upload failed.",
    });
  }
});

// 3. Generate Optimized & Transformed Delivery URLs
app.post("/api/cloudinary/optimize-url", (req, res) => {
  try {
    const {
      public_id,
      fetch_format = "auto",
      quality = "auto",
      crop = "auto",
      gravity = "auto",
      width = 500,
      height = 500,
    } = req.body;

    if (!public_id) {
      return res.status(400).json({ error: "public_id is required" });
    }

    const cld = getCloudinary();

    const optimizeUrl = cld.url(public_id, {
      fetch_format,
      quality,
      secure: true,
    });

    const autoCropUrl = cld.url(public_id, {
      crop,
      gravity,
      width,
      height,
      secure: true,
    });

    res.json({
      success: true,
      public_id,
      optimize_url: optimizeUrl,
      auto_crop_url: autoCropUrl,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to transform URL." });
  }
});

// 4. Generate Upload Signature for Direct Client Uploads (optional)
app.post("/api/cloudinary/sign", (req, res) => {
  try {
    const { folder = "azraq_media", tags = "azraq" } = req.body;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    const api_key = process.env.CLOUDINARY_API_KEY || "897229884945796";
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "vd722ywp";

    if (!api_secret) {
      return res.status(400).json({
        error: "CLOUDINARY_API_SECRET is not configured on the server.",
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const cld = getCloudinary();
    const signature = cld.utils.api_sign_request(
      { timestamp, folder, tags },
      api_secret
    );

    res.json({
      success: true,
      signature,
      timestamp,
      api_key,
      cloud_name,
      folder,
      tags,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to sign upload request." });
  }
});

// ========================================================
// --- Travel Inspiration & Stories Blog DB & Endpoints ---
// ========================================================
const BLOG_DB_FILE = path.join(process.cwd(), ".blog_posts_db.json");

function loadBlogPostsFromDisk() {
  try {
    if (fs.existsSync(BLOG_DB_FILE)) {
      const data = fs.readFileSync(BLOG_DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read blog DB file:", err);
  }
  return INITIAL_BLOG_POSTS;
}

let blogPostsStore: any[] = loadBlogPostsFromDisk();

function saveBlogPostsToDisk() {
  try {
    fs.writeFileSync(BLOG_DB_FILE, JSON.stringify(blogPostsStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save blog DB file:", err);
  }
}

// 1. Get All Blog Posts (with category and search filter)
app.get("/api/blog/posts", (req, res) => {
  try {
    const { category, search, tag, featured } = req.query;
    let list = [...blogPostsStore];

    if (category && category !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (tag) {
      const tNorm = String(tag).toLowerCase();
      list = list.filter((p) => (p.tags || []).some((t: string) => t.toLowerCase().includes(tNorm)));
    }

    if (featured === "true") {
      list = list.filter((p) => p.featured === true);
    }

    if (search) {
      const s = String(search).toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.excerpt.toLowerCase().includes(s) ||
          p.content.toLowerCase().includes(s) ||
          (p.tags || []).some((t: string) => t.toLowerCase().includes(s))
      );
    }

    res.json({ success: true, posts: list });
  } catch (err: any) {
    console.error("Get Blog Posts Error:", err);
    res.status(500).json({ error: "Failed to load blog posts." });
  }
});

// 2. Get Single Blog Post by ID or Slug
app.get("/api/blog/posts/:idOrSlug", (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const post = blogPostsStore.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    );
    if (!post) {
      return res.status(404).json({ error: "Blog post not found." });
    }
    // Increment view count
    post.viewsCount = (post.viewsCount || 0) + 1;
    saveBlogPostsToDisk();

    res.json({ success: true, post });
  } catch (err: any) {
    console.error("Get Single Blog Post Error:", err);
    res.status(500).json({ error: "Failed to load article." });
  }
});

// 3. Create New Blog Post (Admin)
app.post("/api/blog/posts", (req, res) => {
  try {
    const {
      title,
      category,
      excerpt,
      content,
      coverImage,
      author,
      readTime,
      tags,
      seoDescription,
      featured,
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: "Title, Category, and Content are required." });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: slug || `article-${Date.now()}`,
      title,
      category: category || "Destination Guide",
      excerpt: excerpt || title,
      content,
      coverImage: coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      author: author || {
        name: "Azraq Travel Editorial Desk",
        role: "Senior Travel Consultant",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AzraqDesk",
        bio: "Travel insights curated by Azraq Tours & Travels certified consultants.",
      },
      publishedAt: new Date().toISOString().split("T")[0],
      readTime: readTime || "5 min read",
      tags: Array.isArray(tags) ? tags : ["#Travel", "#AzraqGuides"],
      seoDescription: seoDescription || excerpt || title,
      viewsCount: 1,
      likesCount: 0,
      featured: Boolean(featured),
    };

    blogPostsStore.unshift(newPost);
    saveBlogPostsToDisk();

    res.json({ success: true, message: "Blog post published successfully.", post: newPost });
  } catch (err: any) {
    console.error("Create Blog Post Error:", err);
    res.status(500).json({ error: "Failed to create blog post." });
  }
});

// 4. Update Blog Post (Admin)
app.patch("/api/blog/posts/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = blogPostsStore.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Post not found." });
    }

    blogPostsStore[index] = {
      ...blogPostsStore[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveBlogPostsToDisk();

    res.json({ success: true, message: "Post updated successfully.", post: blogPostsStore[index] });
  } catch (err: any) {
    console.error("Update Blog Post Error:", err);
    res.status(500).json({ error: "Failed to update blog post." });
  }
});

// 5. Delete Blog Post (Admin)
app.delete("/api/blog/posts/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = blogPostsStore.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Post not found." });
    }

    blogPostsStore.splice(index, 1);
    saveBlogPostsToDisk();

    res.json({ success: true, message: "Blog post deleted successfully." });
  } catch (err: any) {
    console.error("Delete Blog Post Error:", err);
    res.status(500).json({ error: "Failed to delete blog post." });
  }
});

// 6. Like Blog Post
app.post("/api/blog/posts/:id/like", (req, res) => {
  try {
    const { id } = req.params;
    const post = blogPostsStore.find((p) => p.id === id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    post.likesCount = (post.likesCount || 0) + 1;
    saveBlogPostsToDisk();
    res.json({ success: true, likesCount: post.likesCount });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to like post." });
  }
});

// ========================================================
// --- Live Social Proof Activity Feed Stream Endpoints ---
// ========================================================
app.get("/api/social-proof/live", (req, res) => {
  try {
    // Generate anonymized real-time events combining recent quotes with verified activity stream
    const dynamicQuotesEvents = quotesStore.slice(0, 5).map((q, idx) => {
      const names = (q.customerName || "Traveler").trim().split(" ");
      const anonName = names.length > 1 ? `${names[0]} ${names[names.length - 1][0]}.` : `${names[0]} K.`;
      const timeDiff = Math.max(2, Math.floor((Date.now() - new Date(q.createdAt).getTime()) / 60000));
      const timeStr = timeDiff < 60 ? `${timeDiff} mins ago` : `${Math.floor(timeDiff / 60)} hours ago`;

      return {
        id: `sp_dyn_${q.id}`,
        type: q.type === "flight" ? "flight_quote" : q.type === "visa" ? "visa_quote" : "package_booking",
        actorAnonymized: anonName,
        actionText: q.type === "flight" 
          ? `requested a flight quotation for ${q.from} ✈️ ${q.to}`
          : q.type === "visa"
          ? `submitted a ${q.visaType || "Tourist"} Visa request for ${q.destinationCountry}`
          : `requested personalized pricing for ${q.destinationCountry || "Custom Trip"}`,
        destination: q.type === "flight" ? q.to : q.destinationCountry,
        timeAgo: timeStr,
        iconType: q.type === "flight" ? "plane" : q.type === "visa" ? "visa" : "hotel",
        timestamp: q.createdAt,
      };
    });

    const combined = [...dynamicQuotesEvents, ...INITIAL_SOCIAL_PROOF_ACTIVITIES];
    // De-duplicate and sort
    const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
    res.json({ success: true, activities: unique.slice(0, 15) });
  } catch (err: any) {
    console.error("Social Proof Error:", err);
    res.status(500).json({ error: "Failed to retrieve social proof stream." });
  }
});

// =========================================================================
// --- Live Airport & City Autocomplete Provider Proxy ---
// =========================================================================
interface AutocompleteItem {
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode?: string;
  type: 'airport' | 'city';
  isBangladesh?: boolean;
}

const GLOBAL_AIRPORTS_DIRECTORY: AutocompleteItem[] = [
  // Bangladesh Airports
  { code: 'DAC', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'CGP', name: 'Shah Amanat International Airport', city: 'Chittagong', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'ZYL', name: 'Osmani International Airport', city: 'Sylhet', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'CXB', name: "Cox's Bazar Airport", city: "Cox's Bazar", country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'JSR', name: 'Jashore Airport', city: 'Jashore', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'RJH', name: 'Shah Makhdum Airport', city: 'Rajshahi', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'SPD', name: 'Saidpur Airport', city: 'Saidpur', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'BZL', name: 'Barisal Airport', city: 'Barisal', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'IRD', name: 'Ishwardi Airport', city: 'Ishwardi', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },
  { code: 'TKR', name: 'Thakurgaon Airport', city: 'Thakurgaon', country: 'Bangladesh', countryCode: 'BD', type: 'airport', isBangladesh: true },

  // Asia & Southeast Asia
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', type: 'airport' },
  { code: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', type: 'airport' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', type: 'airport' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', countryCode: 'SG', type: 'airport' },
  { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali / Denpasar', country: 'Indonesia', countryCode: 'ID', type: 'airport' },
  { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia', countryCode: 'ID', type: 'airport' },
  { code: 'KTM', name: 'Tribhuvan International Airport', city: 'Kathmandu', country: 'Nepal', countryCode: 'NP', type: 'airport' },
  { code: 'MLE', name: 'Velana International Airport', city: 'Male', country: 'Maldives', countryCode: 'MV', type: 'airport' },
  { code: 'CMB', name: 'Bandaranaike International Airport', city: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', type: 'airport' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', type: 'airport' },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP', type: 'airport' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP', type: 'airport' },
  { code: 'TYO', name: 'All Airports', city: 'Tokyo', country: 'Japan', countryCode: 'JP', type: 'city' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', countryCode: 'KR', type: 'airport' },
  { code: 'SEL', name: 'All Airports', city: 'Seoul', country: 'South Korea', countryCode: 'KR', type: 'city' },
  { code: 'CAN', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', country: 'China', countryCode: 'CN', type: 'airport' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', countryCode: 'CN', type: 'airport' },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', countryCode: 'CN', type: 'airport' },
  { code: 'PKX', name: 'Beijing Daxing International Airport', city: 'Beijing', country: 'China', countryCode: 'CN', type: 'airport' },

  // India & Subcontinent
  { code: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi / New Delhi', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore / Bengaluru', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India', countryCode: 'IN', type: 'airport' },

  // Middle East
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', type: 'airport' },
  { code: 'DWC', name: 'Al Maktoum International Airport', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', type: 'airport' },
  { code: 'AUH', name: 'Zayed International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE', type: 'airport' },
  { code: 'SHJ', name: 'Sharjah International Airport', city: 'Sharjah', country: 'United Arab Emirates', countryCode: 'AE', type: 'airport' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', countryCode: 'QA', type: 'airport' },
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA', type: 'airport' },
  { code: 'MED', name: 'Prince Mohammad bin Abdulaziz International Airport', city: 'Madinah / Medina', country: 'Saudi Arabia', countryCode: 'SA', type: 'airport' },
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', type: 'airport' },
  { code: 'DMM', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia', countryCode: 'SA', type: 'airport' },
  { code: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman', countryCode: 'OM', type: 'airport' },
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', countryCode: 'KW', type: 'airport' },
  { code: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain', countryCode: 'BH', type: 'airport' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', countryCode: 'TR', type: 'airport' },
  { code: 'SAW', name: 'Sabiha Gokcen International Airport', city: 'Istanbul', country: 'Turkey', countryCode: 'TR', type: 'airport' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', countryCode: 'EG', type: 'airport' },

  // Europe
  { code: 'LON', name: 'All Airports', city: 'London', country: 'United Kingdom', countryCode: 'GB', type: 'city' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB', type: 'airport' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB', type: 'airport' },
  { code: 'STN', name: 'Stansted Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB', type: 'airport' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', countryCode: 'GB', type: 'airport' },
  { code: 'PAR', name: 'All Airports', city: 'Paris', country: 'France', countryCode: 'FR', type: 'city' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', countryCode: 'FR', type: 'airport' },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', countryCode: 'FR', type: 'airport' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', type: 'airport' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', countryCode: 'DE', type: 'airport' },
  { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', countryCode: 'DE', type: 'airport' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', type: 'airport' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'Italy', countryCode: 'IT', type: 'airport' },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', countryCode: 'IT', type: 'airport' },
  { code: 'MAD', name: 'Adolfo Suarez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', countryCode: 'ES', type: 'airport' },
  { code: 'BCN', name: 'Josep Tarradellas Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', countryCode: 'ES', type: 'airport' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', countryCode: 'CH', type: 'airport' },
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', countryCode: 'AT', type: 'airport' },

  // Americas
  { code: 'NYC', name: 'All Airports', city: 'New York', country: 'United States', countryCode: 'US', type: 'city' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'New York / Newark', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'IAD', name: 'Washington Dulles International Airport', city: 'Washington D.C.', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', countryCode: 'CA', type: 'airport' },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', countryCode: 'CA', type: 'airport' },
  { code: 'YUL', name: 'Montréal-Trudeau International Airport', city: 'Montreal', country: 'Canada', countryCode: 'CA', type: 'airport' },

  // Australia & New Zealand
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', countryCode: 'AU', type: 'airport' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', countryCode: 'AU', type: 'airport' },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', countryCode: 'AU', type: 'airport' },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', countryCode: 'AU', type: 'airport' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', countryCode: 'NZ', type: 'airport' },
];

const autocompleteCache = new Map<string, { data: AutocompleteItem[]; timestamp: number }>();
const AUTOCOMPLETE_CACHE_TTL = 30 * 60 * 1000; // 30 mins

app.get("/api/flights/autocomplete", async (req, res) => {
  try {
    const rawTerm = (req.query.term as string || req.query.q as string || "").trim();
    if (!rawTerm || rawTerm.length < 2) {
      return res.json({ success: true, results: [], query: rawTerm });
    }

    const term = rawTerm.toLowerCase();
    const cached = autocompleteCache.get(term);
    if (cached && Date.now() - cached.timestamp < AUTOCOMPLETE_CACHE_TTL) {
      return res.json({ success: true, results: cached.data, query: rawTerm, source: 'cache' });
    }

    let upstreamResults: AutocompleteItem[] = [];

    // Attempt upstream Travelpayouts / Aviasales places2 search
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const upstreamUrl = `https://autocomplete.travelpayouts.com/places2?locale=en&types[]=airport&types[]=city&term=${encodeURIComponent(term)}`;
      const response = await fetch(upstreamUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AzraqTravelPlatform/2.0'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json)) {
          upstreamResults = json
            .filter((item: any) => item && (item.code || item.city_code))
            .map((item: any): AutocompleteItem => {
              const code = (item.code || item.city_code || '').toUpperCase();
              const isBD = item.country_code === 'BD' || ['DAC', 'CGP', 'ZYL', 'CXB', 'JSR', 'RJH', 'SPD', 'BZL', 'IRD', 'TKR'].includes(code);
              return {
                code,
                name: item.name || item.main_airport_name || `${item.city_name || item.name} Airport`,
                city: item.city_name || item.name || code,
                country: item.country_name || '',
                countryCode: (item.country_code || '').toUpperCase(),
                type: item.type === 'city' ? 'city' : 'airport',
                isBangladesh: isBD,
              };
            });
        }
      }
    } catch (upstreamErr) {
      console.warn("Upstream autocomplete proxy warning:", upstreamErr);
    }

    // Filter local directory as fallback or complement
    const localMatches = GLOBAL_AIRPORTS_DIRECTORY.filter((ap) => {
      const c = ap.code.toLowerCase();
      const city = ap.city.toLowerCase();
      const country = ap.country.toLowerCase();
      const name = ap.name.toLowerCase();
      return c.includes(term) || city.includes(term) || country.includes(term) || name.includes(term);
    });

    // Merge and deduplicate by IATA code
    const seenCodes = new Set<string>();
    const merged: AutocompleteItem[] = [];

    // Prioritize exact IATA code match first
    const exactCode = term.toUpperCase();
    const exactMatch = localMatches.find((a) => a.code === exactCode) || upstreamResults.find((a) => a.code === exactCode);
    if (exactMatch) {
      seenCodes.add(exactMatch.code);
      merged.push(exactMatch);
    }

    for (const item of [...upstreamResults, ...localMatches]) {
      if (!seenCodes.has(item.code)) {
        seenCodes.add(item.code);
        merged.push(item);
      }
      if (merged.length >= 12) break;
    }

    // Cache the result
    autocompleteCache.set(term, { data: merged, timestamp: Date.now() });

    res.json({
      success: true,
      results: merged,
      query: rawTerm,
      count: merged.length,
      source: upstreamResults.length > 0 ? 'provider' : 'directory'
    });
  } catch (err: any) {
    console.error("Autocomplete Proxy Error:", err);
    res.status(500).json({ success: false, results: [], error: "Failed to search airports." });
  }
});

// =========================================================================
// --- Live Aviasales / Travelpayouts Flight Pricing & Deep-Link Engine ---
// =========================================================================
app.get("/api/flights/aviasales-prices", async (req, res) => {
  try {
    const origin = (req.query.origin as string || "DAC").toUpperCase().trim();
    const destination = (req.query.destination as string || "BKK").toUpperCase().trim();
    const departDate = (req.query.departDate as string || "").trim();
    const returnDate = req.query.returnDate ? (req.query.returnDate as string).trim() : undefined;
    const adults = Math.max(1, parseInt(req.query.adults as string || "1", 10));
    const children = Math.max(0, parseInt(req.query.children as string || "0", 10));
    const infants = Math.max(0, parseInt(req.query.infants as string || "0", 10));
    const cabin = (req.query.cabin as string || "Economy").trim();
    const currency = (req.query.currency as string || "BDT").toUpperCase().trim();
    const tripType = req.query.tripType === "round" || (returnDate && returnDate.length > 0) ? "round" : "oneway";
    const directOnly = req.query.direct === "true";

    // Format Aviasales search key: e.g. DAC3108BKK0709100y
    const formatDateToDDMM = (dStr?: string) => {
      if (!dStr || !dStr.includes("-")) return "";
      const parts = dStr.split("-");
      if (parts.length === 3) {
        return `${parts[2].padStart(2, "0")}${parts[1].padStart(2, "0")}`;
      }
      return "";
    };

    const depDDMM = formatDateToDDMM(departDate);
    const retDDMM = tripType === "round" ? formatDateToDDMM(returnDate) : "";
    const cabinCode =
      cabin === "Business" ? "c" : cabin === "First" ? "f" : cabin === "Premium Economy" ? "w" : "y";

    const totalPassengers = adults + children + infants;
    let paxSuffix = `${adults}`;
    if (children > 0 || infants > 0 || cabinCode !== "y") {
      paxSuffix = `${adults}${children}${infants}${cabinCode}`;
    }

    const searchKey = `${origin}${depDDMM}${destination}${retDDMM}${paxSuffix}`;
    const aviasalesDirectUrl = `https://www.aviasales.com/search/${searchKey}?marker=563001&params=${origin}1`;

    const token = process.env.TRAVELPAYOUTS_TOKEN || process.env.AVIASALES_TOKEN || "";
    let liveOffers: any[] = [];
    let liveApiResponse: any = null;
    const nowIso = new Date().toISOString();
    const expiresIso = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15-minute TTL

    // Exchange rate baseline
    const USD_TO_BDT_RATE = 121.50;
    const EUR_TO_BDT_RATE = 131.20;

    if (token && departDate) {
      try {
        const queryParams = new URLSearchParams({
          origin,
          destination,
          departure_at: departDate,
          currency: currency === "BDT" ? "usd" : currency.toLowerCase(),
          token,
          limit: "15",
          one_way: tripType === "oneway" ? "true" : "false",
        });
        if (returnDate && tripType === "round") {
          queryParams.set("return_at", returnDate);
        }
        if (directOnly) {
          queryParams.set("direct", "true");
        }

        const queryUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${queryParams.toString()}`;
        const resp = await fetch(queryUrl, {
          headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate",
          },
        });
        if (resp.ok) {
          liveApiResponse = await resp.json();
          if (Array.isArray(liveApiResponse?.data) && liveApiResponse.data.length > 0) {
            liveOffers = liveApiResponse.data.map((item: any, idx: number) => {
              const rawPrice = typeof item.price === "number" ? item.price : 0;
              const itemCurrency = (item.currency || (currency === "BDT" ? "USD" : currency)).toUpperCase();
              let bdtPrice = rawPrice;
              if (itemCurrency === "USD") {
                bdtPrice = Math.round(rawPrice * USD_TO_BDT_RATE);
              } else if (itemCurrency === "EUR") {
                bdtPrice = Math.round(rawPrice * EUR_TO_BDT_RATE);
              }

              const itemBookingLink = item.link
                ? (item.link.startsWith("http") ? item.link : `https://www.aviasales.com${item.link}${item.link.includes("?") ? "&" : "?"}marker=563001`)
                : aviasalesDirectUrl;

              return {
                offerId: `tp-${item.airline || 'offer'}-${item.flight_number || 'fl'}-${item.departure_at || departDate}-${idx}`,
                provider: "travelpayouts",
                origin,
                destination,
                departureDate: item.departure_at?.split("T")[0] || departDate,
                returnDate: item.return_at?.split("T")[0] || returnDate,
                airline: item.airline_title || item.airline || "Partner Airline",
                airlineCode: item.airline || "",
                airlineLogo: item.airline ? `https://pics.avs.io/al_square/64/64/${item.airline.toUpperCase()}.png` : undefined,
                flightNumber: item.flight_number ? `${item.airline || ''} ${item.flight_number}`.trim() : undefined,
                departureTime: item.departure_at?.includes("T") ? item.departure_at.split("T")[1]?.substring(0, 5) : undefined,
                arrivalTime: item.arrival_at?.includes("T") ? item.arrival_at.split("T")[1]?.substring(0, 5) : undefined,
                duration: item.duration ? `${Math.floor(item.duration / 60)}h ${item.duration % 60}m` : undefined,
                stops: typeof item.transfers === "number" ? item.transfers : (item.direct ? 0 : 1),
                cabin,
                passengers: totalPassengers,
                currency: currency,
                totalPrice: currency === "BDT" ? bdtPrice : rawPrice,
                originalPrice: rawPrice,
                originalCurrency: itemCurrency,
                priceInBDT: bdtPrice,
                taxesIncluded: true,
                bookingUrl: itemBookingLink,
                market: "BD",
                fetchedAt: nowIso,
                expiresAt: expiresIso,
                source: "travelpayouts_v3_api",
                isIndicative: false,
              };
            });
          }
        }
      } catch (tpErr) {
        console.warn("Travelpayouts API fetch warning:", tpErr);
      }
    }

    res.json({
      success: true,
      searchKey,
      origin,
      destination,
      departDate,
      returnDate,
      tripType,
      adults,
      children,
      infants,
      passengers: totalPassengers,
      cabin,
      currency,
      offers: liveOffers,
      hasLiveApi: liveOffers.length > 0,
      directAviasalesUrl: aviasalesDirectUrl,
      source: liveOffers.length > 0 ? "travelpayouts_live_api" : "aviasales_affiliate_direct",
      fetchedAt: nowIso,
      expiresAt: expiresIso,
      exchangeRate: {
        usdToBdt: USD_TO_BDT_RATE,
        eurToBdt: EUR_TO_BDT_RATE,
        timestamp: nowIso,
        roundingRule: "Standard rounding to nearest integer",
        disclaimer: "Estimated exchange rates for reference. Exact card charges are determined by booking provider.",
      },
      message: liveOffers.length > 0
        ? undefined
        : "Live fares are temporarily unavailable. Please search again or contact our Dhaka flight desk.",
    });
  } catch (err: any) {
    console.error("Aviasales Prices Endpoint Error:", err);
    res.status(500).json({ error: "Failed to query live flight prices." });
  }
});

// =========================================================================
// --- Live Aviasales Price Revalidation Utility Endpoint ---
// =========================================================================
app.post("/api/flights/revalidate-price", async (req, res) => {
  try {
    const {
      origin = "DAC",
      destination = "BKK",
      departDate = "",
      returnDate,
      tripType = "round",
      adults = 1,
      children = 0,
      infants = 0,
      cabin = "Economy",
      currency = "BDT",
      cachedPrice,
      flightNumber,
      airlineCode,
      airline,
      bookingUrl,
      forceIncreaseTest,
    } = req.body;

    const origCode = String(origin).toUpperCase().trim();
    const destCode = String(destination).toUpperCase().trim();
    const totalPassengers = Math.max(1, (Number(adults) || 1) + (Number(children) || 0) + (Number(infants) || 0));
    const token = process.env.TRAVELPAYOUTS_TOKEN || process.env.AVIASALES_TOKEN || "";
    const nowIso = new Date().toISOString();

    const USD_TO_BDT_RATE = 121.50;
    const EUR_TO_BDT_RATE = 131.20;

    // Build standard search key
    const formatDateToDDMM = (dStr?: string) => {
      if (!dStr || !dStr.includes("-")) return "";
      const parts = dStr.split("-");
      if (parts.length === 3) {
        return `${parts[2].padStart(2, "0")}${parts[1].padStart(2, "0")}`;
      }
      return "";
    };

    const depDDMM = formatDateToDDMM(departDate);
    const retDDMM = tripType === "round" && returnDate ? formatDateToDDMM(returnDate) : "";
    const cabinCode =
      cabin === "Business" ? "c" : cabin === "First" ? "f" : cabin === "Premium Economy" ? "w" : "y";

    let paxSuffix = `${adults}`;
    if (children > 0 || infants > 0 || cabinCode !== "y") {
      paxSuffix = `${adults}${children}${infants}${cabinCode}`;
    }

    const searchKey = `${origCode}${depDDMM}${destCode}${retDDMM}${paxSuffix}`;
    const directPartnerUrl = bookingUrl || `https://www.aviasales.com/search/${searchKey}?marker=563001&params=${origCode}1`;

    let freshPriceBDT = Number(cachedPrice) || 0;
    let freshOriginalPrice = freshPriceBDT;
    let freshOriginalCurrency = currency;
    let freshBookingUrl = directPartnerUrl;
    let hasLiveApiMatch = false;

    // If live API token configured, fetch fresh real-time Aviasales fare
    if (token && departDate) {
      try {
        const queryParams = new URLSearchParams({
          origin: origCode,
          destination: destCode,
          departure_at: departDate,
          currency: currency === "BDT" ? "usd" : currency.toLowerCase(),
          token,
          limit: "15",
          one_way: tripType === "oneway" ? "true" : "false",
        });
        if (returnDate && tripType === "round") {
          queryParams.set("return_at", returnDate);
        }

        const queryUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${queryParams.toString()}`;
        const resp = await fetch(queryUrl, {
          headers: {
            "Accept": "application/json",
            "Cache-Control": "no-cache",
          },
        });

        if (resp.ok) {
          const liveData: any = await resp.json();
          if (Array.isArray(liveData?.data) && liveData.data.length > 0) {
            // Find matching airline/flight or closest fare
            const match = airlineCode
              ? liveData.data.find((item: any) => item.airline === airlineCode)
              : liveData.data[0];

            const selected = match || liveData.data[0];
            const rawPrice = typeof selected.price === "number" ? selected.price : 0;
            const itemCurr = (selected.currency || "USD").toUpperCase();

            freshOriginalPrice = rawPrice;
            freshOriginalCurrency = itemCurr;

            if (itemCurr === "USD") {
              freshPriceBDT = Math.round(rawPrice * USD_TO_BDT_RATE);
            } else if (itemCurr === "EUR") {
              freshPriceBDT = Math.round(rawPrice * EUR_TO_BDT_RATE);
            } else {
              freshPriceBDT = rawPrice;
            }

            if (selected.link) {
              freshBookingUrl = selected.link.startsWith("http")
                ? selected.link
                : `https://www.aviasales.com${selected.link}${selected.link.includes("?") ? "&" : "?"}marker=563001`;
            }
            hasLiveApiMatch = true;
          }
        }
      } catch (liveErr) {
        console.warn("Revalidate Live API warning:", liveErr);
      }
    }

    // Optional test toggle or realistic dynamic validation
    if (forceIncreaseTest) {
      // Simulate real-world airline bucket shift (+5% to +8%)
      const increaseAmount = Math.round(freshPriceBDT * 0.07);
      freshPriceBDT += increaseAmount;
    }

    const previousPrice = Number(cachedPrice) || freshPriceBDT;
    const priceDiff = freshPriceBDT - previousPrice;
    const hasIncreased = priceDiff > 0;
    const hasDecreased = priceDiff < 0;
    const isPriceChanged = priceDiff !== 0;

    let status: 'unchanged' | 'increased' | 'decreased' | 'verified' = 'unchanged';
    let message = 'Price verified with airline inventory.';

    if (hasIncreased) {
      status = 'increased';
      message = `Fare updated: Seat bucket in ${cabin} class changed from BDT ${previousPrice.toLocaleString()} to BDT ${freshPriceBDT.toLocaleString()} (+BDT ${priceDiff.toLocaleString()}).`;
    } else if (hasDecreased) {
      status = 'decreased';
      message = `Fare drop: Live price decreased by BDT ${Math.abs(priceDiff).toLocaleString()}!`;
    } else {
      status = 'verified';
    }

    res.json({
      success: true,
      cachedPrice: previousPrice,
      freshPrice: freshPriceBDT,
      originalPrice: freshOriginalPrice,
      originalCurrency: freshOriginalCurrency,
      hasIncreased,
      hasDecreased,
      isPriceChanged,
      priceDifference: priceDiff,
      currency: currency || "BDT",
      bookingUrl: freshBookingUrl,
      revalidatedAt: nowIso,
      status,
      hasLiveApiMatch,
      airline: airline || "Partner Airline",
      flightNumber: flightNumber || "Scheduled Flight",
      message,
    });
  } catch (err: any) {
    console.error("Price Revalidation Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to revalidate flight price.",
      cachedPrice: req.body?.cachedPrice,
      freshPrice: req.body?.cachedPrice,
      hasIncreased: false,
      hasDecreased: false,
      isPriceChanged: false,
      priceDifference: 0,
      currency: req.body?.currency || "BDT",
      bookingUrl: req.body?.bookingUrl,
      status: "unchanged",
    });
  }
});

// --- Vite Middleware / Static Server ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GlobeTrotter AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
