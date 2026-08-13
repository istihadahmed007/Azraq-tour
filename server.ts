import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_TOUR_PACKAGES } from "./src/data/initialPackagesData";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

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
  const owners = ['istihadahmed1163@gmail.com', 'alex@globetrotter.ai', 'admin@globetrotter.ai', 'owner@globetrotter.ai'];
  return owners.includes(norm) || norm.startsWith('admin') || norm.startsWith('owner');
}

// Password Validator helper
function validatePasswordRequirements(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) return { valid: false, error: "Password must be at least 8 characters long." };
  if (!/[A-Z]/.test(password)) return { valid: false, error: "Password must contain at least 1 uppercase letter." };
  if (!/[a-z]/.test(password)) return { valid: false, error: "Password must contain at least 1 lowercase letter." };
  if (!/[0-9]/.test(password)) return { valid: false, error: "Password must contain at least 1 number." };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 special character." };
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
  // Default demo user (Website Owner)
  const alexSaltHash = hashPassword("pass1234");
  return new Map<string, ServerUser>([
    [
      "alex@globetrotter.ai",
      {
        uid: "user_alex_123",
        fullName: "Alex Mercer (Website Owner)",
        email: "alex@globetrotter.ai",
        phone: "+1 (555) 234-5678",
        country: "United States",
        passwordHash: alexSaltHash.hash,
        passwordSalt: alexSaltHash.salt,
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: "Avid explorer, photography enthusiast, and chief architect of GlobeTrotter AI.",
        languages: ["English", "French", "Spanish"],
        emailVerified: true,
        phoneVerified: true,
        provider: "email",
        createdAt: new Date().toISOString(),
        homeLocation: "San Francisco, CA",
        travelPreferences: ["Culture", "Nature", "Food"],
        isProfileComplete: true,
        isAdmin: true,
        role: "admin",
      },
    ],
  ]);
}

const usersStore = loadUsersFromDisk();

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
    if (user.phone) {
      const userCleanPhone = user.phone.replace(/[^0-9]/g, '');
      if (userCleanPhone && userCleanPhone === cleanPhone && cleanPhone.length >= 6) {
        return user;
      }
    }
  }
  return undefined;
}

