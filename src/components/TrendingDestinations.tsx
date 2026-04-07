'use client';

import { useEffect, useRef } from 'react';

const destinations = [
  {
    name: 'Maldives',
    country: 'South Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
    rating: 4.9,
    price: '$2,400',
    days: '5 days',
  },
  {
    name: 'Amalfi Coast',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=80',
    rating: 4.8,
    price: '$1,800',
    days: '4 days',
  },
  {
    name: 'Patagonia',
    country: 'Argentina',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80',
    rating: 4.7,
    price: '$2,100',
    days: '7 days',
  },
  {
    name: 'Cappadocia',
    country: 'Turkey',
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600&q=80',
    rating: 4.8,
    price: '$1,200',
    days: '3 days',
  },
  {
    name: 'Northern Lights',
    country: 'Norway',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',
    rating: 4.9,
    price: '$2,800',
    days: '5 days',
  },
  {
    name: 'Marrakech',
    country: 'Morocco',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80',
    rating: 4.6,
    price: '$900',
    days: '3 days',
  },
];

export default function TrendingDestinations() {
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
            '.trending-card',
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.7,
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
    <section ref={sectionRef} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
              Trending Now
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider">
              MOST <span className="gradient-text">LOVED</span> TRIPS
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors"
          >
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="trending-card group relative rounded-2xl overflow-hidden card-hover cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />

                {/* Rating badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass flex items-center gap-1.5 text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-white font-medium">{dest.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-2xl text-white tracking-wider mb-1">
                  {dest.name.toUpperCase()}
                </h3>
                <div className="flex items-center gap-2 text-dark-400 text-sm mb-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {dest.country}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-primary-400 font-bold text-lg">{dest.price}</span>
                    <span className="text-dark-500 text-sm">/ {dest.days}</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400 group-hover:text-white transition-colors">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
