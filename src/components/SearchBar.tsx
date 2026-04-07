'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const placeholderTexts = [
  'Search "Bali for 5 days"...',
  'Search "Paris romantic getaway"...',
  'Search "Tokyo food tour 3 days"...',
  'Search "Iceland adventure week"...',
  'Search "Santorini honeymoon"...',
];

const suggestions = [
  { name: 'Bali, Indonesia', emoji: '🌴', days: '5-7 days recommended' },
  { name: 'Paris, France', emoji: '🗼', days: '3-5 days recommended' },
  { name: 'Tokyo, Japan', emoji: '⛩️', days: '5-7 days recommended' },
  { name: 'Santorini, Greece', emoji: '🏖️', days: '3-4 days recommended' },
  { name: 'Swiss Alps, Switzerland', emoji: '⛰️', days: '4-6 days recommended' },
  { name: 'Maldives', emoji: '🐠', days: '5-7 days recommended' },
];

export default function SearchBar() {
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState(placeholderTexts[0]);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setCurrentPlaceholder] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const navigateToDashboard = (destination: string) => {
    router.push(`/dashboard?destination=${encodeURIComponent(destination)}`);
  };

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => {
        const next = (prev + 1) % placeholderTexts.length;
        setPlaceholder(placeholderTexts[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // GSAP scroll animation
  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            '.search-container',
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 85%',
              },
            }
          );
        }, sectionRef);
      } catch (_e) {}
    })();
    return () => ctx?.revert();
  }, []);

  const filteredSuggestions = query
    ? suggestions.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions;

  return (
    <section ref={sectionRef} id="plan" className="relative py-20 -mt-12">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="search-container max-w-3xl mx-auto px-6 relative z-10">
        {/* Label */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-white tracking-wider mb-3">
            WHERE TO <span className="gradient-text">NEXT</span>?
          </h2>
          <p className="text-dark-400 text-sm">
            Type a destination, number of days, and your interests — our AI handles the rest
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="glass-strong rounded-2xl p-2 glow-orange">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-400 shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder={placeholder}
                  className="w-full bg-transparent text-white text-lg py-3 outline-none placeholder:text-dark-500 placeholder:transition-opacity"
                />
              </div>
              <button onClick={() => navigateToDashboard(query || 'Bali')} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold tracking-wide hover:from-primary-400 hover:to-primary-500 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 animate-pulse-glow shrink-0 flex items-center justify-center">
                Explore Now
              </button>
            </div>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl p-3 z-50 animate-slide-up">
              {filteredSuggestions.map((s) => (
                <button
                  key={s.name}
                  onClick={() => {
                    navigateToDashboard(s.name);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="flex-1">
                    <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                      {s.name}
                    </div>
                    <div className="text-dark-500 text-sm">{s.days}</div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-dark-600 group-hover:text-primary-400 transition-colors"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {['🏖️ Beach', '⛰️ Mountains', '🏛️ Culture', '🍜 Food Tour', '🌿 Nature', '❄️ Winter'].map(
            (tag) => (
              <button
                key={tag}
                className="px-4 py-2 rounded-full glass text-sm text-dark-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
