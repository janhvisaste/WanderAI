'use client';

import { useEffect, useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Choose Your Destination',
    description:
      'Tell us where you want to go, how many days you have, and what excites you — beaches, culture, food, or adventure.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="M11 8v6l4 2" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI Builds Your Plan',
    description:
      'Our AI engine crafts a personalized day-by-day itinerary with real places, optimal routes, and local gems — in seconds.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Save & Share',
    description:
      'Save your trip to your dashboard, make edits anytime, and share a beautiful public link with friends and family.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
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
            '.step-card',
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.2,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
              },
            }
          );
          gsap.fromTo(
            '.connector-line',
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
              },
            }
          );
        }, sectionRef);
      } catch (_e) {}
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/[0.03] to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider mb-4">
            HOW IT <span className="gradient-text">WORKS</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Plan your dream trip in three simple steps — powered by artificial intelligence
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-24 left-[calc(33.33%+0.5rem)] w-[calc(33.33%-3rem)] h-px">
            <div className="connector-line h-full bg-gradient-to-r from-primary-500/40 to-primary-500/20 origin-left" />
          </div>
          <div className="hidden md:block absolute top-24 left-[calc(66.66%+0.5rem)] w-[calc(33.33%-3rem)] h-px">
            <div className="connector-line h-full bg-gradient-to-r from-primary-500/20 to-primary-500/40 origin-left" />
          </div>

          {steps.map((step) => (
            <div
              key={step.number}
              className="step-card group text-center relative"
            >
              {/* Icon container */}
              <div className="relative mx-auto mb-8 w-20 h-20">
                <div className="absolute inset-0 rounded-2xl bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors rotate-6 group-hover:rotate-12 duration-500" />
                <div className="relative w-full h-full rounded-2xl glass flex items-center justify-center text-primary-400 group-hover:text-primary-300 transition-colors">
                  {step.icon}
                </div>
              </div>

              {/* Number */}
              <span className="text-5xl font-display text-dark-800 group-hover:text-dark-700 transition-colors tracking-wider block mb-4">
                {step.number}
              </span>

              {/* Content */}
              <h3 className="font-display text-2xl text-white tracking-wider mb-3">
                {step.title.toUpperCase()}
              </h3>
              <p className="text-dark-400 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
