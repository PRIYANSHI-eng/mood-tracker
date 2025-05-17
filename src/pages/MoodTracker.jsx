import React, { useState, useEffect } from "react";
import EmojiPicker from "../components/EmojiPicker";
import MoodCalendar from "../components/MoodCalendar";
import MoodStats from "../components/MoodStats";
import MoodInsights from "../components/MoodInsights";
import LoadingSpinner from "../components/LoadingSpinner";
import { saveMood, getMoods } from "../utils/storage";
import { moods } from "../constants/mood";
import "../styles/MoodTracker.css";

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState({});
  const [todayMood, setTodayMood] = useState(null);
  const [activeTab, setActiveTab] = useState("today"); // "today", "calendar", "stats", "insights"
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    setTimeout(() => {
      const allMoods = getMoods();
      setMoodHistory(allMoods);
      
      // Check if user already logged mood today
      const today = new Date().toISOString().slice(0, 10);
      if (allMoods[today]) {
        setTodayMood(allMoods[today]);
        setSelectedMood(allMoods[today]);
      }
      
      setIsLoading(false);
    }, 800); // Simulate network delay
  }, []);

  function handleSelectMood(label) {
    setSelectedMood(label);
    setTodayMood(label);
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    saveMood(today, label);
    
    // Update local state
    setMoodHistory(prev => ({
      ...prev,
      [today]: label
    }));
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  }

  // Get mood emoji by label
  const getMoodEmoji = (label) => {
    const mood = moods.find(m => m.label === label);
    return mood ? mood.emoji : "";
  };

  // Get recent moods (last 7 days)
  const getRecentMoods = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().slice(0, 10));
    }
    
    return dates.map(date => ({
      date,
      mood: moodHistory[date] || null,
      formattedDate: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }));
  };

  // Render the active tab content
  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    switch (activeTab) {
      case "today":
        return (
          <div className="mood-card">
            <h1 className="mood-title">How are you feeling today?</h1>
            
            {todayMood ? (
              <div className="mood-today">
                <p className="mood-today-text">You're feeling <span style={{ fontWeight: 600, color: '#4338ca' }}>{todayMood}</span> today</p>
                <div className="mood-today-emoji">{getMoodEmoji(todayMood)}</div>
                <p className="mood-today-change">Want to change your mood?</p>
              </div>
            ) : (
              <p className="mood-subtitle">Select your mood for today</p>
            )}
            
            <EmojiPicker selectedMood={selectedMood} onSelectMood={handleSelectMood} />
            
            {saveSuccess && (
              <div className="save-success">
                <div className="success-icon">✓</div>
                <p>Your mood has been saved!</p>
              </div>
            )}
            
            <div className="mood-recent">
              <h2 className="mood-recent-title">Your Recent Moods</h2>
              
              <div className="mood-history-grid">
                {getRecentMoods().map(({ date, mood, formattedDate }) => (
                  <div key={date} className="mood-day">
                    <div className="mood-day-date">{formattedDate}</div>
                    <div className="mood-day-emoji-container">
                      {mood ? (
                        <span className="mood-day-emoji">{getMoodEmoji(mood)}</span>
                      ) : (
                        <span className="mood-day-empty">No data</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "calendar":
        return <MoodCalendar />;
      case "stats":
        return <MoodStats />;
      case "insights":
        return <MoodInsights />;
      default:
        return null;
    }
  };

  return (
    <div className="mood-tracker-container">
      <div className="mood-tabs">
        <button 
          className={`mood-tab ${activeTab === "today" ? "active" : ""}`}
          onClick={() => setActiveTab("today")}
          aria-label="Today's mood"
        >
          <span className="tab-icon">📅</span>
          <span className="tab-text">Today</span>
        </button>
        <button 
          className={`mood-tab ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("calendar")}
          aria-label="Calendar view"
        >
          <span className="tab-icon">🗓️</span>
          <span className="tab-text">Calendar</span>
        </button>
        <button 
          className={`mood-tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
          aria-label="Statistics view"
        >
          <span className="tab-icon">📊</span>
          <span className="tab-text">Statistics</span>
        </button>
        <button 
          className={`mood-tab ${activeTab === "insights" ? "active" : ""}`}
          onClick={() => setActiveTab("insights")}
          aria-label="Insights view"
        >
          <span className="tab-icon">💡</span>
          <span className="tab-text">Insights</span>
        </button>
      </div>
      
      {renderTabContent()}
    </div>
  );
}