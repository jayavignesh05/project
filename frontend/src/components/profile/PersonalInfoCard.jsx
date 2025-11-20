import React from "react";
import { MdOutlineEdit, MdCheck, MdClear, MdAdd } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { BsGenderAmbiguous } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";

const PersonalInfoCard = ({
  isEditing,
  profileData,
  formData,
  dropdownData,
  handleInputChange,
  handleAddressInputChange,
  onEdit,
  onSave,
  onCancel,
  onAddAddress,
  formatDate,
  containerRef
}) => {
  return (
    <div className={`grid-card profile-summary-card ${isEditing ? "is-editing" : ""}`}>
      <h3>Personal Information</h3>
      {isEditing ? (
        <>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender_id"
              value={formData.gender_id || ""}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Gender</option>
              {dropdownData.genders.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.gender_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ""}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <hr className="form-divider" />
          <div className="address-edit-header">
            <h4>Addresses</h4>
          </div>
          <div ref={containerRef}>
            {formData.addresses &&
              formData.addresses.map((addr, index) => (
                <div key={addr.address_id || `new-${index}`} className="address-form-group">
                  <div className="form-group">
                    <label>Door No</label>
                    <input
                      type="text"
                      name="door_no"
                      value={addr.door_no || ""}
                      onChange={(e) => handleAddressInputChange(index, e)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      value={addr.street || ""}
                      onChange={(e) => handleAddressInputChange(index, e)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Area</label>
                    <input
                      type="text"
                      name="area"
                      value={addr.area || ""}
                      onChange={(e) => handleAddressInputChange(index, e)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={addr.city || ""}
                      onChange={(e) => handleAddressInputChange(index, e)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={addr.pincode || ""}
                      onChange={(e) => handleAddressInputChange(index, e)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      name="countries_id"
                      value={addr.countries_id || ""}
                      onChange={(e) => handleAddressInputChange(index, e)}
                      className="form-control"
                    >
                      <option value="">Select Country</option>
                      {dropdownData.countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <select
                      name="state_id"
                      value={addr.state_id || ""}
                      onChange={(e) => handleAddressInputChange(index, e)}
                      className="form-control"
                      disabled={!addr.countries_id}
                    >
                      <option value="">Select State</option>
                      {dropdownData.states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
          </div>
          <div className="header-actions"></div>
        </>
      ) : (
        <>
          <div className="contact-item">
            <BsGenderAmbiguous />
            <span>{profileData.gender || "N/A"}</span>
          </div>
          <div className="contact-item">
            <CiCalendar />
            <span>{formatDate(profileData.date_of_birth)}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <div className="contact-item">
              <IoLocationOutline />
            </div>
            <div>
              {profileData.addresses && profileData.addresses.length > 0 ? (
                profileData.addresses.map((addr) => (
                  <div key={addr.address_id} className="address-item">
                    <div>{addr.door_no}, {addr.street}</div>
                    <div>{addr.area}, {addr.city} - {addr.pincode}</div>
                    <div>{addr.state_name}, {addr.country_name}</div>
                  </div>
                ))
              ) : (
                <p>No addresses found.</p>
              )}
            </div>
          </div>
        </>
      )}
      <div className="header-actions">
        {isEditing ? (
          <div className="edit-controls">
            <button onClick={onAddAddress} className="add-btn">
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

export default PersonalInfoCard;