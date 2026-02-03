import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiEye } from "react-icons/fi";
import Loading from "../components/Loading";
import { gigAPI } from "../utils/api";
import { formatINR } from "../utils/currency";

const MyGigs = () => {
  const queryClient = useQueryClient();

  const { data: gigs, isLoading } = useQuery({
    queryKey: ["myGigs"],
    queryFn: async () => {
      const res = await gigAPI.getMyGigs();
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => gigAPI.deleteGig(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Gigs</h1>
            <p className="text-gray-500 mt-1">
              Manage your service listings
            </p>
          </div>
          <Link
            to="/add"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            <FiPlus className="w-5 h-5" />
            Create New Gig
          </Link>
        </div>

        {/* Gigs Table */}
        {gigs && gigs.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Sales
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gigs.map((gig) => {
                    const rating =
                      gig.starNumber > 0
                        ? (gig.totalStars / gig.starNumber).toFixed(1)
                        : "N/A";
                    return (
                      <tr key={gig._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img
                            src={gig.cover || "https://placehold.co/80x60?text=Gig"}
                            alt={gig.title}
                            className="w-20 h-14 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/80x60?text=Gig";
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/gig/${gig._id}`}
                            className="font-medium text-gray-900 hover:text-primary line-clamp-2"
                          >
                            {gig.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {gig.category}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {formatINR(gig.priceInr || gig.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">{gig.sales || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-gray-600">{rating}</span>
                            <span className="text-gray-400 text-sm ml-1">
                              ({gig.starNumber || 0})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/gig/${gig._id}`}
                              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                              title="View"
                            >
                              <FiEye className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(gig._id)}
                              disabled={deleteMutation.isPending}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No gigs yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first gig and start earning!
            </p>
            <Link
              to="/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              <FiPlus className="w-5 h-5" />
              Create Your First Gig
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;
