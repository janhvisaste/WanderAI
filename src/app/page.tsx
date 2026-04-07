'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';

// Dynamic imports for heavier components
const DestinationSlider = dynamic(() => import('@/components/DestinationSlider'), { ssr: false });
const SearchBar = dynamic(() => import('@/components/SearchBar'), { ssr: false });
const TrendingDestinations = dynamic(() => import('@/components/TrendingDestinations'), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: false });
const FeaturesGrid = dynamic(() => import('@/components/FeaturesGrid'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <HeroSection />
      <DestinationSlider />
      <SearchBar />
      <TrendingDestinations />
      <HowItWorks />
      <FeaturesGrid />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
