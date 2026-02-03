import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiX } from "react-icons/fi";
import Loading from "../components/Loading";
import { adminAPI } from "../utils/api";

const AdminSellerRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["sellerRequests"],
    queryFn: async () => {
      const res = await adminAPI.getSellerRequests();
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (userId) => adminAPI.approveSeller(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["sellerRequests"]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (userId) => adminAPI.rejectSeller(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["sellerRequests"]);
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Seller Requests</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {requests && requests.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activities</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((user) => (
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
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {user.experience ? (
                      <span title={user.experience}>
                        {user.experience.length > 80
                          ? `${user.experience.slice(0, 80)}…`
                          : user.experience}
                      </span>
                    ) : (
                      <span className="text-gray-400">No details</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {user.sellerActivities ? (
                      <span title={user.sellerActivities}>
                        {user.sellerActivities.length > 80
                          ? `${user.sellerActivities.slice(0, 80)}…`
                          : user.sellerActivities}
                      </span>
                    ) : (
                      <span className="text-gray-400">No details</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => approveMutation.mutate(user._id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 disabled:opacity-50"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(user._id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-8">No pending seller requests.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSellerRequests;
