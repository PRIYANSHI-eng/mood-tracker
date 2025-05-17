import React, { useState, useEffect } from "react";
import { getMoods } from "../utils/storage";
import { moods } from "../constants/mood";
import "../styles/MoodInsights.css";

export default function MoodInsights() {
  const [moodData, setMoodData] = useState({});
  const [insights, setInsights] = useState([]);
  
  useEffect(() => {
    const allMoods = getMoods();
    setMoodData(allMoods);
    
    // Generate insights when mood data changes
    if (Object.keys(allMoods).length > 0) {
      generateInsights(allMoods);
    }
  }, []);
  
  // Generate insights based on mood data
  const generateInsights = (data) => {
    const generatedInsights = [];
    
    // Get mood counts
    const moodCounts = {};
    moods.forEach(mood => {
      moodCounts[mood.label] = 0;
    });
    
    Object.values(data).forEach(mood => {
      if (moodCounts[mood] !== undefined) {
        moodCounts[mood]++;
      }
    });
    
    // Find most frequent mood
    let maxCount = 0;
    let mostFrequentMood = null;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentMood = mood;
      }
    });
    
    if (mostFrequentMood) {
      generatedInsights.push({
        id: 'most-frequent',
        title: 'Most Frequent Mood',
        description: `Your most frequent mood is "${mostFrequentMood}". This mood represents ${Math.round((maxCount / Object.keys(data).length) * 100)}% of your entries.`,
        emoji: getMoodEmoji(mostFrequentMood)
      });
    }
    
    // Check for mood streaks
    const sortedDates = Object.keys(data).sort();
    if (sortedDates.length >= 3) {
      const streaks = findStreaks(sortedDates, data);
      
      if (streaks.length > 0) {
        const longestStreak = streaks.reduce((longest, current) => 
          current.length > longest.length ? current : longest, streaks[0]);
        
        if (longestStreak.length >= 3) {
          generatedInsights.push({
            id: 'streak',
            title: 'Mood Streak Detected',
            description: `You had "${longestStreak.mood}" for ${longestStreak.length} consecutive days from ${formatDate(longestStreak.start)} to ${formatDate(longestStreak.end)}.`,
            emoji: getMoodEmoji(longestStreak.mood)
          });
        }
      }
    }
    
    // Check for mood patterns by day of week
    if (sortedDates.length >= 7) {
      const dayOfWeekPatterns = analyzeDayOfWeekPatterns(sortedDates, data);
      
      Object.entries(dayOfWeekPatterns).forEach(([day, dominantMood]) => {
        if (dominantMood) {
          generatedInsights.push({
            id: `day-pattern-${day}`,
            title: `${day} Pattern`,
            description: `You tend to feel "${dominantMood}" on ${day}s.`,
            emoji: getMoodEmoji(dominantMood)
          });
        }
      });
    }
    
    // If no insights were generated, add a default one
    if (generatedInsights.length === 0) {
      generatedInsights.push({
        id: 'not-enough-data',
        title: 'Keep Tracking',
        description: 'Continue tracking your moods to receive personalized insights about your emotional patterns.',
        emoji: '📊'
      });
    }
    
    setInsights(generatedInsights);
  };
  
  // Find mood streaks (same mood for consecutive days)
  const findStreaks = (dates, data) => {
    const streaks = [];
    let currentStreak = null;
    
    for (let i = 0; i < dates.length; i++) {
      const currentDate = dates[i];
      const currentMood = data[currentDate];
      
      if (!currentStreak) {
        // Start a new streak
        currentStreak = {
          mood: currentMood,
          start: currentDate,
          end: currentDate,
          length: 1
        };
      } else if (currentMood === currentStreak.mood && isConsecutiveDay(currentStreak.end, currentDate)) {
        // Continue the streak
        currentStreak.end = currentDate;
        currentStreak.length++;
      } else {
        // End the streak and start a new one
        if (currentStreak.length >= 3) {
          streaks.push(currentStreak);
        }
        
        currentStreak = {
          mood: currentMood,
          start: currentDate,
          end: currentDate,
          length: 1
        };
      }
    }
    
    // Add the last streak if it's long enough
    if (currentStreak && currentStreak.length >= 3) {
      streaks.push(currentStreak);
    }
    
    return streaks;
  };
  
  // Check if two dates are consecutive days
  const isConsecutiveDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Set time to midnight to compare only dates
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = d2 - d1;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    return diffDays === 1;
  };
  
  // Analyze patterns by day of week
  const analyzeDayOfWeekPatterns = (dates, data) => {
    const dayOfWeekCounts = {
      'Sunday': {},
      'Monday': {},
      'Tuesday': {},
      'Wednesday': {},
      'Thursday': {},
      'Friday': {},
      'Saturday': {}
    };
    
    // Initialize mood counts for each day
    Object.keys(dayOfWeekCounts).forEach(day => {
      moods.forEach(mood => {
        dayOfWeekCounts[day][mood.label] = 0;
      });
    });
    
    // Count moods by day of week
    dates.forEach(date => {
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      const mood = data[date];
      
      if (dayOfWeekCounts[dayOfWeek] && dayOfWeekCounts[dayOfWeek][mood] !== undefined) {
        dayOfWeekCounts[dayOfWeek][mood]++;
      }
    });
    
    // Find dominant mood for each day of week
    const patterns = {};
    
    Object.entries(dayOfWeekCounts).forEach(([day, moodCounts]) => {
      let maxCount = 0;
      let dominantMood = null;
      let totalCount = 0;
      
      Object.entries(moodCounts).forEach(([mood, count]) => {
        totalCount += count;
        if (count > maxCount) {
          maxCount = count;
          dominantMood = mood;
        }
      });
      
      // Only consider it a pattern if the dominant mood appears at least twice
      // and represents at least 50% of the entries for that day
      if (maxCount >= 2 && totalCount > 0 && (maxCount / totalCount) >= 0.5) {
        patterns[day] = dominantMood;
      } else {
        patterns[day] = null;
      }
    });
    
    return patterns;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get mood emoji by label
  const getMoodEmoji = (label) => {
    const mood = moods.find(m => m.label === label);
    return mood ? mood.emoji : "";
  };
  
  return (
    <div className="mood-insights">
      <h2 className="insights-title">Your Mood Insights</h2>
      
      {insights.length === 0 ? (
        <div className="no-insights-message">
          <p>Track your moods regularly to receive personalized insights.</p>
        </div>
      ) : (
        <div className="insights-list">
          {insights.map(insight => (
            <div key={insight.id} className="insight-card">
              <div className="insight-emoji">{insight.emoji}</div>
              <div className="insight-content">
                <h3 className="insight-title">{insight.title}</h3>
                <p className="insight-description">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="insights-tip">
        <h3 className="tip-title">Tip of the Day</h3>
        <p className="tip-text">
          Tracking your mood at the same time each day can help establish a consistent routine and provide more accurate insights into your emotional patterns.
        </p>
      </div>
    </div>
  );
}