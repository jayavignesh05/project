/* eslint-disable no-empty */
import React, { useState, useEffect, useRef } from "react";
import "./ProfilePage.css";
import profileImage from "../assets/profilepic.png";
import dayjs from "dayjs";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Sub-components
import ProfilePicCard from "../components/profile/ProfilePicCard";

import ContactCard from "../components/profile/ContactCard";

import EducationCard from "../components/profile/EducationCard";

import ExperienceCard from "../components/profile/ExperienceCard";

import HeaderCard from "../components/profile/HeaderCard";

import PersonalInfoCard from "../components/profile/PersonalInfoCard";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [experienceData, setExperienceData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [error, setError] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(profileImage);
  const [shouldScroll, setShouldScroll] = useState(false);

  const educationsContainerRef = useRef(null);
  const addressesContainerRef = useRef(null);
  const experiencesContainerRef = useRef(null);

  const [dropdownData, setDropdownData] = useState({
    genders: [],
    currentStatuses: [],
    countries: [],
    states: [],
    companies: [],
    designations: [],
    degrees: [],
    institutes: [],
  });

  useEffect(() => {
    if (
      editingCard === "personalInfo" &&
      shouldScroll &&
      addressesContainerRef.current?.lastElementChild
    ) {
      addressesContainerRef.current.lastElementChild.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setShouldScroll(false);
    }
  }, [formData.addresses?.length, editingCard, shouldScroll]);

  useEffect(() => {
    if (
      editingCard === "education" &&
      shouldScroll &&
      educationsContainerRef.current?.lastElementChild
    ) {
      educationsContainerRef.current.lastElementChild.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setShouldScroll(false);
    }
  }, [formData.educations?.length, editingCard, shouldScroll]);

  useEffect(() => {
    if (
      editingCard === "experience" &&
      shouldScroll &&
      experiencesContainerRef.current?.lastElementChild
    ) {
      experiencesContainerRef.current.lastElementChild.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setShouldScroll(false);
    }
  }, [formData.experiences?.length, editingCard, shouldScroll]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const [profileRes, experienceRes, educationRes] = await Promise.all([
          axios.post("http://localhost:7000/api/profile/show", { token }),
          axios.post("http://localhost:7000/api/profile/experience", { token }),
          axios.post("http://localhost:7000/api/profile/geteducation", {
            token,
          }),
        ]);

        setProfileData(profileRes.data);
        setExperienceData(experienceRes.data);
        setEducationData(educationRes.data);

        try {
          const profilePicRes = await axios.post(
            "http://localhost:7000/api/profile/getProfilePic",
            { token },
            { responseType: "blob" }
          );
          const imageUrl = URL.createObjectURL(profilePicRes.data);
          setProfilePic(imageUrl);
        } catch { }
      } catch (e) {
        const errorMessage = e.response?.data?.error || e.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const fetchDropdownData = async (types) => {
    const requests = {
      genders: () => axios.get("http://localhost:7000/api/location/genders"),
      currentStatuses: () =>
        axios.get("http://localhost:7000/api/location/currentstatus"),
      countries: () =>
        axios.get("http://localhost:7000/api/location/countries"),
      companies: () =>
        axios.get("http://localhost:7000/api/location/companies"),
      designations: () =>
        axios.get("http://localhost:7000/api/location/designations"),
      degrees: () => axios.get("http://localhost:7000/api/location/degrees"),
      institutes: () =>
        axios.get("http://localhost:7000/api/location/institutes"),
    };

    try {
      const promises = types.map((type) => requests[type]());
      const responses = await Promise.all(promises);
      const newDropdownData = {};
      responses.forEach((res, index) => {
        newDropdownData[types[index]] = res.data;
      });
      setDropdownData((prev) => ({ ...prev, ...newDropdownData }));
    } catch {
      toast.error("Failed to load editing data.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const handleEditClick = async (cardName) => {
    setEditingCard(cardName);
    setShouldScroll(false);

    if (cardName === "header") await fetchDropdownData(["currentStatuses"]);
    else if (cardName === "personalInfo")
      await fetchDropdownData(["genders", "countries"]);
    else if (cardName === "education")
      await fetchDropdownData(["degrees", "institutes"]);
    else if (cardName === "experience")
      await fetchDropdownData(["companies", "designations"]);

    const dob = profileData.date_of_birth
      ? dayjs(profileData.date_of_birth).format("YYYY-MM-DD")
      : "";

    setFormData({
      ...profileData,
      email_id: profileData.email,
      gender_id: profileData.gender_id,
      date_of_birth: dob,
      addresses: profileData.addresses.map((addr) => ({
        ...addr,
        countries_id: addr.countries_id,
        state_id: addr.state_id,
      })),
    });

    if (cardName === "experience") {
      setFormData((prev) => ({
        ...prev,
        experiences: JSON.parse(JSON.stringify(experienceData)),
      }));
    }

    if (cardName === "education") {
      setFormData((prev) => ({
        ...prev,
        educations: JSON.parse(JSON.stringify(educationData)),
      }));
    }

    if (cardName === "personalInfo" && profileData.addresses?.length > 0) {
      fetchStates(profileData.addresses[0].countries_id);
    }
  };

  const handleCancel = () => {
    setEditingCard(null);
    setFormData({});
    setShouldScroll(false);
  };

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { label: "New Address", countries_id: "", state_id: "" },
      ],
    }));
    setShouldScroll(true);
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { joining_date: "", relieving_date: null },
      ],
    }));
    setShouldScroll(true);
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      educations: [...prev.educations, { graduation_date: "" }],
    }));
    setShouldScroll(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchStates = async (countryId) => {
    if (!countryId) {
      setDropdownData((prev) => ({ ...prev, states: [] }));
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:7000/api/location/states",
        { country_id: countryId }
      );
      setDropdownData((prev) => ({ ...prev, states: response.data }));
    } catch {
      setDropdownData((prev) => ({ ...prev, states: [] }));
    }
  };

  const handleAddressInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
    if (name === "countries_id") fetchStates(value);
  };

  const handleExperienceInputChange = (index, e) => {
    const { name, value, list } = e.target;
    const updatedExperiences = [...formData.experiences];
    const exp = { ...updatedExperiences[index] };
    exp[name] = value;

    if (list) {
      const option = Array.from(list.options).find(
        (opt) => opt.value === value
      );
      const idFieldName =
        name === "designation_name" ? "designation_id" : "company_id";
      if (option) exp[idFieldName] = option.dataset.id;
      else delete exp[idFieldName];
    }
    updatedExperiences[index] = exp;
    setFormData((prev) => ({ ...prev, experiences: updatedExperiences }));
  };

  const handleEducationInputChange = (index, e) => {
    const { name, value } = e.target;
    const list = e.target.list;
    const updatedEducations = [...formData.educations];
    const edu = { ...updatedEducations[index], [name]: value };

    if (list) {
      const option = Array.from(list.options).find(
        (opt) => opt.value === value
      );
      const idFieldName = name === "name" ? "degree_id" : "institute_id";
      if (option) edu[idFieldName] = option.dataset.id;
      else delete edu[idFieldName];
    }
    updatedEducations[index] = edu;
    setFormData((prev) => ({ ...prev, educations: updatedEducations }));
  };

  const handleSave = async () => {
    if (editingCard === "experience") {
      await handleExperienceSave();
      return;
    }
    if (editingCard === "education") {
      await handleEducationSave();
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:7000/api/profile/update",
        {
          ...formData,
          token,
          addresses: formData.addresses.map((addr) => ({
            address_id: addr.address_id,
            label: addr.label,
            door_no: addr.door_no,
            street: addr.street,
            area: addr.area,
            city: addr.city,
            pincode: addr.pincode,
            countries_id: addr.countries_id,
            state_id: addr.state_id,
          })),
        }
      );

      const profileRes = await axios.post(
        "http://localhost:7000/api/profile/show",
        { token }
      );
      setProfileData(profileRes.data);
      toast.success(response.data.message || "Profile updated successfully!");
      setEditingCard(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update profile.";
      toast.error(errorMessage);
    }
  };

  const handleExperienceSave = async () => {
    const token = localStorage.getItem("token");
    try {
      for (const exp of formData.experiences) {
        const url = exp.id
          ? "http://localhost:7000/api/profile/updateexperience"
          : "http://localhost:7000/api/profile/newexperience";
        const method = exp.id ? axios.put : axios.post;
        await method(url, { ...exp, token });
      }
      const experienceRes = await axios.post(
        "http://localhost:7000/api/profile/experience",
        { token }
      );
      setExperienceData(experienceRes.data);
      toast.success("Work experience updated successfully!");
      setEditingCard(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update experience.";
      toast.error(errorMessage);
    }
  };

  const handleEducationSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const updatedEducations = await Promise.all(
        formData.educations.map(async (edu) => {
          let degreeId = edu.degree_id;
          let instituteId = edu.institute_id;

          if (!degreeId && edu.name) {
            const response = await axios.post(
              "http://localhost:7000/api/location/newdegrees",
              { name: edu.name }
            );
            degreeId = response.data.degreeId;
          }
          if (!instituteId && edu.institute_name) {
            const response = await axios.post(
              "http://localhost:7000/api/location/newinstitutes",
              { name: edu.institute_name }
            );
            instituteId = response.data.instituteId;
          }
          return { ...edu, degree_id: degreeId, institute_id: instituteId };
        })
      );

      for (const edu of updatedEducations) {
        const { institute_location, ...restOfEdu } = edu;
        if (edu.id) {
          await axios.put("http://localhost:7000/api/profile/updateeducation", {
            ...restOfEdu,
            location: institute_location,
            token,
          });
        } else {
          await axios.post("http://localhost:7000/api/profile/neweducation", {
            ...edu,
            token,
            institute_id: edu.institute_id,
          });
        }
      }
      const educationRes = await axios.post(
        "http://localhost:7000/api/profile/geteducation",
        { token }
      );
      setEducationData(educationRes.data);
      toast.success("Education details updated successfully!");
      setEditingCard(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update education.";
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="loading-error-message">Loading...</div>;
  if (error) return <div className="loading-error-message error">{error}</div>;
  if (!profileData)
    return <div className="loading-error-message">No profile data found.</div>;

  return (
    <div
      className={`profile-page-wrapper ${editingCard ? "editing-active" : ""}`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="profile-grid-container">
        <div className="left-column">
          <ProfilePicCard
            profilePic={profilePic}
            setProfilePic={setProfilePic}
            defaultImage={profileImage}
          />
          <ContactCard
            isEditing={editingCard === "contact"}
            profileData={profileData}
            formData={formData}
            handleInputChange={handleInputChange}
            onEdit={() => handleEditClick("contact")}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          <EducationCard
            isEditing={editingCard === "education"}
            educationData={educationData}
            formData={formData}
            dropdownData={dropdownData}
            handleEducationInputChange={handleEducationInputChange}
            onEdit={() => handleEditClick("education")}
            onSave={handleSave}
            onCancel={handleCancel}
            onAddEducation={handleAddEducation}
            containerRef={educationsContainerRef}
          />
        </div>
        <div className="right-column">
          <HeaderCard
            isEditing={editingCard === "header"}
            profileData={profileData}
            formData={formData}
            dropdownData={dropdownData}
            handleInputChange={handleInputChange}
            onEdit={() => handleEditClick("header")}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          <PersonalInfoCard
            isEditing={editingCard === "personalInfo"}
            profileData={profileData}
            formData={formData}
            dropdownData={dropdownData}
            handleInputChange={handleInputChange}
            handleAddressInputChange={handleAddressInputChange}
            onEdit={() => handleEditClick("personalInfo")}
            onSave={handleSave}
            onCancel={handleCancel}
            onAddAddress={handleAddAddress}
            formatDate={formatDate}
            containerRef={addressesContainerRef}
          />
          <ExperienceCard
            isEditing={editingCard === "experience"}
            experienceData={experienceData}
            formData={formData}
            dropdownData={dropdownData}
            handleExperienceInputChange={handleExperienceInputChange}
            onEdit={() => handleEditClick("experience")}
            onSave={handleSave}
            onCancel={handleCancel}
            onAddExperience={handleAddExperience}
            formatDate={formatDate}
            containerRef={experiencesContainerRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
