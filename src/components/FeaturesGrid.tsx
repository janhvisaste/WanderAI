'use client';

import { useEffect, useRef } from 'react';

const features = [
  {
    title: 'AI-Powered Planning',
    description: 'Our intelligent engine analyzes millions of data points to craft the perfect itinerary tailored to your preferences.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: 'Real-Time Weather',
    description: 'Live weather forecasts for every destination so you can pack smart and plan accordingly.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 18a5 5 0 000-10h-.3A7 7 0 104 14.7" />
        <line x1="12" y1="13" x2="12" y2="21" />
        <line x1="8" y1="17" x2="8" y2="21" />
        <line x1="16" y1="15" x2="16" y2="21" />
      </svg>
    ),
    span: 'col-span-1',
  },
  {
    title: 'Google Maps',
    description: 'Every stop embedded with an interactive map view for seamless navigation.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    span: 'col-span-1',
  },
  {
    title: 'Shareable Links',
    description: 'Generate beautiful public links for your trips. Perfect for sharing travel plans with friends and family.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: 'Photo Gallery',
    description: 'Beautiful high-res photos for every destination automatically curated from top travel photography.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    span: 'col-span-1',
  },
  {
    title: 'Trip Dashboard',
    description: 'Manage all your trips in one place — edit, duplicate, archive, and organize your travel plans.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    span: 'col-span-1 md:col-span-2',
  },
];

export default function FeaturesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            '.feature-card',
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
              },
            }
          );
        }, sectionRef);
      } catch (_e) {}
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-32 relative overflow-hidden">
      {/* Dark Base */}
      <div className="absolute inset-0 bg-dark-950" />
      
      {/* Ambient Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Glowing Orbs */}
      <div className="absolute top-0 -left-64 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 -right-64 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
            Powerful Features
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider mb-4">
            EVERYTHING YOU <span className="gradient-text">NEED</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            All the tools and intelligence to plan, manage, and share unforgettable journeys
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`feature-card group p-8 rounded-3xl glass hover:bg-white/[0.08] border border-white/[0.05] hover:border-primary-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden ${feature.span} shadow-lg hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]`}
            >
              {/* Hover glow inside card */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/0 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-700 pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/0 group-hover:bg-amber-500/10 rounded-full blur-3xl transition-all duration-700 pointer-events-none" />

              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-5 group-hover:bg-primary-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl text-white tracking-wider mb-2 group-hover:text-primary-300 transition-colors">
                  {feature.title.toUpperCase()}
                </h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
