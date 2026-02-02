import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { FaEdit } from "react-icons/fa";
import { MdPerson, MdGroup, MdPhone, MdEmail, MdLocationOn } from "react-icons/md";
import axios_instance from "../../libs/interseptor";
import apiUrls from "../../libs/apiUrls";

const EmergencyContact = () => {
  const storedUserData = JSON.parse(Cookies.get("userData"));

  const [isEditing, setIsEditing] = useState(false);
  const [hasEmergencyContactData, setHasEmergencyContactData] = useState(false);
  const [emergencyId, setEmergencyId] = useState(null)
  const [primaryContact, setPrimaryContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
  });

  const [secondaryContact, setSecondaryContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
  });

  // Fetch emergency contact data when the component mounts
  const fetchEmergencyContacts = async () => {
    try {
      const response = await axios_instance.get(`${apiUrls.EMERGENCY_CONTACT}`);
      if (response.data && response.data.length > 0) {
        setHasEmergencyContactData(true);
        setEmergencyId(response.data[0].id)
        const contactData = response.data[0];
        setPrimaryContact({
          name: contactData.name,
          relationship: contactData.relationship,
          phone: contactData.phone,
          email: contactData.email,
          address: contactData.address,
        });
        setSecondaryContact({
          name: contactData.secondary_name,
          relationship: contactData.secondary_relationship,
          phone: contactData.secondary_phone,
          email: contactData.secondary_email,
          address: contactData.secondary_address,
        });
      } else {
        setHasEmergencyContactData(false);
      }
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
    }
  };
  useEffect(() => {
    fetchEmergencyContacts();
  }, []);

  const handleInputChange = (e, contactType, field) => {
    const value = e.target.value;
    if (contactType === "primary") {
      setPrimaryContact({ ...primaryContact, [field]: value });
    } else {
      setSecondaryContact({ ...secondaryContact, [field]: value });
    }
  };

  const saveChanges = async () => {
  const requiredFields = [
    "name",
    "phone",
    "email",
    "address",
    "relationship",
  ];

  const isPrimaryContactValid = requiredFields.every(
    (field) => primaryContact[field] !== ""
  );

  const isSecondaryContactValid = requiredFields.every(
    (field) => secondaryContact[field] !== ""
  );

  if (!isPrimaryContactValid || !isSecondaryContactValid) {
    alert("Please fill in all fields for both primary and secondary contacts.");
    return; 
  }

    try {
      const payload = {
        user: storedUserData.user_id,
        name: primaryContact.name,
        phone: primaryContact.phone,
        email: primaryContact.email,
        address: primaryContact.address,
        relationship: primaryContact.relationship,
        secondary_name: secondaryContact.name,
        secondary_phone: secondaryContact.phone,
        secondary_email: secondaryContact.email,
        secondary_address: secondaryContact.address,
        secondary_relationship: secondaryContact.relationship,
      };

      let response;

      if (hasEmergencyContactData) {
        response = await axios_instance.put(
          `${apiUrls.EMERGENCY_CONTACT}${emergencyId}/`,
          payload
        );
      } else {
        response = await axios_instance.post(`${apiUrls.EMERGENCY_CONTACT}`, payload);
        setHasEmergencyContactData(true); 
      }

      if (response.status === 200 && hasEmergencyContactData) {
        alert("Emergency contacts updated successfully!");
      } else if (response.status === 201 && !hasEmergencyContactData) {
        alert("Emergency contacts saved successfully!");
      }
      
      fetchEmergencyContacts()
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving emergency contacts:", error);
      // alert("An error occurred while saving the emergency contacts. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Styles
  const sectionTitle = "text-xl font-semibold text-gray-800 flex items-center";
  const contactItem = "flex items-start";
  const iconStyle = "text-gray-500 text-lg mr-2 text-blue-400";
  const labelStyle = "text-sm font-medium text-gray-600";
  const valueStyle = "text-gray-600 font-[600]";

  return (
    <div className="rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4 p-6 border-b bg-blue-400">
        <h3 className="text-xl text-white font-bold">Emergency Contact</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex gap-2 rounded-3xl bg-white py-2 px-4 border border-transparent text-center text-sm text-blue-600 transition-all shadow-sm hover:shadow-lg focus:bg-blue-400 focus:shadow-none active:bg-blue-400 hover:bg-blue-500 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button"
          >
            <FaEdit />
            <span>Edit Emergency Contact</span>
          </button>
        )}
      </div>

      <div>
        {/* Primary Contact */}
        <div className="p-6">
          <h3 className={sectionTitle}>Primary Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            {Object.entries(primaryContact).map(([key, value]) => (
              <div key={key} className={contactItem}>
                {key === "name" && <MdPerson className={iconStyle} />}
                {key === "relationship" && <MdGroup className={iconStyle} />}
                {key === "phone" && <MdPhone className={iconStyle} />}
                {key === "email" && <MdEmail className={iconStyle} />}
                {key === "address" && <MdLocationOn className={iconStyle} />}
                <div className="w-full">
                  <p className={labelStyle}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </p>
                  {isEditing ? (
                    key === "address" ? (
                      <textarea
                        value={value}
                        onChange={(e) => handleInputChange(e, "primary", key)}
                        className="customTextInput h-20 resize-none"
                      />
                    ) : key === "phone" ? (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleInputChange(e, "primary", key)}
                        className="customTextInput"
                        inputMode="numeric"
                        pattern="\d*"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(e, "primary", key)}
                        className="customTextInput"
                      />
                    )
                  ) : (
                    <p className={valueStyle}>{value}</p>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Secondary Contact */}
        <div className="p-6">
          <h3 className={sectionTitle}>Secondary Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            {Object.entries(secondaryContact).map(([key, value]) => (
              <div key={key} className={contactItem}>
                {key === "name" && <MdPerson className={iconStyle} />}
                {key === "relationship" && <MdGroup className={iconStyle} />}
                {key === "phone" && <MdPhone className={iconStyle} />}
                {key === "email" && <MdEmail className={iconStyle} />}
                {key === "address" && <MdLocationOn className={iconStyle} />}
                <div className="w-full">
                  <p className={labelStyle}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </p>
                  {isEditing ? (
                    key === "address" ? (
                      <textarea
                        value={value}
                        onChange={(e) => handleInputChange(e, "secondary", key)}
                        className="customTextInput h-20 resize-none"
                      />
                    ) : key === "phone" ? (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleInputChange(e, "secondary", key)}
                        className="customTextInput"
                        inputMode="numeric"
                        pattern="\d*"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(e, "secondary", key)}
                        className="customTextInput"
                      />
                    )
                  ) : (
                    <p className={valueStyle}>{value}</p>
                  )}
                </div>
              </div>
            ))}

          </div>
          {isEditing && (
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                type="button"
                className="formCancelBtn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="formSubmitBtn"
                onClick={saveChanges}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
