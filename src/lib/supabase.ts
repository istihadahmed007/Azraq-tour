import { createClient } from "@supabase/supabase-js";

const env = (import.meta as any).env || {};
const rawEnvUrl = typeof env.VITE_SUPABASE_URL === "string" ? env.VITE_SUPABASE_URL.trim() : "";
const rawEnvKey = typeof env.VITE_SUPABASE_ANON_KEY === "string" ? env.VITE_SUPABASE_ANON_KEY.trim() : "";

const isValidHttpUrl = (urlString: string): boolean => {
  if (!urlString || typeof urlString !== "string") return false;
  if (
    urlString.includes("YOUR_SUPABASE") ||
    urlString.includes("YOUR-SUPABASE") ||
    urlString.includes("your-project.supabase.co") ||
    urlString.includes("<") ||
    urlString.includes(">")
  ) {
    return false;
  }
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const isSupabaseConfigured =
  isValidHttpUrl(rawEnvUrl) &&
  Boolean(rawEnvKey) &&
  rawEnvKey.length > 20 &&
  !rawEnvKey.includes("YOUR_SUPABASE") &&
  !rawEnvUrl.includes("placeholder.supabase.co");

const FALLBACK_SUPABASE_URL = "https://azraq-tours.supabase.co";
const FALLBACK_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cmFxLXRvdXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTYwMDAsImV4cCI6MjAyNTQzMjAwMH0.placeholder";

const finalUrl = isValidHttpUrl(rawEnvUrl) ? rawEnvUrl : FALLBACK_SUPABASE_URL;
const finalKey = rawEnvKey && rawEnvKey.length > 10 ? rawEnvKey : FALLBACK_SUPABASE_KEY;

export const supabase = createClient(
  finalUrl,
  finalKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }

  return data;
}

export async function registerUser({
  fullName,
  email,
  phone,
  country,
  password,
}: {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        full_name: fullName,
        phone,
        country,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export function validateRegistration(form: any): string | null {
  if (!form.fullName || !form.fullName.trim()) {
    return "Full name is required.";
  }

  if (!form.email || !form.email.trim()) {
    return "Email address is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(form.email)) {
    return "Please enter a valid email address.";
  }

  if (!form.phone || !form.phone.trim()) {
    return "Phone / WhatsApp number is required.";
  }

  if (!form.country) {
    return "Please select your country.";
  }

  if (!form.password || form.password.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  if (form.password !== form.confirmPassword) {
    return "Passwords do not match.";
  }

  if (!form.acceptTerms && !form.agreeTerms) {
    return "Please accept the Terms of Service and Privacy Policy.";
  }

  return null;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    {
      redirectTo: `${window.location.origin}/reset-password`,
    }
  );

  if (error) {
    throw error;
  }
}
