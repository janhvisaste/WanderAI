"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Mail, Lock, User, Phone, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        router.push("/dashboard");
      }
    } else {
      if (!fullName.trim()) {
        setError("Please enter your full name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName, phone);
      if (error) {
        setError(error);
      } else {
        setSuccess("Account created! Check your email to confirm, then log in.");
        setMode("login");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 relative overflow-hidden transition-colors">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center font-bold text-2xl text-white shadow-[0_0_25px_rgba(234,88,12,0.4)]">
            W
          </div>
          <span className="text-3xl font-bold text-white tracking-wide">WanderAI</span>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl transition-colors">
          {/* Tab toggle */}
          <div className="flex bg-[var(--bg-primary)] rounded-xl p-1 mb-6 border border-[var(--border)]">
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "login"
                  ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "signup"
                  ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
            {mode === "login" ? "Welcome back! 👋" : "Create your account ✨"}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {mode === "login"
              ? "Log in to plan your next adventure"
              : "Join WanderAI and start exploring"}
          </p>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-400">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (optional)"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Log In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                className="text-orange-400 font-semibold hover:text-orange-300 transition"
              >
                {mode === "login" ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-[11px] text-[var(--text-muted)] mt-6">
          By continuing, you agree to WanderAI&apos;s Terms of Service
        </p>
      </motion.div>
    </div>
  );
}
