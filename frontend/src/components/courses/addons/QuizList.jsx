import { useState } from "react";
import { FaClipboardQuestion, FaArrowRight } from "react-icons/fa6"; // Added Arrow Icon
import QuizPlay from "../QuizPlay";

const QuizList = ({ resources }) => {
  const [activeQuizId, setActiveQuizId] = useState(null);

  // VIEW 1: PLAY MODE
  if (activeQuizId) {
    return (
      <QuizPlay 
        courseId={activeQuizId} 
        onBack={() => setActiveQuizId(null)} 
      />
    );
  }

  // VIEW 2: LIST MODE
  return (
    <div className="addon-group">
      <div className="resources-list">
        {resources.map((res) => (
          <div key={res.id} className="interactive-row-card">
            
            {/* 1. Left: Icon Box (Yellow/Amber for Quiz) */}
            <div className="interactive-icon-box quiz-style">
              <FaClipboardQuestion />
            </div>

            {/* 2. Center: Info */}
            <div className="interactive-info">
              <h4 className="interactive-title">{res.title}</h4>
              <span className="interactive-subtitle">Knowledge Check</span>
            </div>

            {/* 3. Right: Action Button */}
            <button 
              className="interactive-btn quiz-btn-style"
              onClick={() => setActiveQuizId(res.url_or_id)}
            >
              Start Quiz <FaArrowRight />
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;