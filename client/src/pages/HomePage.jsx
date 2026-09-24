import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import RoleCards from '../components/RoleCards';
import PopularRoutes from '../components/PopularRoutes';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <RoleCards />
        <PopularRoutes />
      </main>
      <Footer />
    </div>
  );
}
