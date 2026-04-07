'use client';

import { useEffect, useRef } from 'react';

export default function CTASection() {
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
            '.cta-content',
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
              },
            }
          );
        }, sectionRef);
      } catch (_e) {}
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="max-w-5xl mx-auto relative">
        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/80 to-dark-950/60" />

          {/* Content */}
          <div className="cta-content relative z-10 py-20 px-8 md:px-16 text-center md:text-left">
            <div className="max-w-2xl">
              <span className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
                Start Your Journey
              </span>
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-wider mb-6 leading-tight">
                YOUR NEXT{' '}
                <span className="gradient-text">ADVENTURE</span>
                <br />
                AWAITS
              </h2>
              <p className="text-dark-300 text-lg mb-10 max-w-lg">
                Join over 50,000 travelers who trust WanderAI to plan their perfect trips.
                Start planning for free today.
              </p>

              {/* Email input + CTA */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-dark-500 outline-none focus:border-primary-500/50 transition-colors"
                />
                <a href="/dashboard" className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold tracking-wide hover:from-primary-400 hover:to-primary-500 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 whitespace-nowrap flex items-center justify-center">
                  Get Started Free
                </a>
              </div>

              <p className="text-dark-600 text-xs mt-4">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-20 h-20 border border-primary-500/20 rounded-full animate-pulse hidden md:block" />
          <div className="absolute bottom-8 right-16 w-12 h-12 border border-primary-500/10 rounded-full animate-float hidden md:block" />
        </div>
      </div>
    </section>
  );
}
