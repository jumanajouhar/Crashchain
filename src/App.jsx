import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Header from './components/header';
import Login from './components/login';
import SignUp from './components/signup';
import Hero from './components/hero';
import ContentSection from './components/contentsection';
import Footer from './components/footer';
import DashBoard from './pages/dashboard';
import FileUpload from './pages/upload';
import HardwareSimulator from './pages/Hardsim';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ContentSection />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/hardsim" element={<HardwareSimulator />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
