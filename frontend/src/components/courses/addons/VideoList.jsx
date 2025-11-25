import React, { useState } from "react";
import { FaPlayCircle, FaTimes } from "react-icons/fa"; // Changed icon to Circle for better look

const VideoList = ({ resources, base_api, courseName }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleOpenVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const getVideoUrl = (video) => {
    if (!video || !video.url_or_id) return "";
    const cleanBase = base_api.replace(/\/api$/, ""); 
    return `${cleanBase}${video.url_or_id}`;
  };

  return (
    <div className="addon-group">
      <div className="resources-list">
        {resources.map((res) => (
          // NEW STRUCTURE: Row Layout
          <div key={res.id} className="video-row-card" onClick={() => handleOpenVideo(res)}>
            
            {/* 1. LEFT: Small Video Preview */}
            <div className="video-preview-left">
               <video 
                 src={getVideoUrl(res)} 
                 className="mini-video-player"
                 muted // Muted so it doesn't make noise
                 preload="metadata" // Loads only first frame
               />
               {/* Overlay to make it look like a thumbnail */}
               <div className="preview-overlay"></div>
            </div>

            {/* 2. CENTER: Course Name & Title */}
            <div className="video-info-center">
              <span className="course-sub-name">{courseName}</span>
              <h4 className="video-main-title">{res.title}</h4>
            </div>

            {/* 3. RIGHT: Big Play Button */}
            <div className="play-btn-right">
              <FaPlayCircle />
            </div>

          </div>
        ))}
      </div>

      {/* --- Video Modal Popup (Same as before) --- */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={handleCloseVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{courseName} - {selectedVideo.title}</h3>
              <button className="close-btn" onClick={handleCloseVideo}>
                <FaTimes />
              </button>
            </div>
            <div className="video-wrapper">
              <video
                width="100%"
                height="450"
                controls
                autoPlay
                controlsList="nodownload"
                style={{ display: "block", backgroundColor: "black", borderRadius: "8px" }}
              >
                <source key={selectedVideo.url_or_id} src={getVideoUrl(selectedVideo)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoList;