import { FiStar } from "react-icons/fi";

const Stars = ({ rating, count, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <FiStar
            key={index}
            className={`w-4 h-4 ${
              index < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : index === fullStars && hasHalfStar
                ? "text-yellow-400 fill-yellow-200"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="ml-2 text-sm font-medium text-yellow-500">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </span>
      {showCount && count !== undefined && (
        <span className="ml-1 text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
};

export default Stars;
