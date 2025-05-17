import React from "react";
import { Link } from "react-router-dom";
import { moods } from "../constants/mood";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
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
        
        <Link to="/track" className="cta-button">
          Start Tracking Now
        </Link>
      </div>
    </div>
  );
}