// --- Authentication Endpoints ---

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
      emailVerified: false, // Starts false, needs verification!
      emailVerificationCode,
      emailCodeExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      phoneVerified: false,
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

    res.json({
      success: true,
      message: "Account created! We've sent a 6-digit verification code to your email.",
      user: sanitizeUserPayload(newUser),
      demoEmailCode: emailVerificationCode,
      demoPhoneOtp: phoneOtpCode,
      token: `token_${newUser.uid}_${Date.now()}`,
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

    res.json({
      success: true,
      message: "Logged in successfully!",
      user: sanitizeUserPayload(existingUser),
      token: `token_${existingUser.uid}_${Date.now()}`,
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
    const userEmail = email || "traveler.google@gmail.com";
    const userName = fullName || "Google Explorer";
    const normalizedEmail = userEmail.trim().toLowerCase();

    let existingUser = usersStore.get(normalizedEmail);

    if (!existingUser) {
      existingUser = {
        uid: `goog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        fullName: userName,
        email: normalizedEmail,
        phone: "+1 (555) 019-2834",
        country: "United States",
        photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: "Google authenticated travel enthusiast.",
        languages: ["English"],
        emailVerified: true, // Google accounts pre-verified
        phoneVerified: true,
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

    res.json({
      success: true,
      message: "Google login successful!",
      user: sanitizeUserPayload(existingUser),
      token: `token_${existingUser.uid}_${Date.now()}`,
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

// --- Persistent Quotations Database ---
const QUOTES_DB_FILE = path.join(process.cwd(), ".quotes_db.json");

interface QuoteRecord {
  id: string;
  type: "flight" | "visa";
  status: "New" | "Reviewing" | "Quotation Prepared" | "Sent" | "Customer Confirmed" | "Closed";
  createdAt: string;
  updatedAt?: string;
  customerName: string;
  email: string;
  phone: string;
  staffNote?: string;
  quotedPrice?: string;
  flightOptions?: string;
  [key: string]: any;
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
      customerName: "Alex Mercer",
      email: "alex@globetrotter.ai",
      phone: "+1 (555) 234-5678",
      status: "Quotation Prepared",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      staffNote: "Found 2 direct Business Class options with JAL and ANA.",
      quotedPrice: "$3,450 / person",
      flightOptions: "JAL Flight JL001 (SFO-HND Nonstop) - $3,450 USD. ANA Flight NH107 - $3,620 USD.",
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
      status: "Reviewing",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      staffNote: "Reviewing passport & itinerary documents. Appointment slot available for next Tuesday.",
    },
  ];
}

let quotesStore: QuoteRecord[] = loadQuotesFromDisk();

function saveQuotesToDisk() {
  try {
    fs.writeFileSync(QUOTES_DB_FILE, JSON.stringify(quotesStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save quotes DB file:", err);
  }
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
    } = req.body;

    if (!customerName || !email || !phone || !from || !to || !departureDate) {
      return res.status(400).json({ error: "Please fill in all required fields (Name, Email, Phone, From, To, Departure Date)." });
    }

    const randomId = Math.floor(100000 + Math.random() * 900000);
    const id = `FLQ-${randomId}`;

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
      status: "New",
      createdAt: new Date().toISOString(),
    };

    quotesStore.unshift(newQuote);
    saveQuotesToDisk();

    res.json({
      success: true,
      message: "Quote Request Received successfully!",
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
    } = req.body;

    if (!customerName || !email || !phone || !destinationCountry || !visaType || !intendedTravelDate || !applicantNationality) {
      return res.status(400).json({ error: "Please fill in all required fields (Name, Email, Phone, Destination Country, Visa Type, Travel Date, Nationality)." });
    }

    const randomId = Math.floor(100000 + Math.random() * 900000);
    const id = `VSQ-${randomId}`;

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
      status: "New",
      createdAt: new Date().toISOString(),
    };

    quotesStore.unshift(newQuote);
    saveQuotesToDisk();

    res.json({
      success: true,
      message: "Visa Quote Request Received successfully!",
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

    if (results.length === 0) {
      return res.status(404).json({ error: "No quotation request found matching your Request ID or Email." });
    }

    res.json({ success: true, quotes: results });
  } catch (err: any) {
    console.error("Track Quote Error:", err);
    res.status(500).json({ error: "Failed to track quotation." });
  }
});

// 8. Admin List All Quotations
app.get("/api/quotes/admin", (req, res) => {
  try {
    res.json({ success: true, quotes: quotesStore });
  } catch (err: any) {
    console.error("Admin List Quotes Error:", err);
    res.status(500).json({ error: "Failed to load quotations for admin." });
  }
});

// 9. Admin Update Quotation Status & Details
app.patch("/api/quotes/admin/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { status, staffNote, quotedPrice, flightOptions } = req.body;

    const quoteIndex = quotesStore.findIndex((q) => q.id.toLowerCase() === id.toLowerCase());
    if (quoteIndex === -1) {
      return res.status(404).json({ error: "Quotation request not found." });
    }

    const targetQuote = quotesStore[quoteIndex];
    if (status) targetQuote.status = status;
    if (staffNote !== undefined) targetQuote.staffNote = staffNote;
    if (quotedPrice !== undefined) targetQuote.quotedPrice = quotedPrice;
    if (flightOptions !== undefined) targetQuote.flightOptions = flightOptions;
    targetQuote.updatedAt = new Date().toISOString();

    quotesStore[quoteIndex] = targetQuote;
    saveQuotesToDisk();

    res.json({
      success: true,
      message: `Quotation ${id} updated to status '${status}'. Notification generated.`,
      quote: targetQuote,
    });
  } catch (err: any) {
    console.error("Admin Update Quote Error:", err);
    res.status(500).json({ error: "Failed to update quotation." });
  }
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
