import React from "react";
import { MdOutlineEdit, MdCheck, MdClear, MdOutlineMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";

const ContactCard = ({
  isEditing,
  profileData,
  formData,
  handleInputChange,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className={`grid-card contact-card ${isEditing ? "is-editing" : ""}`}>
      <h3>Contact</h3>
      {isEditing ? (
        <>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email_id"
              value={formData.email_id || ""}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Contact No</label>
            <input
              type="text"
              name="contact_no"
              value={formData.contact_no || ""}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </>
      ) : (
        <>
          <div className="contact-item">
            <MdOutlineMailOutline />
            <span>{profileData.email}</span>
          </div>
          <div className="contact-item">
            <FiPhone />
            <span>{profileData.contact_no}</span>
          </div>
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

export default ContactCard;