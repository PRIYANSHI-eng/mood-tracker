import React, { useState, useEffect } from "react";
import { getMoods } from "../utils/storage";
import { moods } from "../constants/mood";
import "../styles/MoodStats.css";

export default function MoodStats() {
  const [moodData, setMoodData] = useState({});
  const [timeRange, setTimeRange] = useState("month"); // "week", "month", "year", "all"
  
  useEffect(() => {
    const allMoods = getMoods();
    setMoodData(allMoods);
  }, []);
  
  // Filter mood data based on time range
  const getFilteredMoodData = () => {
    const now = new Date();
    const filteredData = {};
    
    Object.entries(moodData).forEach(([date, mood]) => {
      const moodDate = new Date(date);
      let include = false;
      
      switch (timeRange) {
        case "week":
          // Last 7 days
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          include = moodDate >= weekAgo;
          break;
        case "month":
          // Last 30 days
          const monthAgo = new Date(now);
          monthAgo.setDate(now.getDate() - 30);
          include = moodDate >= monthAgo;
          break;
        case "year":
          // Last 365 days
          const yearAgo = new Date(now);
          yearAgo.setDate(now.getDate() - 365);
          include = moodDate >= yearAgo;
          break;
        case "all":
          // All time
          include = true;
          break;
        default:
          include = true;
      }
      
      if (include) {
        filteredData[date] = mood;
      }
    });
    
    return filteredData;
  };
  
  // Calculate mood statistics
  const calculateMoodStats = () => {
    const filteredData = getFilteredMoodData();
    const stats = {
      total: Object.keys(filteredData).length,
      moodCounts: {},
      mostFrequent: null,
      percentages: {}
    };
    
    // Initialize mood counts
    moods.forEach(mood => {
      stats.moodCounts[mood.label] = 0;
    });
    
    // Count occurrences
    Object.values(filteredData).forEach(mood => {
      if (stats.moodCounts[mood] !== undefined) {
        stats.moodCounts[mood]++;
      }
    });
    
    // Find most frequent mood
    if (stats.total > 0) {
      let maxCount = 0;
      let maxMood = null;
      
      Object.entries(stats.moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
          maxCount = count;
          maxMood = mood;
        }
      });
      
      stats.mostFrequent = maxMood;
      
      // Calculate percentages
      Object.entries(stats.moodCounts).forEach(([mood, count]) => {
        stats.percentages[mood] = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
      });
    }
    
    return stats;
  };
  
  const stats = calculateMoodStats();
  
  // Get mood emoji by label
  const getMoodEmoji = (label) => {
    const mood = moods.find(m => m.label === label);
    return mood ? mood.emoji : "";
  };
  
  return (
    <div className="mood-stats">
      <div className="stats-header">
        <h2 className="stats-title">Your Mood Statistics</h2>
        <div className="stats-time-range">
          <button 
            className={`time-range-button ${timeRange === "week" ? "active" : ""}`}
            onClick={() => setTimeRange("week")}
          >
            Week
          </button>
          <button 
            className={`time-range-button ${timeRange === "month" ? "active" : ""}`}
            onClick={() => setTimeRange("month")}
          >
            Month
          </button>
          <button 
            className={`time-range-button ${timeRange === "year" ? "active" : ""}`}
            onClick={() => setTimeRange("year")}
          >
            Year
          </button>
          <button 
            className={`time-range-button ${timeRange === "all" ? "active" : ""}`}
            onClick={() => setTimeRange("all")}
          >
            All Time
          </button>
        </div>
      </div>
      
      {stats.total === 0 ? (
        <div className="no-data-message">
          <p>No mood data available for the selected time range.</p>
        </div>
      ) : (
        <>
          <div className="stats-summary">
            <div className="summary-card">
              <div className="summary-label">Total Entries</div>
              <div className="summary-value">{stats.total}</div>
            </div>
            
            <div className="summary-card">
              <div className="summary-label">Most Frequent Mood</div>
              <div className="summary-value">
                {stats.mostFrequent && (
                  <>
                    <span className="summary-emoji">{getMoodEmoji(stats.mostFrequent)}</span>
                    <span>{stats.mostFrequent}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="mood-distribution">
            <h3 className="distribution-title">Mood Distribution</h3>
            
            <div className="distribution-bars">
              {moods.map(({ label, emoji }) => (
                <div key={label} className="distribution-item">
                  <div className="distribution-label">
                    <span className="distribution-emoji">{emoji}</span>
                    <span>{label}</span>
                  </div>
                  <div className="distribution-bar-container">
                    <div 
                      className={`distribution-bar ${label.toLowerCase()}`}
                      style={{ width: `${stats.percentages[label]}%` }}
                    ></div>
                    <span className="distribution-percentage">{stats.percentages[label]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}