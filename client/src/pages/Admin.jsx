import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiUsers, FiShield, FiTrash2, FiEdit2 } from "react-icons/fi";
import Loading from "../components/Loading";
import { adminAPI, userAPI } from "../utils/api";
import { formatINR } from "../utils/currency";

const Admin = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await adminAPI.getStats();
      return res.data;
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await adminAPI.getUsers(true); // Get sellers only (employees)
      return res.data;
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => userAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      queryClient.invalidateQueries(["adminStats"]);
    },
  });

  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (statsLoading && !stats) return <Loading />;

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

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiUsers className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Employees</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalSellers}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Gigs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalGigs}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <FiUsers className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <FiUsers className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employee Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Employees ({filteredUsers.length} of {users?.length ?? 0})
              </p>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          {usersLoading ? (
            <Loading />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hourly (₹)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.img || `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff`}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="ml-3 font-medium text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.country}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.hourlyRate ? formatINR(user.hourlyRate) : "Not set"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${user.username}? This action cannot be undone.`)) {
                              deleteUserMutation.mutate(user._id);
                            }
                          }}
                          disabled={deleteUserMutation.isPending}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  {searchTerm ? `No employees found matching "${searchTerm}"` : "No employees found"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
