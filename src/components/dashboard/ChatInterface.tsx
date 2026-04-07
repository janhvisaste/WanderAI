"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Loader2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "itinerary";
};

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  activities: string[];
  image_query: string;
};

type TripPlan = {
  destination: string;
  duration_days: number;
  trip_type: string;
  interests: string[];
  budget: string;
  itinerary: ItineraryDay[];
  summary: string;
};

type Props = {
  initialDestination?: string;
  onPlanReady?: (plan: TripPlan) => void;
};

// Unsplash image helper for itinerary days
function getItineraryImage(query: string, idx: number): string {
  const fallbacks = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=80",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
    "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80",
  ];
  return fallbacks[idx % fallbacks.length];
}

export default function ChatInterface({
  initialDestination = "",
  onPlanReady,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [showItinerary, setShowItinerary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showItinerary]);

  // Start session on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const startSession = async () => {
      try {
        const res = await fetch("/api/chat/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination: initialDestination }),
        });
        if (!res.ok) throw new Error("Failed to start session");
        const data = await res.json();
        setSessionId(data.session_id);
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: data.message,
          },
        ]);
        if (data.phase === "ask_duration") {
          setSuggestions([
            "3 days",
            "5 days",
            "7 days",
            "10 days",
            "2 weeks",
          ]);
        }
      } catch (error) {
        setMessages([
          {
            id: "1",
            role: "assistant",
            content:
              "Welcome to WanderAI! ✈️ It looks like the backend isn't running yet. Please start the FastAPI server with:\n\n`cd backend && uvicorn main:app --reload --port 8000`\n\nThen refresh this page!",
          },
        ]);
      }
    };

    startSession();
  }, [initialDestination]);

  const handleSend = useCallback(
    async (messageOverride?: string) => {
      const text = (messageOverride || input).trim();
      if (!text || !sessionId || isLoading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setSuggestions([]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, message: text }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to get response");
        }

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.message,
            type: data.trip_plan ? "itinerary" : "text",
          },
        ]);

        if (data.suggestions?.length) {
          setSuggestions(data.suggestions);
        }

        if (data.trip_plan?.itinerary?.length) {
          setTripPlan(data.trip_plan);
          setShowItinerary(true);
          onPlanReady?.(data.trip_plan);
        }
      } catch (_error: unknown) {
        const errMsg =
          _error instanceof Error ? _error.message : "Something went wrong";
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `⚠️ ${errMsg}. Please try again.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, sessionId, isLoading, onPlanReady]
  );

  // Parse markdown bold and newlines
  function renderContent(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <code
                  key={j}
                  className="bg-white/10 px-1.5 py-0.5 rounded text-orange-300 text-xs font-mono"
                >
                  {part.slice(1, -1)}
                </code>
              );
            }
            return <span key={j}>{part}</span>;
          })}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <div className="flex-1 flex flex-col h-full z-10 relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-orange-400 to-pink-500 text-white"
                      : "bg-[#1e2330] border border-white/5"
                  }`}
                >
                  {msg.role === "user" ? (
                    "J"
                  ) : (
                    <Sparkles className="w-4 h-4 text-orange-500" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm"
                      : "bg-[#0a0c10] border border-white/5 text-gray-300 rounded-tl-sm"
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#1e2330] border border-white/5 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>
            <div className="bg-[#0a0c10] border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-gray-500 text-sm ml-2">
                Planning your adventure...
              </span>
            </div>
          </motion.div>
        )}

        {/* Itinerary display */}
        {showItinerary && tripPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <div className="bg-gradient-to-br from-[#141720] to-[#0f1117] border border-white/5 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {tripPlan.destination}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {tripPlan.duration_days} days •{" "}
                    {tripPlan.trip_type} •{" "}
                    {tripPlan.budget}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {tripPlan.itinerary.map((day, idx) => (
                  <div
                    key={day.day}
                    className="group flex gap-4 bg-[#0a0c10]/50 border border-white/5 rounded-2xl p-4 hover:border-orange-500/20 transition-all"
                  >
                    {/* Day image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                      <img
                        src={getItineraryImage(day.image_query, idx)}
                        alt={day.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                          DAY {day.day}
                        </span>
                        <h4 className="text-sm font-semibold text-white truncate">
                          {day.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                        {day.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {day.activities.slice(0, 3).map((act, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips */}
      {suggestions.length > 0 && !isLoading && (
        <div className="flex gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
          {suggestions.map((sugg) => (
            <button
              key={sugg}
              onClick={() => handleSend(sugg)}
              className="whitespace-nowrap px-4 py-2 rounded-full border border-orange-500/20 text-xs font-medium text-orange-400 hover:text-white hover:bg-orange-500/10 hover:border-orange-500/40 transition-all"
            >
              {sugg}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              tripPlan
                ? "Ask anything about your trip..."
                : "Type your answer..."
            }
            disabled={isLoading}
            className="w-full bg-[#0a0c10] border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 shadow-inner disabled:opacity-50 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
