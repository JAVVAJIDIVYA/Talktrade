import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiUsers, FiTrash2 } from "react-icons/fi";
import Loading from "../components/Loading";
import { adminAPI, userAPI } from "../utils/api";
import { formatINR } from "../utils/currency";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await adminAPI.getUsers(true);
      return res.data;
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => userAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
    },
  });

  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Management</h1>
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
                        className="p-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 disabled:opacity-50"
                      >
                        <FiTrash2 className="w-4 h-4" />
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
  );
};

export default AdminDashboard;
