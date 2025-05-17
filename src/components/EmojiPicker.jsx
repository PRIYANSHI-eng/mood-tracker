import React from "react";
import { moods } from "../constants/mood";
import "../styles/EmojiPicker.css";

export default function EmojiPicker({ selectedMood, onSelectMood }) {
  return (
    <div className="emoji-picker">
      {moods.map(({ emoji, label }) => (
        <button
          key={label}
          className={`emoji-button ${label} ${selectedMood === label ? 'selected' : ''}`}
          onClick={() => onSelectMood(label)}
          aria-label={label}
          type="button"
        >
          <span className="emoji-icon">{emoji}</span>
          <span className="emoji-label">{label}</span>
        </button>
      ))}
    </div>
  );
}
