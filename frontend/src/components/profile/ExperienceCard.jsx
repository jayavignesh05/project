import React from "react";
import { MdOutlineEdit, MdCheck, MdClear, MdAdd } from "react-icons/md";
import dayjs from "dayjs";

const ExperienceCard = ({
  isEditing,
  experienceData,
  formData,
  dropdownData,
  handleExperienceInputChange,
  onEdit,
  onSave,
  onCancel,
  onAddExperience,
  containerRef
}) => {
  return (
    <div className={`grid-card experience-card ${isEditing ? "is-editing" : ""}`}>
      <h3>Work Experience</h3>
      {isEditing ? (
        <>
          <div ref={containerRef}>
            {formData.experiences &&
              formData.experiences.map((exp, index) => (
                <div key={exp.id || `new-${index}`} className="address-form-group">
                  <div className="form-rows">
                    <div className="form-group">
                      <label>Designation</label>
                      <input
                        type="text"
                        name="designation_name"
                        value={exp.designation_name || ""}
                        onChange={(e) => handleExperienceInputChange(index, e)}
                        className="form-control"
                        list={`designations-list-${index}`}
                        placeholder="Select or type designation"
                      />
                      <datalist id={`designations-list-${index}`}>
                        {dropdownData.designations.map((d) => (
                          <option key={d.id} data-id={d.id} value={d.name} />
                        ))}
                      </datalist>
                    </div>
                    <div className="form-group">
                      <label>Company Name</label>
                      <input
                        type="text"
                        name="company_name"
                        value={exp.company_name || ""}
                        onChange={(e) => handleExperienceInputChange(index, e)}
                        className="form-control"
                        list={`companies-list-${index}`}
                        placeholder="Select or type company"
                      />
                      <datalist id={`companies-list-${index}`}>
                        {dropdownData.companies.map((c) => (
                          <option key={c.id} data-id={c.id} value={c.name} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div className="form-rows">
                    <div className="form-group">
                      <label>Company Location</label>
                      <input
                        type="text"
                        name="company_location"
                        value={exp.company_location || ""}
                        onChange={(e) => handleExperienceInputChange(index, e)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Joining Date</label>
                      <input
                        type="date"
                        name="joining_date"
                        value={exp.joining_date ? dayjs(exp.joining_date).format("YYYY-MM-DD") : ""}
                        onChange={(e) => handleExperienceInputChange(index, e)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Relieving Date</label>
                      <input
                        type="date"
                        name="relieving_date"
                        value={exp.relieving_date ? dayjs(exp.relieving_date).format("YYYY-MM-DD") : ""}
                        onChange={(e) => handleExperienceInputChange(index, e)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : experienceData.length > 0 ? (
        experienceData.map((exp) => (
          <div key={exp.id} className="work-experience-item">
            <div className="experience-header">
              <h4>{exp.designation_name}</h4>
              <span className="experience-dates">
                {dayjs(exp.joining_date).format("MMM YYYY")} -{" "}
                {exp.relieving_date ? dayjs(exp.relieving_date).format("MMM YYYY") : "Present"}
              </span>
            </div>
            <p className="company-name">
              {exp.company_name} - {exp.company_location}
            </p>
          </div>
        ))
      ) : (
        <p>No work experience data available.</p>
      )}
      <div className="header-actions">
        {isEditing ? (
          <div className="edit-controls">
            <button onClick={onAddExperience} className="add-btn">
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

export default ExperienceCard;