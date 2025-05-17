import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { moods } from "../constants/mood";
import "../styles/Home.css";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  
  useEffect(() => {
    // Set loaded state after a short delay for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const features = [
    {
      id: 1,
      icon: "📊",
      title: "Track Daily Moods",
      text: "Easily record how you're feeling each day with our intuitive emoji picker."
    },
    {
      id: 2,
      icon: "🗓️",
      title: "Calendar View",
      text: "Visualize your mood patterns over time with our monthly calendar view."
    },
    {
      id: 3,
      icon: "📈",
      title: "Detailed Statistics",
      text: "Gain insights through comprehensive statistics about your emotional health."
    },
    {
      id: 4,
      icon: "💡",
      title: "Personalized Insights",
      text: "Receive custom insights based on your unique mood patterns and trends."
    }
  ];
  
  return (
    <div className={`home-container ${isLoaded ? 'loaded' : ''}`}>
      <div className="home-content">
        <h1 className="home-title">
          Welcome to MoodTracker
        </h1>
        
        <p className="home-subtitle">
          Your personal journey to emotional well-being starts here. Track your moods, discover patterns, and gain insights into your emotional health.
        </p>
        
        <div className="emoji-container">
          {moods.map(({ emoji, label }, index) => (
            <div 
              key={label} 
              className="emoji-bounce" 
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>
        
        <div className="features-card">
          <h2 className="features-title">Why Track Your Mood?</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Identify patterns in your emotional well-being</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Understand triggers that affect your mood</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Track your progress over time</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Develop better self-awareness</span>
            </div>
          </div>
        </div>
        
        <div className="app-features">
          <h2 className="app-features-title">Powerful Features</h2>
          
          <div className="app-features-grid">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className={`app-feature-card ${activeFeature === feature.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(feature.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="feature-card-icon">{feature.icon}</div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-text">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cta-section">
          <h2 className="cta-title">Ready to start your journey?</h2>
          <p className="cta-text">Begin tracking your moods today and discover insights about your emotional well-being.</p>
          <Link to="/track" className="cta-button">
            Start Tracking Now
          </Link>
        </div>
      </div>
    </div>
  );
}
