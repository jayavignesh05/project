import React from "react";
import { MdOutlineEdit, MdCheck, MdClear, MdAdd } from "react-icons/md";
import dayjs from "dayjs";

const EducationCard = ({
  isEditing,
  educationData,
  formData,
  dropdownData,
  handleEducationInputChange,
  onEdit,
  onSave,
  onCancel,
  onAddEducation,
  containerRef
}) => {
  return (
    <div className={`grid-card education-card ${isEditing ? "is-editing" : ""}`}>
      <h3>Education</h3>
      {isEditing ? (
        <>
          <div ref={containerRef}>
            {formData.educations &&
              formData.educations.map((edu, index) => (
                <div key={edu.id || `new-${index}`} className="education-form-group">
                  <div className="form-rows">
                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        type="text"
                        name="name"
                        value={edu.name || ""}
                        onChange={(e) => handleEducationInputChange(index, e)}
                        className="form-control"
                        list={`degrees-list-${index}`}
                        placeholder="Select or type degree"
                      />
                      <datalist id={`degrees-list-${index}`}>
                        {dropdownData.degrees.map((d) => (
                          <option key={d.id} data-id={d.id} value={d.name} />
                        ))}
                      </datalist>
                    </div>
                    <div className="form-group">
                      <label>Institute</label>
                      <input
                        type="text"
                        name="institute_name"
                        value={edu.institute_name || ""}
                        onChange={(e) => handleEducationInputChange(index, e)}
                        className="form-control"
                        list={`institutes-list-${index}`}
                        placeholder="Select or type institute"
                      />
                      <datalist id={`institutes-list-${index}`}>
                        {dropdownData.institutes.map((i) => (
                          <option key={i.id} data-id={i.id} value={i.name} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div className="form-rows">
                    <div className="form-group">
                      <label>Institute Location</label>
                      <input
                        type="text"
                        name="institute_location"
                        value={edu.institute_location || ""}
                        onChange={(e) => handleEducationInputChange(index, e)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Graduation Date</label>
                      <input
                        type="date"
                        name="graduation_date"
                        value={edu.graduation_date ? dayjs(edu.graduation_date).format("YYYY-MM-DD") : ""}
                        onChange={(e) => handleEducationInputChange(index, e)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : educationData.length > 0 ? (
        educationData.map((edu) => (
          <div key={edu.id} className="work-experience-item">
            <div className="experience-header">
              <h4>{edu.name}</h4>
              <span className="experience-dates">
                {dayjs(edu.graduation_date).format("MMM YYYY")}
              </span>
            </div>
            <p className="company-name">
              {edu.institute_name} - {edu.institute_location}
            </p>
          </div>
        ))
      ) : (
        <p>No education data available.</p>
      )}
      <div className="header-actions">
        {isEditing ? (
          <div className="edit-controls">
            <button onClick={onAddEducation} className="add-btn">
              <MdAdd />
            </button>
            <button onClick={onSave} className="save-btn">
              <MdCheck />
            </button>
            <button onClick={onCancel} className="cancel-btn">
              <MdClear />
            </button>
          </div>
        ) : (
          <button onClick={onEdit} className="edit-profile-btn">
            <MdOutlineEdit />
          </button>
        )}
      </div>
    </div>
  );
};

export default EducationCard;