/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Services from './components/home/Services';
import Portfolio from './components/home/Portfolio';
import Testimonials from './components/home/Testimonials';
import WhyUs from './components/home/WhyUs';
import Contact from './components/home/Contact';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';
import ScrollToTop from './components/ui/ScrollToTop';
import AdminDashboard from './components/admin/AdminDashboard';

const HomePage = () => (
  <div className="min-h-screen">
    <Navbar />
    <main>
      <Hero />
      <WhyUs />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
    </main>
    <Footer />
    <FloatingWhatsApp />
    <ScrollToTop />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

