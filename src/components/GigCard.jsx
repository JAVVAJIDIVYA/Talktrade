import { Link } from "react-router-dom";
import { FiStar, FiHeart } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";
import { formatINR } from "../utils/currency";

const GigCard = ({ gig }) => {
  console.log('GigCard received gig:', gig);
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", gig.userId],
    queryFn: () => userAPI.getUser(gig.userId).then(res => res.data),
    enabled: !!gig.userId,
  });

  const rating =
    gig.starNumber > 0
      ? (gig.totalStars / gig.starNumber).toFixed(1)
      : "New";

  const isFavourite = !!gig.isFavourite;

  const favouriteMutation = useMutation({
    mutationFn: () => userAPI.toggleFavouriteGig(gig._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["gig", gig._id]);
      queryClient.invalidateQueries(["gigs"]);
      queryClient.invalidateQueries(["favouriteGigs"]);
    },
  });

  const handleToggleFavourite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    favouriteMutation.mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
      <Link to={`/gig/${gig._id}`}>
        <div className="relative">
          <img
            src={gig.cover || "https://placehold.co/400x250?text=Gig+Image"}
            alt={gig.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.src = "https://placehold.co/400x250?text=Gig+Image";
            }}
          />
          {currentUser && (
            <button
              onClick={handleToggleFavourite}
              disabled={favouriteMutation.isPending}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition disabled:opacity-50"
            >
              <FiHeart
                className={`w-4 h-4 ${
                  isFavourite ? "text-red-500 fill-red-500" : "text-gray-600"
                }`}
              />
            </button>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Seller Info */}
        <div className="flex items-center mb-3">
          {isUserLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <Link to={`/profile/${user?._id}`}>
              <img
                src={
                  user?.img ||
                  `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=3b82f6&color=fff`
                }
                alt={user?.username}
                className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-primary transition"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=3b82f6&color=fff`;
                }}
              />
            </Link>
          )}
          <div className="ml-2">
            <Link
              to={`/profile/${user?._id}`}
              className="text-sm font-medium text-gray-800 hover:text-primary"
            >
              {isUserLoading ? 'Loading...' : user?.username || "Unknown"}
            </Link>
            <p className="text-xs text-gray-500">{user?.country}</p>
          </div>
        </div>

        {/* Title */}
        <Link to={`/gig/${gig._id}`}>
          <h3 className="text-gray-800 font-medium mb-2 line-clamp-2 hover:text-primary transition">
            {gig.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 text-sm font-medium text-yellow-500">
            {rating}
          </span>
          <span className="ml-1 text-sm text-gray-500">
            ({gig.starNumber || 0})
          </span>
        </div>

        {/* Price in INR */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-500 uppercase">Starting at</span>
          <span className="text-lg font-bold text-gray-900">
            {formatINR(gig.priceInr || gig.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
