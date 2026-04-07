"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  Heart,
  HelpCircle,
  Settings,
  Moon,
  Sun,
  Sparkles,
  LogOut,
  X,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const menuItems = [
    { name: "AI Planner", icon: Sparkles, path: "/dashboard" },
    { name: "My Trips", icon: Map, path: "/dashboard/trips" },
    { name: "Favourite", icon: Heart, path: "/dashboard/favorites" },
  ];

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Traveler";
  const userEmail = user?.email || "";
  const userPhone = user?.user_metadata?.phone || "";

  return (
    <>
      <aside className="w-[240px] border-r border-[var(--border)] bg-[var(--bg-secondary)] h-full flex flex-col flex-shrink-0 justify-between py-8 px-5 transition-colors duration-300">
        <div>
          <Link href="/" className="flex items-center gap-3 px-2 mb-12 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center font-bold text-xl text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] group-hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-shadow">
              W
            </div>
            <span className="text-2xl font-bold tracking-wide text-[var(--text-primary)]">WanderAI</span>
          </Link>

          <div className="space-y-6">
            <div>
              <p className="px-2 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                Menu
              </p>
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (pathname?.startsWith(item.path) && item.path !== "/dashboard");
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500/20 to-transparent text-[var(--text-primary)] font-medium border-l-2 border-orange-500"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover)] border-l-2 border-transparent"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-orange-500 drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]"
                            : ""
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <nav className="space-y-1.5">
            <Link
              href="/help"
              className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover)] transition-all duration-300 border-l-2 border-transparent"
            >
              <HelpCircle className="w-5 h-5" />
              Help Center
            </Link>
            <button
              onClick={() => setShowProfile(true)}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover)] transition-all duration-300 border-l-2 border-transparent"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>

          {/* Theme Toggle */}
          <div className="px-3 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] font-medium">
              {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="text-sm">{theme === "dark" ? "Dark" : "Light"}</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full relative cursor-pointer flex items-center px-1 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.2)]"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Sign Out */}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 w-[380px] shadow-2xl relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Profile</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                <User className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Name</p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">{userName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                <Mail className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Email</p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                <Phone className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Phone</p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">{userPhone || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
