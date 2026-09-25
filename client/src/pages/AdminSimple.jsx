import { useState } from "react";
import { FiUsers, FiShield } from "react-icons/fi";

const Admin = () => {
  const [message, setMessage] = useState("Admin Dashboard Loading...");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiShield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage platform and employees</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-4">Welcome Admin!</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <FiUsers className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-900">Employee Management</h3>
              <p className="text-blue-700 text-sm">View, add, edit, and delete employees</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <FiShield className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-900">Platform Stats</h3>
              <p className="text-green-700 text-sm">View platform statistics</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <FiUsers className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-900">User Management</h3>
              <p className="text-purple-700 text-sm">Manage all users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
