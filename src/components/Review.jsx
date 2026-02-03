import Stars from "./Stars";

const Review = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex items-start">
        <img
          src={
            review.userId?.img ||
            `https://ui-avatars.com/api/?name=${review.userId?.username || "User"}&background=1dbf73&color=fff`
          }
          alt={review.userId?.username}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${review.userId?.username || "User"}&background=1dbf73&color=fff`;
          }}
        />
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                {review.userId?.username || "Anonymous"}
              </h4>
              <p className="text-sm text-gray-500">{review.userId?.country}</p>
            </div>
            <Stars rating={review.star} showCount={false} />
          </div>
          <p className="mt-3 text-gray-700">{review.desc}</p>
          <p className="mt-2 text-sm text-gray-400">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Review;
