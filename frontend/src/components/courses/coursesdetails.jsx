import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaVideo,
  FaFilePdf,
  FaClipboardQuestion,
  FaLayerGroup,
  FaAward,
  FaDownload,
} from "react-icons/fa6";
import"../courses/addons.css"

import FeedbackList from "./addons/FeedbackList";
import VideoList from "./addons/VideoList";
import FileList from "./addons/FileList";
import QuizList from "./addons/QuizList";
import Spinner from "../courses/Spinner";

const CourseDetail = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  const base_api = "http://localhost:7000/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.post(`${base_api}/courses/my-courses`, {
          token: token,
        });
        const foundCourse = response.data.find(
          (c) => c.courses_code === courseCode
        );

        if (foundCourse) {
          setCourse(foundCourse);
          if (foundCourse.addons && foundCourse.addons.length > 0) {
            setActiveTab(foundCourse.addons[0].type);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseCode]);

  const handleLocalDownload = () => {
    const fileUrl = "/certificates/sample-certificate.jpg";

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute(
      "download",
      `${course.courses_name.replace(/\s+/g, "_")}_Certificate.jpg`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) return <Spinner />;
  if (!course) return <div className="p-4">Course not found!</div>;

  const availableTabs = course.addons
    ? [...new Set(course.addons.map((addon) => addon.type))]
    : [];

  const getTabIcon = (type) => {
    if (type === "video") return <FaVideo />;
    if (
      type === "ebook" ||
      type === "syllabus" ||
      type === "interview_question" ||
      type === "reference_link"
    )
      return <FaFilePdf />;
    if (type === "quiz" || type === "feedback") return <FaClipboardQuestion />;
    return <FaLayerGroup />;
  };

  return (
    <div className="p-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => navigate(-1)} className="back-btn-modern">
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>

        {course.status === 2 && (
          <button className="cert-download-btn" onClick={handleLocalDownload}>
            <FaDownload />
            <span>Get Certificate</span>
          </button>
        )}
      </div>

      <div className="tabs-container">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {getTabIcon(tab)}
            <span>{tab.replace(/_/g, " ").toUpperCase()}</span>
          </button>
        ))}
      </div>

      <div className="tab-content-area">
        {course.addons && course.addons.length > 0 ? (
          <div key={activeTab} className="tab-animate-wrapper">
            <div className="addons-grid">
              {course.addons
                .filter((group) => group.type === activeTab)
                .map((group, index) => {
                  switch (group.type) {
                    case "video":
                      return (
                        <VideoList
                          key={index}
                          resources={group.resources}
                          base_api={base_api}
                          courseName={course.courses_name}
                        />
                      );
                    case "ebook":
                    case "syllabus":
                    case "interview_question":
                    case "reference_link":
                      return (
                        <FileList
                          key={index}
                          type={group.type}
                          resources={group.resources}
                          base_api={base_api}
                        />
                      );
                    case "quiz":
                      return (
                        <QuizList key={index} resources={group.resources} />
                      );
                    case "feedback":
                      return (
                        <FeedbackList key={index} resources={group.resources} />
                      );
                    default:
                      return null;
                  }
                })}
            </div>
          </div>
        ) : (
          <div className="empty-state">No materials available yet.</div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
