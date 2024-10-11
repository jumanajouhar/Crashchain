import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Login from './components/login';
import ContentSection from './components/contentsection';
import Hero from './components/hero';
import Footer from './components/footer';
import PricingView from './components/Pricing/pricingview';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Define the route for the main page */}
        <Route path="/" element={
          <>
            <Hero />
            <ContentSection />
            <PricingView />
          </>
        } />
        {/* Define the route for the login page */}
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}
