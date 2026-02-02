import React, { useState,useEffect } from "react";
import apiUrls from "../../libs/apiUrls";
import axios_instance from "../../libs/interseptor";

const LeaveSubmission = () => {
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setDuration("");
    setReason("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: leaveBalances[0]?.user, 
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason: reason,
    };

    try {
      
      const response = await axios_instance.post(apiUrls.LOGIN_EMPLOYEE_LEAVE_APPLY, payload);
      
      if (!response?.status == 201) {
        throw new Error("Failed to apply leave");
      }
      alert("Leave applied successfully!");
      handleCancel()
    } catch (error) {
      alert("Error: " + error.message);
    }
  };


  useEffect(() => {
    const fetchLeaveBalances = async () => {
      try {
        const response = await axios_instance.get(apiUrls.HR_REGISTER_EMP_LEAVE);

        if (!response?.status == 200) {
          throw new Error('Failed to fetch leave balances');
        }
        setLeaveBalances(response.data);
      } catch (err) {
        console.log(err.message);
      } 
    };

    fetchLeaveBalances();
  }, []);

  return (
    <div >
      <div className="">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 pb-1 pl-2">Apply Leave</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-5 gap-2 items-center">
              <label className="text-gray-800 col-span-1 text-sm mb-2">Leave Type:</label>
              <div className="relative col-span-4 flex items-center w-full">
                <select
                  id="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="selectInput"
                  required
                >
                  <option value="" disabled>Choose a leave type</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Sick">Sick</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 items-center">
              <label className="text-gray-800 col-span-1 text-sm mb-2">Duration:</label>
              <div className="relative col-span-4 flex items-center w-full">
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="selectInput"
                  required
                >
                  <option value="" disabled>Choose a duration</option>
                  {/* <option value="Half Day">Half Day</option> */}
                  <option value="Full Day">Full Day</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 items-center">
              <label className="text-gray-800 col-span-1 text-sm mb-2">Start Date:</label>
              <div className="relative col-span-4 flex items-center w-full">
                <input
                  name="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="customTextInput"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 items-center">
              <label className="text-gray-800 col-span-1 text-sm mb-2">End Date:</label>
              <div className="relative col-span-4 flex items-center w-full">
                <input
                  name="end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="customTextInput"
                />
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2 items-start col-span-2">
              <label className="text-gray-800 col-span-1 text-sm mb-2">Reason:</label>
              <div className="relative col-span-9 flex items-center w-full">
                <textarea
                  type="text"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason"
                  className="customTextAreaInput"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="formCancelBtn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="formSubmitBtn"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveSubmission;
