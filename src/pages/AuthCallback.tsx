import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          window.location.href = '/';
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-sky-100">
      <div className="text-center p-8 rounded-2xl bg-white/5 border border-sky-400/20 backdrop-blur-md">
        <div className="animate-spin w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-lg font-medium text-sky-200">Completing sign in...</p>
        <p className="text-xs text-sky-300/60 mt-1">Verifying your Supabase session credentials</p>
      </div>
    </div>
  );
}
