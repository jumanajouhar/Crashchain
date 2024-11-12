import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Login from './components/login';
import SignUp from './components/signup';
import DashBoard from './pages/dashboard';
import ReportPage from './pages/ReportPage';  // Import the ReportPage component
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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashBoard />} />
        {/* Add the new route for the ReportPage */}
        <Route path="/report" element={<ReportPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}
