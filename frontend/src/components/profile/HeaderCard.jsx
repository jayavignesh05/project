import React from "react";
import { MdOutlineEdit, MdCheck, MdClear } from "react-icons/md";

const HeaderCard = ({
  isEditing,
  profileData,
  formData,
  handleInputChange,
  dropdownData,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className={`grid-card header-card ${isEditing ? "is-editing" : ""}`}>
      {isEditing ? (
        <>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Current Status</label>
            <select
              name="current_status_id"
              value={formData.current_status_id || ""}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Status</option>
              {dropdownData.currentStatuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <>
          <h2>
            {profileData.first_name} {profileData.last_name}
          </h2>
          <p>{profileData.current_status_name || "N/A"}</p>
        </>
      )}
      <div className="header-actions">
        {isEditing ? (
          <div className="edit-controls">
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

export default HeaderCard;