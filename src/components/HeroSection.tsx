'use client';

import { useEffect, useRef, useState } from 'react';

const destinations = [
  {
    name: 'Machu Picchu',
    country: 'Peru',
    tagline: 'Adventure is never far away',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1920&q=80',
  },
  {
    name: 'Santorini',
    country: 'Greece',
    tagline: 'Where the sea meets the sky',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&q=80',
  },
  {
    name: 'Swiss Alps',
    country: 'Switzerland',
    tagline: 'Breathe in the extraordinary',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    tagline: 'Find your paradise',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    tagline: 'Timeless beauty awaits',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80',
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  /* Auto-rotate backgrounds */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % destinations.length);
        setIsAnimating(false);
      }, 800);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, []);

  /* GSAP text animations on mount */
  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        ctx = gsap.context(() => {
          // Headline staggered word animation
          if (headlineRef.current) {
            const words = headlineRef.current.querySelectorAll('.word');
            gsap.fromTo(
              words,
              { y: 80, opacity: 0, rotateX: -40 },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                stagger: 0.12,
                duration: 1,
                ease: 'power3.out',
                delay: 0.5,
              }
            );
          }

          // Subtitle fade in
          if (subtitleRef.current) {
            gsap.fromTo(
              subtitleRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.2 }
            );
          }
        });
      } catch (_e) {
        // GSAP may not load on SSR
      }
    })();
    return () => ctx?.revert();
  }, []);

  const current = destinations[currentIndex];
  const headlineWords = 'Your Next Great Adventure Starts Here'.split(' ');

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Background Images with Ken Burns */}
      {destinations.map((dest, i) => (
        <div
          key={dest.name}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 ken-burns"
            style={{
              backgroundImage: `url(${dest.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      ))}

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-950/40 to-dark-950/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-950/60 via-transparent to-dark-950/40" />

      {/* Watermark text */}
      <div className="absolute bottom-[10%] left-0 right-0 flex justify-center pointer-events-none overflow-hidden">
        <span
          className={`watermark-text font-display transition-all duration-700 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {current.name}
        </span>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        {/* Location badge */}
        <div
          className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-dark-200 transition-all duration-700 ${
            isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="font-medium">{current.country}</span>
          <span className="text-dark-500">•</span>
          <span className="text-dark-400">{current.tagline}</span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white mb-6 perspective-1000 max-w-5xl"
        >
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className="word inline-block mr-[0.25em] opacity-0"
              style={{ perspective: '1000px' }}
            >
              {word === 'Adventure' ? (
                <span className="gradient-text">{word}</span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-dark-300 text-lg md:text-xl max-w-2xl mb-10 opacity-0 leading-relaxed"
        >
          Let AI craft your perfect itinerary in seconds. Real places, curated experiences,
          and shareable plans — all powered by intelligent travel planning.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <a
            href="/dashboard"
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg tracking-wide shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            Start Planning
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-4 rounded-full glass text-white font-semibold text-lg tracking-wide hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" fill="rgba(249,115,22,0.3)" />
            </svg>
            See How It Works
          </a>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {destinations.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentIndex(i);
                setIsAnimating(false);
              }, 400);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentIndex
                ? 'w-8 bg-primary-400'
                : 'w-3 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:flex flex-col items-center gap-2 text-dark-400 text-xs tracking-widest uppercase">
        <span className="writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-primary-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
