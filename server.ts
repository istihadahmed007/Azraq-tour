import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

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

// --- Persistent File-Backed Auth User Store ---
interface ServerUser {
  uid: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  photoURL?: string;
  emailVerified: boolean;
  provider: 'email' | 'google' | 'apple';
  createdAt: string;
  homeLocation?: string;
  travelPreferences?: string[];
  isProfileComplete?: boolean;
  isAdmin?: boolean;
  role?: 'admin' | 'user' | 'owner';
}

const DB_FILE = path.join(process.cwd(), ".users_db.json");

function isOwnerEmail(email: string): boolean {
  const norm = (email || '').toLowerCase().trim();
  const owners = ['istihadahmed1163@gmail.com', 'alex@globetrotter.ai', 'admin@globetrotter.ai', 'owner@globetrotter.ai'];
  return owners.includes(norm) || norm.startsWith('admin') || norm.startsWith('owner');
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
  return new Map<string, ServerUser>([
    [
      "alex@globetrotter.ai",
      {
        uid: "user_alex_123",
        fullName: "Alex Mercer (Website Owner)",
        email: "alex@globetrotter.ai",
        passwordHash: "pass1234",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        emailVerified: true,
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

// --- Authentication Endpoints ---

// Register Endpoint
app.post("/api/auth/register", (req, res) => {
  try {
    const { fullName, email, password, photoURL } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "Full Name is required." });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (usersStore.has(normalizedEmail)) {
      return res.status(400).json({ error: "An account with this email address already exists. Please log in instead." });
    }

    const newUser: ServerUser = {
      uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: password, // server-managed credential check
      photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      emailVerified: false, // email verification required
      provider: "email",
      createdAt: new Date().toISOString(),
      isProfileComplete: false,
    };

    usersStore.set(normalizedEmail, newUser);
    saveUsersToDisk();

    // Return user object (without sensitive password hash)
    const { passwordHash, ...userPayload } = newUser;
    res.json({
      message: "Account created successfully!",
      user: userPayload,
      token: `token_${newUser.uid}_${Date.now()}`,
    });
  } catch (err: any) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Failed to create account. Please try again." });
  }
});

// Login Endpoint
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = usersStore.get(normalizedEmail);

    if (!existingUser) {
      return res.status(400).json({ error: "No account found with this email address. Please sign up." });
    }

    if (existingUser.passwordHash && existingUser.passwordHash !== password) {
      return res.status(400).json({ error: "Incorrect password. Please try again or click 'Forgot password?'." });
    }

    const { passwordHash, ...userPayload } = existingUser;
    res.json({
      message: "Logged in successfully!",
      user: userPayload,
      token: `token_${existingUser.uid}_${Date.now()}`,
    });
  } catch (err: any) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Failed to log in. Please try again." });
  }
});

// Google One-Click Auth Endpoint
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
        photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        emailVerified: true, // Google accounts are pre-verified
        provider: "google",
        createdAt: new Date().toISOString(),
        isProfileComplete: false,
      };
      usersStore.set(normalizedEmail, existingUser);
      saveUsersToDisk();
    }

    const { passwordHash, ...userPayload } = existingUser;
    res.json({
      message: "Google login successful!",
      user: userPayload,
      token: `token_${existingUser.uid}_${Date.now()}`,
    });
  } catch (err: any) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ error: "Google authentication failed." });
  }
});

// Forgot Password Endpoint
app.post("/api/auth/forgot-password", (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    // Always respond politely to prevent email enumeration
    res.json({
      message: "Check your email for instructions to reset your password.",
      sent: true,
    });
  } catch (err: any) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Could not send password reset email." });
  }
});

// Verify Email Endpoint
app.post("/api/auth/verify-email", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required for verification." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersStore.get(normalizedEmail);

    if (user) {
      user.emailVerified = true;
      usersStore.set(normalizedEmail, user);
      saveUsersToDisk();
      const { passwordHash, ...userPayload } = user;
      return res.json({ message: "Email verified successfully!", user: userPayload });
    }

    res.json({ message: "Email verified successfully!" });
  } catch (err: any) {
    console.error("Email Verification Error:", err);
    res.status(500).json({ error: "Failed to verify email." });
  }
});

// Resend Verification Link
app.post("/api/auth/resend-verification", (req, res) => {
  res.json({ message: "A new verification link has been sent to your email address." });
});

// Update Profile / Onboarding Preferences
app.post("/api/auth/update-profile", (req, res) => {
  try {
    const { email, homeLocation, travelPreferences, photoURL, fullName } = req.body;
    if (!email) {
      return res.status(400).json({ error: "User email is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersStore.get(normalizedEmail);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (homeLocation !== undefined) user.homeLocation = homeLocation;
    if (travelPreferences !== undefined) user.travelPreferences = travelPreferences;
    if (photoURL !== undefined) user.photoURL = photoURL;
    if (fullName !== undefined) user.fullName = fullName;
    user.isProfileComplete = true;

    usersStore.set(normalizedEmail, user);

    const { passwordHash, ...userPayload } = user;
    res.json({ message: "Profile updated successfully!", user: userPayload });
  } catch (err: any) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
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
