'use client';

import { useEffect, useRef } from 'react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Travel Blogger',
    avatar: '🧑‍💻',
    rating: 5,
    text: 'WanderAI completely changed how I plan my trips. The AI-generated itinerary for Kyoto was spot-on — every restaurant and temple was exactly what I love.',
  },
  {
    name: 'Marcus Rivera',
    role: 'Digital Nomad',
    avatar: '🧳',
    rating: 5,
    text: 'As someone who travels full-time, I need quick, reliable plans. WanderAI gives me a full itinerary in seconds. The shareable links are a game-changer for my audience.',
  },
  {
    name: 'Emily Watson',
    role: 'Honeymooner',
    avatar: '👩‍❤️‍👨',
    rating: 5,
    text: 'We used WanderAI for our honeymoon in Santorini and it was magical. Every stop was romantic and perfectly timed. Best travel tool we\'ve ever used.',
  },
  {
    name: 'Alex Petrov',
    role: 'Adventure Seeker',
    avatar: '🏔️',
    rating: 5,
    text: 'The Patagonia itinerary had hidden gems I never would have found on my own. The maps integration made it so easy to navigate between stops.',
  },
  {
    name: 'Priya Sharma',
    role: 'Family Traveler',
    avatar: '👨‍👩‍👧‍👦',
    rating: 5,
    text: 'Planning a family trip used to take weeks. WanderAI did it in minutes — with kid-friendly activities and restaurants. Absolute lifesaver for busy parents.',
  },
  {
    name: 'David Kim',
    role: 'Weekend Explorer',
    avatar: '🎒',
    rating: 4,
    text: 'Even for short weekend getaways, WanderAI packs in the perfect amount of activities. Not too rushed, not too slow. Really impressive AI planning.',
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    let animationId: number;
    let scrollPos = 0;

    const animate = () => {
      scrollPos += 0.5;
      if (scrollPos >= scrollEl.scrollWidth / 2) {
        scrollPos = 0;
      }
      scrollEl.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const pause = () => cancelAnimationFrame(animationId);
    const resume = () => {
      animationId = requestAnimationFrame(animate);
    };
    scrollEl.addEventListener('mouseenter', pause);
    scrollEl.addEventListener('mouseleave', resume);

    return () => {
      cancelAnimationFrame(animationId);
      scrollEl.removeEventListener('mouseenter', pause);
      scrollEl.removeEventListener('mouseleave', resume);
    };
  }, []);

  // Double the testimonials for infinite scroll effect
  const doubled = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <div className="text-center">
          <span className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider mb-4">
            TRAVELERS <span className="gradient-text">LOVE</span> US
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Join thousands of happy travelers who plan smarter with WanderAI
          </p>
        </div>
      </div>

      {/* Auto-scrolling carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-950 to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden px-6"
          style={{ scrollBehavior: 'auto' }}
        >
          {doubled.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="shrink-0 w-[380px] p-6 rounded-2xl glass-light hover:bg-white/10 transition-all duration-300 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-dark-300 text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-lg">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{t.name}</div>
                  <div className="text-dark-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
