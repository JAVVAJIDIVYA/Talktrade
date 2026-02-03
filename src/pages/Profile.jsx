import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiMapPin,
  FiCalendar,
  FiMail,
  FiPhone,
  FiStar,
  FiMessageSquare,
  FiBriefcase,
  FiAward,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiTrendingUp,
  FiGlobe,
} from "react-icons/fi";
import Loading from "../components/Loading";
import GigCard from "../components/GigCard";
import { useAuth } from "../context/AuthContext";
import { userAPI, gigAPI, conversationAPI, reviewAPI } from "../utils/api";
import { formatINR, formatIndianNumber } from "../utils/currency";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showSellerForm, setShowSellerForm] = useState(false);
  const [sellerExperience, setSellerExperience] = useState("");
  const [sellerActivities, setSellerActivities] = useState("");

  // Fetch user with stats
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await userAPI.getUser(id);
      return res.data;
    },
  });

  // Fetch user's gigs if seller
  const { data: gigs, isLoading: gigsLoading } = useQuery({
    queryKey: ["userGigs", id],
    queryFn: async () => {
      const res = await gigAPI.getGigs({ userId: id });
      return res.data;
    },
    enabled: !!user?.isSeller,
  });

  const requestSellerMutation = useMutation({
    mutationFn: (payload) => userAPI.requestSeller(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", id]);
      setShowSellerForm(false);
    },
  });

  const handleSubmitSellerApplication = (e) => {
    e.preventDefault();
    if (!sellerExperience.trim() || !sellerActivities.trim()) {
      return;
    }
    requestSellerMutation.mutate({
      experience: sellerExperience.trim(),
      activities: sellerActivities.trim(),
    });
  };

  const handleContact = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await conversationAPI.createConversation({ to: id });
      navigate("/messages");
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (userLoading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User not found
          </h2>
          <Link to="/" className="text-primary hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const stats = user.stats || {};
  const detailedRatings = stats.detailedRatings || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            {/* Main Profile Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              {/* Cover */}
              <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-400"></div>

              {/* Profile Info */}
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <img
                    src={
                      user.img ||
                      `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff&size=120`
                    }
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {user.isSeller && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2">
                      <FiCheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.username}
                </h1>

                {user.isSeller && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      Professional Seller
                    </span>
                    {stats.avgRating >= 4.5 && (
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                        Top Rated
                      </span>
                    )}
                  </div>
                )}

                {user.desc && (
                  <p className="text-gray-600 mb-6">{user.desc}</p>
                )}

                {/* Quick Stats */}
                {user.isSeller && stats.avgRating && (
                  <div className="flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                        <FiStar className="w-5 h-5 fill-yellow-500" />
                        <span className="text-xl font-bold">{stats.avgRating}</span>
                      </div>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                    <div className="h-10 w-px bg-gray-300"></div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {stats.completedOrders || 0}
                      </div>
                      <p className="text-xs text-gray-500">Orders</p>
                    </div>
                    <div className="h-10 w-px bg-gray-300"></div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {stats.totalGigs || 0}
                      </div>
                      <p className="text-xs text-gray-500">Services</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                    {user.country}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                    Member since {formatDate(user.createdAt)}
                  </div>
                  {user.responseTime && (
                    <div className="flex items-center text-gray-600">
                      <FiClock className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                      {user.responseTime}
                    </div>
                  )}
                  {user.availability && user.isSeller && (
                    <div className="flex items-center text-gray-600">
                      <FiBriefcase className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                      {user.availability}
                    </div>
                  )}
                  {user.email && currentUser?._id === id && (
                    <div className="flex items-center text-gray-600">
                      <FiMail className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                      {user.email}
                    </div>
                  )}
                  {user.phone && currentUser?._id === id && (
                    <div className="flex items-center text-gray-600">
                      <FiPhone className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                      {user.phone}
                    </div>
                  )}
                </div>

                {/* Become a seller (own profile only) */}
                {currentUser?._id === id && !user.isSeller && (
                  <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    {(!user.sellerRequestStatus || user.sellerRequestStatus === "none") && (
                      <>
                        {!showSellerForm ? (
                          <>
                            <p className="text-sm text-gray-600 mb-3">
                              Offer your services on the platform. Tell us about your experience and activities so admin can review your application.
                            </p>
                            <button
                              onClick={() => setShowSellerForm(true)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
                            >
                              <FiBriefcase className="w-5 h-5" />
                              Become a seller
                            </button>
                          </>
                        ) : (
                          <form onSubmit={handleSubmitSellerApplication} className="space-y-3">
                            <p className="text-sm text-gray-700">
                              Please share your relevant experience and what kind of services/activities you plan to offer.
                            </p>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Experience details
                              </label>
                              <textarea
                                value={sellerExperience}
                                onChange={(e) => setSellerExperience(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Describe your professional background and experience relevant to selling on this platform."
                                disabled={requestSellerMutation.isPending}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Activities / services you will provide
                              </label>
                              <textarea
                                value={sellerActivities}
                                onChange={(e) => setSellerActivities(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="List the activities or services you plan to offer (e.g. trading tips, portfolio reviews, mentorship, etc.)."
                                disabled={requestSellerMutation.isPending}
                              />
                            </div>
                            {requestSellerMutation.isError && (
                              <p className="text-sm text-red-600">
                                {requestSellerMutation.error?.response?.data?.message ||
                                  "Failed to submit seller request. Please try again."}
                              </p>
                            )}
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowSellerForm(false);
                                  setSellerExperience("");
                                  setSellerActivities("");
                                }}
                                disabled={requestSellerMutation.isPending}
                                className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={
                                  requestSellerMutation.isPending ||
                                  !sellerExperience.trim() ||
                                  !sellerActivities.trim()
                                }
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50"
                              >
                                {requestSellerMutation.isPending ? "Submitting…" : "Submit for approval"}
                              </button>
                            </div>
                          </form>
                        )}
                      </>
                    )}
                    {user.sellerRequestStatus === "pending" && (
                      <p className="text-sm text-amber-700 font-medium">
                        Seller request pending. Awaiting admin approval.
                      </p>
                    )}
                    {user.sellerRequestStatus === "rejected" && (
                      <p className="text-sm text-red-600">
                        Your seller request was rejected. Contact admin for details.
                      </p>
                    )}
                  </div>
                )}

                {/* Contact Button */}
                {currentUser && currentUser._id !== id && (
                  <button
                    onClick={handleContact}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
                  >
                    <FiMessageSquare className="w-5 h-5" />
                    Contact Me
                  </button>
                )}
              </div>
            </div>

            {/* Skills & Expertise */}
            {user.isSeller && user.skills && user.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAward className="w-5 h-5 text-primary" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {user.isSeller && user.languages && user.languages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiGlobe className="w-5 h-5 text-primary" />
                  Languages
                </h3>
                <div className="space-y-2">
                  {user.languages.map((lang, index) => (
                    <div key={index} className="text-gray-700">
                      • {lang}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings & Performance */}
            {user.isSeller && stats.totalEarnings > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTrendingUp className="w-5 h-5 text-primary" />
                  Performance Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Earnings</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatIndianNumber(stats.totalEarnings)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completed Orders</span>
                    <span className="font-semibold text-gray-900">
                      {stats.completedOrders}
                    </span>
                  </div>
                  {stats.recommendationRate > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Recommendation Rate</span>
                      <span className="font-semibold text-gray-900">
                        {stats.recommendationRate}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education & Experience */}
            {user.isSeller && (user.education || user.experience) && (
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Background
                </h3>
                {user.education && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Education
                    </h4>
                    <p className="text-gray-700">{user.education}</p>
                  </div>
                )}
                {user.experience && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Experience
                    </h4>
                    <p className="text-gray-700">{user.experience}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content - Detailed Ratings & Gigs */}
          <div className="lg:col-span-2">
            {/* Detailed Ratings */}
            {user.isSeller && detailedRatings && stats.totalReviews > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Detailed Ratings & Reviews
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Communication */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Communication</span>
                      <span className="font-bold text-gray-900">
                        {detailedRatings.communication}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(detailedRatings.communication / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Service Quality */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Service Quality</span>
                      <span className="font-bold text-gray-900">
                        {detailedRatings.serviceQuality}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(detailedRatings.serviceQuality / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Delivery Time</span>
                      <span className="font-bold text-gray-900">
                        {detailedRatings.deliveryTime}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(detailedRatings.deliveryTime / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Value for Money */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Value for Money</span>
                      <span className="font-bold text-gray-900">
                        {detailedRatings.valueForMoney}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(detailedRatings.valueForMoney / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">
                      {detailedRatings.totalRecommendations} clients would recommend
                    </span>
                    <span className="text-blue-600 font-bold">
                      {stats.recommendationRate}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Services/Gigs Section */}
            {user.isSeller ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentUser?._id === id ? "My Services" : `${user.username}'s Services`}
                  </h2>
                  {currentUser?._id === id && (
                    <Link
                      to="/add"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                    >
                      Create New Service
                    </Link>
                  )}
                </div>

                {gigsLoading ? (
                  <Loading />
                ) : gigs && gigs.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {gigs.map((gig) => (
                      <GigCard key={gig._id} gig={gig} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No services yet
                    </h3>
                    {currentUser?._id === id ? (
                      <>
                        <p className="text-gray-500 mb-6">
                          Create your first service and start earning!
                        </p>
                        <Link
                          to="/add"
                          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                        >
                          Create Your First Service
                        </Link>
                      </>
                    ) : (
                      <p className="text-gray-500">
                        This seller hasn't created any services yet.
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Buyer Account
                </h3>
                <p className="text-gray-500">
                  {currentUser?._id === id
                    ? "Upgrade to a seller account to start offering services."
                    : "This user is a buyer and doesn't have any services."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;