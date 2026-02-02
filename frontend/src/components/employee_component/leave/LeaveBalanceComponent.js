import React, { useEffect, useState } from 'react';
import apiUrls from '../../../libs/apiUrls';
import axios_instance from '../../../libs/interseptor';

const LeaveBalanceComponent = () => {
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      try {
        const response = await axios_instance.get(apiUrls.HR_REGISTER_EMP_LEAVE);

        if (!response?.status == 200) {
          throw new Error('Failed to fetch leave balances');
        }
        setLeaveBalances(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveBalances();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {leaveBalances.length>0 ? leaveBalances.map((leave) => (
          <div
            key={leave.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">{leave.leave_type} Leave</h3>
              <p className="text-gray-600 mt-2">Total Leaves: {leave.total_leaves}</p>
              <p className="text-gray-600 mt-2">Used Leaves: {leave.used_leaves}</p>
              <p className="text-gray-600 mt-2">Remaining Leaves: {leave.remaining_leaves}</p>

              <div
                className={`mt-4 p-2 rounded-lg text-white ${
                  leave.remaining_leaves === 0 ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                {leave.remaining_leaves === 0 ? 'No Remaining Leaves' : 'Sufficient Leaves'}
              </div>
            </div>
          </div>
        ))
        :
        <p className='text-red-500'>You have no leave balance.</p>
        }
      </div>
    </div>
  );
};

export default LeaveBalanceComponent;
