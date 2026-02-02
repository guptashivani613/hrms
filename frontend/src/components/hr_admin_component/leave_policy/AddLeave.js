import React, { useState, useEffect } from 'react'
import apiUrls from '../../../libs/apiUrls';
import axios_instance from '../../../libs/interseptor';
import TabSwitch from '../../TabSwitch/TabSwitch';

const AddLeave = () => {
  return (
    <div>
      <TabSwitch
        tabs={["All Emp Leave", "Leave Status", "New Leave"]}
        components={[<LeaveBalance/>, <LeaveList/>, <AddLeaveBalance />]}
      />
    </div>
  )
}

export default AddLeave

const LeaveBalance = ()=>{
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      try {
        const response = await axios_instance.get(apiUrls.HR_REGISTER_EMP_LEAVE);
        setLeaveBalances(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leave balances.");
        setLoading(false);
      }
    };

    fetchLeaveBalances();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="">
  <table className="w-full mt-6 text-sm text-gray-500 border border-gray-200 shadow-md rounded-lg">
  <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
    <tr>
      <th className="py-4 px-4">User</th>
      <th className="py-4 px-4">Leave Type</th>
      <th className="py-4 px-4">Total Leaves</th>
      <th className="py-4 px-4">Used Leaves</th>
      <th className="py-4 px-4">Remaining Leaves</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {leaveBalances.length > 0 ? (
      leaveBalances.map((leave) => (
        <tr
          key={leave.id}
          className="hover:bg-blue-50 transition-colors duration-200"
        >
          <td className="py-4 px-4">{leave.user}</td>
          <td className="py-4 px-4">{leave.leave_type}</td>
          <td className="py-4 px-4">{leave.total_leaves}</td>
          <td className="py-4 px-4">{leave.used_leaves}</td>
          <td
            className={`py-4 px-4 ${
              leave.remaining_leaves < 2
                ? "text-red-500 font-semibold"
                : "text-green-500 font-semibold"
            }`}
          >
            {leave.remaining_leaves}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="text-center py-4 text-gray-500">
          No Records Found
        </td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
}

const AddLeaveBalance = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [leaveData, setLeaveData] = useState({
    user: "",
    leave_type: "",
    total_leaves: "0",
    used_leaves: "0",
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log(leaveData, "leaveData")
    setLoading(true);
    setResponseMessage(null);
    setError(null);
    try {
      const response = await axios_instance.post(
        apiUrls.HR_REGISTER_EMP_LEAVE,
        leaveData
      );
      setResponseMessage("Leave balance submitted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit leave balance."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios_instance.get(apiUrls.USER_FIND, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          const verifiedUsers = response.data.filter((user) => user.otp_verified === true);
          setUserDetails(verifiedUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="">
      <div className="space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="user"
            className="text-gray-600 font-medium mb-1"
          >
            User ID:
          </label>
          <select
            value={leaveData.user || ""}
            onChange={handleChange}
            className="selectInput"
            name='user'
          >
            <option value="" disabled>
              Select User
            </option>
            {userDetails.map((user) => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </select>

        </div>
        <div className="flex flex-col">
          <label
            htmlFor="leave_type"
            className="text-gray-600 font-medium mb-1"
          >
            Leave Type:
          </label>
          <select
            id="leave_type"
            name="leave_type"
            value={leaveData.leave_type}
            onChange={handleChange}
            className="selectInput"
          >
            <option value="" disabled>
              Select Leave Type
            </option>
            <option value="Sick">Sick</option>
            <option value="Monthly">Monthly</option>
            <option value="Annual">Annual</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="total_leaves"
            className="text-gray-600 font-medium mb-1"
          >
            Total Leaves:
          </label>
          <input
            type="number"
            id="total_leaves"
            name="total_leaves"
            value={leaveData.total_leaves}
            onChange={handleChange}
            className="customTextInput"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="used_leaves"
            className="text-gray-600 font-medium mb-1"
          >
            Used Leaves:
          </label>
          <input
            type="number"
            id="used_leaves"
            name="used_leaves"
            value={leaveData.used_leaves}
            onChange={handleChange}
            className="customTextInput"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`formSubmitBtn`}
        >
          {loading ? "Submitting..." : "Submit Leave Balance"}
        </button>
        {responseMessage && (
          <div className="text-green-500 text-center mt-4">
            {responseMessage}
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}
      </div>
    </div>
  );
};

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios_instance.get(apiUrls.LOGIN_EMPLOYEE_LEAVE_APPLY);
        setLeaves(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leave data.");
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (leave) => {
    setEditingId(leave.id);
    setFormData({ ...leave });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async (id) => {
    try {
      await axios_instance.put(`${apiUrls.LOGIN_EMPLOYEE_LEAVE_APPLY}${id}/`,formData);
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) => (leave.id === id ? { ...formData } : leave))
      );
      setEditingId(null);
      setFormData({});
    } catch (err) {
      alert("Failed to update leave. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="">
<table className="w-full mt-6 text-sm text-gray-500 border border-gray-200 shadow-md rounded-lg">
  <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
    <tr>
      <th className="py-4 px-4">ID</th>
      <th className="py-4 px-4">User Email</th>
      <th className="py-4 px-4">Leave Type</th>
      <th className="py-4 px-4">Start Date</th>
      <th className="py-4 px-4">End Date</th>
      <th className="py-4 px-4">Reason</th>
      <th className="py-4 px-4">Status</th>
      <th className="py-4 px-4 text-center">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {leaves.length > 0 ? (
      leaves.map((leave) => (
        <tr
          key={leave.id}
          className="hover:bg-blue-50 transition-colors duration-200"
        >
          <td className="py-4 px-4">{leave.id}</td>
          <td className="px-4 py-4">{leave.user_email}</td>
          <td className="px-4 py-4">
            {editingId === leave.id ? (
              <input
                type="text"
                name="leave_type"
                value={formData.leave_type || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            ) : (
              leave.leave_type
            )}
          </td>
          <td className="px-4 py-4">
            {editingId === leave.id ? (
              <input
                type="date"
                name="start_date"
                value={formData.start_date || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            ) : (
              leave.start_date
            )}
          </td>
          <td className="px-4 py-4">
            {editingId === leave.id ? (
              <input
                type="date"
                name="end_date"
                value={formData.end_date || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            ) : (
              leave.end_date
            )}
          </td>
          <td className="px-4 py-4">
            {editingId === leave.id ? (
              <input
                type="text"
                name="reason"
                value={formData.reason || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            ) : (
              leave.reason
            )}
          </td>
          <td className="px-4 py-4">
            {editingId === leave.id ? (
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            ) : (
              <span
                className={`font-semibold ${
                  leave.status === "Approved"
                    ? "text-green-500"
                    : leave.status === "Rejected"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {leave.status}
              </span>
            )}
          </td>
          <td className="px-4 py-4 text-center">
            {editingId === leave.id ? (
              <>
                <button
                  onClick={() => handleSave(leave.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEditClick(leave)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" className="text-center py-6 text-gray-500">
          No Records Found
        </td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
};


