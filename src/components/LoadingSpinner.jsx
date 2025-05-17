import React from "react";
import "../styles/LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-emoji">😊</div>
        <div className="spinner-emoji">😐</div>
        <div className="spinner-emoji">😢</div>
        <div className="spinner-emoji">😡</div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}