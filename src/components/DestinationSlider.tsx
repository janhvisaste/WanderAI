'use client';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const slides = [
  {
    name: 'Machu Picchu',
    country: 'Peru',
    region: 'South America',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
  },
  {
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
  },
  {
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  },
  {
    name: 'Iceland',
    country: 'Iceland',
    region: 'Northern Europe',
    image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&q=80',
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    region: 'South Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
  },
];

export default function DestinationSlider() {
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
            '.slider-title',
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
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
    <section
      ref={sectionRef}
      id="destinations"
      className="relative py-24 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-14">
        <div className="slider-title text-center">
          <span className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
            Popular Destinations
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider mb-4">
            EXPLORE THE <span className="gradient-text">WORLD</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Curated destinations handpicked by our AI for the most unforgettable experiences
          </p>
        </div>
      </div>

      <div className="relative">
        <Swiper
          modules={[EffectCoverflow, Autoplay, Navigation]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 2,
            slideShadows: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: '.slider-next',
            prevEl: '.slider-prev',
          }}
          loop={true}
          className="!py-8"
        >
          {slides.map((slide) => (
            <SwiperSlide
              key={slide.name}
              className="!w-[300px] sm:!w-[360px] md:!w-[420px]"
            >
              <a href={`/dashboard?destination=${encodeURIComponent(slide.name)}`} className="block group relative h-[400px] sm:h-[480px] md:h-[520px] rounded-3xl overflow-hidden cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent" />

                {/* Region badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass text-xs text-white/80 font-medium tracking-wide">
                  #{slide.region}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-3xl md:text-4xl text-white tracking-wider mb-1">
                    {slide.name.toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-2 text-dark-300 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {slide.country}
                  </div>

                  {/* Hover action */}
                  <div className="mt-4 flex items-center gap-2 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>Plan this trip</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation arrows */}
        <button className="slider-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="slider-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
