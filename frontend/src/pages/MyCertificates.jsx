import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaAward, FaDownload } from "react-icons/fa6";
import "./home.css";
import Spinner from "../components/courses/Spinner";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const base_api = "http://localhost:7000/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.post(`${base_api}/courses/my-courses`, {
          token: token,
        });

        const completedCourses = response.data.filter((c) => c.status === 2);

        setCertificates(completedCourses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleLocalDownload = (courseName) => {
    const fileUrl = "/certificates/sample-certificate.jpg";

    const link = document.createElement("a");
    link.href = fileUrl;

    link.setAttribute(
      "download",
      `${courseName.replace(/\s+/g, "_")}_Certificate.jpg`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="page-title">My Certificates</h2>

      {certificates.length > 0 ? (
        <div className="cert-grid">
          {certificates.map((cert) => (
            <div key={cert.user_course_id} className="cert-card">
              <div className="cert-icon-box">
                <FaAward />
              </div>

              <div className="cert-info">
                <h3>{cert.courses_name}</h3>
                <p>Course Code: {cert.courses_code}</p>
                <span className="completed-date">Status: Completed</span>
              </div>

              <button
                className="download-btn"
                onClick={() => handleLocalDownload(cert.courses_name)}
              >
                <FaDownload /> Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FaAward size={50} color="#cbd5e1" />
          <p>You haven't completed any courses yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
