import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Slider from "react-slick";
import {
  FiClock,
  FiRefreshCw,
  FiCheck,
  FiMessageSquare,
  FiStar,
  FiHeart,
} from "react-icons/fi";
import Loading from "../components/Loading";
import Stars from "../components/Stars";
import Review from "../components/Review";
import { useAuth } from "../context/AuthContext";
import { gigAPI, reviewAPI, orderAPI, conversationAPI, userAPI } from "../utils/api";
import { formatINR } from "../utils/currency";

const Gig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [reviewForm, setReviewForm] = useState({
    star: 5,
    desc: "",
  });
  const [orderLoading, setOrderLoading] = useState(false);

  const { data: favouriteGigsData } = useQuery({
    queryKey: ["favouriteGigs"],
    queryFn: async () => {
      const res = await userAPI.getFavouriteGigs();
      return res.data;
    },
    enabled: !!currentUser,
  });

  const favouriteMutation = useMutation({
    mutationFn: () => userAPI.toggleFavouriteGig(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["gig", id]);
      queryClient.invalidateQueries(["favouriteGigs"]);
    },
  });

  // Fetch gig
  const { data: gig, isLoading: gigLoading } = useQuery({
    queryKey: ["gig", id],
    queryFn: async () => {
      const res = await gigAPI.getGig(id);
      return res.data;
    },
  });

  // Fetch reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await reviewAPI.getReviews(id);
      return res.data;
    },
  });

  // Create review mutation
  const reviewMutation = useMutation({
    mutationFn: (data) => reviewAPI.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", id]);
      queryClient.invalidateQueries(["gig", id]);
      setReviewForm({ star: 5, desc: "" });
    },
  });

  const handleOrder = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setOrderLoading(true);
    try {
      await orderAPI.createOrder({ gigId: id });
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create order");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleContact = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await conversationAPI.createConversation({ to: gig.userId._id });
      navigate("/messages");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start conversation");
    }
  };

  const handleToggleFavourite = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    favouriteMutation.mutate();
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    reviewMutation.mutate({
      gigId: id,
      ...reviewForm,
    });
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  if (gigLoading) return <Loading />;

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Gig not found
          </h2>
          <Link
            to="/gigs"
            className="text-primary hover:underline"
          >
            Browse other services
          </Link>
        </div>
      </div>
    );
  }

  const rating =
    gig.starNumber > 0
      ? (gig.totalStars / gig.starNumber).toFixed(1)
      : 0;

  const isFavourite =
    !!gig.isFavourite ||
    !!(favouriteGigsData || []).find((g) => g._id === gig._id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="text-sm mb-4">
              <Link to="/gigs" className="text-gray-500 hover:text-primary">
                Gigs
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">{gig.category}</span>
            </nav>

            {/* Title */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {gig.title}
              </h1>
              {currentUser && (
                <button
                  onClick={handleToggleFavourite}
                  disabled={favouriteMutation.isPending}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <FiHeart
                    className={`w-5 h-5 ${
                      isFavourite ? "text-red-500 fill-red-500" : "text-gray-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {isFavourite ? "In favourites" : "Add to favourites"}
                  </span>
                </button>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex items-center mb-6">
              <img
                src={
                  gig.userId?.img ||
                  `https://ui-avatars.com/api/?name=${gig.userId?.username}&background=1dbf73&color=fff`
                }
                alt={gig.userId?.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <Link
                  to={`/profile/${gig.userId?._id}`}
                  className="font-medium text-gray-900 hover:text-primary"
                >
                  {gig.userId?.username}
                </Link>
                <div className="flex items-center">
                  <Stars rating={parseFloat(rating)} count={gig.starNumber} />
                </div>
              </div>
            </div>

            {/* Images Slider */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
              {gig.images && gig.images.length > 0 ? (
                <Slider {...sliderSettings}>
                  {[gig.cover, ...gig.images].map((img, index) => (
                    <div key={index}>
                      <img
                        src={img}
                        alt={`${gig.title} - ${index + 1}`}
                        className="w-full h-[400px] object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/800x400?text=Image";
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img
                  src={gig.cover || "https://placehold.co/800x400?text=Gig+Image"}
                  alt={gig.title}
                  className="w-full h-[400px] object-cover"
                />
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Gig
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{gig.desc}</p>
            </div>

            {/* Seller Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About The Seller
              </h2>
              <div className="flex items-start">
                <img
                  src={
                    gig.userId?.img ||
                    `https://ui-avatars.com/api/?name=${gig.userId?.username}&background=1dbf73&color=fff`
                  }
                  alt={gig.userId?.username}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="ml-6">
                  <Link
                    to={`/profile/${gig.userId?._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary"
                  >
                    {gig.userId?.username}
                  </Link>
                  <p className="text-gray-500">{gig.userId?.country}</p>
                  <button
                    onClick={handleContact}
                    className="mt-4 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Contact Me
                  </button>
                </div>
              </div>
              {gig.userId?.desc && (
                <p className="mt-4 text-gray-700">{gig.userId.desc}</p>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Reviews ({reviews?.length || 0})
                </h2>
                <Stars rating={parseFloat(rating)} count={gig.starNumber} />
              </div>

              {/* Review Form */}
              {currentUser && currentUser._id !== gig.userId?._id && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="mb-8 p-4 bg-gray-50 rounded-lg"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Leave a Review
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewForm({ ...reviewForm, star })
                          }
                          className="p-1"
                        >
                          <FiStar
                            className={`w-6 h-6 ${
                              star <= reviewForm.star
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.desc}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, desc: e.target.value })
                      }
                      rows={4}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reviewMutation.isPending}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </button>
                  {reviewMutation.isError && (
                    <p className="mt-2 text-red-500 text-sm">
                      {reviewMutation.error?.response?.data?.message ||
                        "Failed to submit review"}
                    </p>
                  )}
                </form>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <Loading text="Loading reviews..." />
              ) : reviews && reviews.length > 0 ? (
                <div>
                  {reviews.map((review) => (
                    <Review key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - Order Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {gig.shortTitle}
                  </h3>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatINR(gig.priceInr || gig.price)}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{gig.shortDesc}</p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-2" />
                    {gig.deliveryTime} Days Delivery
                  </div>
                  <div className="flex items-center">
                    <FiRefreshCw className="w-4 h-4 mr-2" />
                    {gig.revisionNumber} Revisions
                  </div>
                </div>

                {/* Features */}
                {gig.features && gig.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      What's Included
                    </h4>
                    <ul className="space-y-2">
                      {gig.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <FiCheck className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={handleOrder}
                  disabled={
                    orderLoading ||
                    currentUser?._id === gig.userId?._id
                  }
                  className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderLoading
                    ? "Processing..."
                    : currentUser?._id === gig.userId?._id
                    ? "This is your service"
                    : `Continue (${formatINR(gig.priceInr || gig.price)})`}
                </button>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleContact}
                  className="w-full flex items-center justify-center gap-2 py-2 text-gray-700 hover:text-primary transition"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gig;
