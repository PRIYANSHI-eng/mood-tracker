import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import MoodTracker from "./pages/MoodTracker";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

// ScrollToTop component to ensure page scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Footer component
function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-logo">MoodTracker</div>
        <p className="footer-tagline">Track your emotional journey</p>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
        <p className="footer-copyright">© {new Date().getFullYear()} MoodTracker. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="app-loading-screen">
        <LoadingSpinner />
        <h1 className="loading-title">MoodTracker</h1>
        <p className="loading-subtitle">Your emotional journey begins...</p>
      </div>
    );
  }
  
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track" element={<MoodTracker />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
