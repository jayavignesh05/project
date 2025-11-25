import React, { useState } from "react";
import { FaStar, FaCommentDots } from "react-icons/fa6";
import FeedbackPlay from "../FeedbackPlay";

const FeedbackList = ({ resources }) => {
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);

  // VIEW 1: PLAY MODE
  if (activeFeedbackId) {
    return (
      <FeedbackPlay 
        courseId={activeFeedbackId} 
        onBack={() => setActiveFeedbackId(null)} 
      />
    );
  }

  // VIEW 2: LIST MODE
  return (
    <div className="addon-group">
      <div className="resources-list">
        {resources.map((res) => (
          <div key={res.id} className="interactive-row-card">
            
            {/* 1. Left: Icon Box (Purple/Pink for Feedback) */}
            <div className="interactive-icon-box feedback-style">
              <FaStar />
            </div>

            {/* 2. Center: Info */}
            <div className="interactive-info">
              <h4 className="interactive-title">{res.title}</h4>
              <span className="interactive-subtitle">Share your thoughts</span>
            </div>

            {/* 3. Right: Action Button */}
            <button 
              className="interactive-btn feedback-btn-style"
              onClick={() => setActiveFeedbackId(res.url_or_id)}
            >
              Give Feedback <FaCommentDots />
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;