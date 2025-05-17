import React, { useState, useEffect } from "react";
import { getMoods } from "../utils/storage";
import { moods } from "../constants/mood";
import "../styles/MoodCalendar.css";

export default function MoodCalendar() {
  const [moodData, setMoodData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  useEffect(() => {
    const allMoods = getMoods();
    setMoodData(allMoods);
  }, []);
  
  // Get mood emoji by label
  const getMoodEmoji = (label) => {
    const mood = moods.find(m => m.label === label);
    return mood ? mood.emoji : "";
  };
  
  // Get mood color by label
  const getMoodColor = (label) => {
    const mood = moods.find(m => m.label === label);
    switch(mood?.label) {
      case "Happy": return "var(--happy-color)";
      case "Neutral": return "var(--neutral-color)";
      case "Sad": return "var(--sad-color)";
      case "Angry": return "var(--angry-color)";
      default: return "transparent";
    }
  };
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().slice(0, 10);
      const mood = moodData[dateString];
      
      days.push({
        day,
        date: dateString,
        mood,
        isToday: dateString === new Date().toISOString().slice(0, 10)
      });
    }
    
    return days;
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };
  
  // Format month and year
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const calendarDays = generateCalendarDays();
  
  return (
    <div className="mood-calendar">
      <div className="calendar-header">
        <button 
          className="calendar-nav-button" 
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          &lt;
        </button>
        <h2 className="calendar-title">{formatMonthYear(currentMonth)}</h2>
        <button 
          className="calendar-nav-button" 
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>
      
      <div className="calendar-weekdays">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
      </div>
      
      <div className="calendar-days">
        {calendarDays.map((dayData, index) => (
          <div 
            key={index} 
            className={`calendar-day ${!dayData.day ? 'empty' : ''} ${dayData.isToday ? 'today' : ''}`}
          >
            {dayData.day && (
              <>
                <div className="day-number">{dayData.day}</div>
                {dayData.mood && (
                  <div 
                    className="day-mood" 
                    style={{ backgroundColor: getMoodColor(dayData.mood) }}
                  >
                    {getMoodEmoji(dayData.mood)}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}