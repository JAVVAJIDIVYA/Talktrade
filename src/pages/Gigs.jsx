import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import GigCard from "../components/GigCard";
import Loading from "../components/Loading";
import { gigAPI, userAPI } from "../utils/api";
import { categoriesForFilter } from "../utils/categories";
import { useAuth } from "../context/AuthContext";

const Gigs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || "",
    sort: searchParams.get("sort") || "createdAt",
    search: searchParams.get("search") || "",
  });
  const { currentUser } = useAuth();
  const showFavouritesOnly = searchParams.get("favourites") === "1";

  const { data: gigsData, isLoading } = useQuery({
    queryKey: ["gigs", filters],
    queryFn: async () => {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.min) params.min = filters.min;
      if (filters.max) params.max = filters.max;
      if (filters.sort) params.sort = filters.sort;
      if (filters.search) params.search = filters.search;
      const res = await gigAPI.getGigs(params);
      return res.data;
    },
    refetchOnMount: 'always',
  });


  const { data: favouriteGigsData } = useQuery({
    queryKey: ["favouriteGigs"],
    queryFn: async () => {
      const res = await userAPI.getFavouriteGigs();
      return res.data;
    },
    enabled: !!currentUser,
  });

  const favouriteIds = new Set(
    (favouriteGigsData || []).map((g) => g._id)
  );

  const gigsWithFlag = (gigsData || []).map((gig) => ({
    ...gig,
    isFavourite: favouriteIds.has(gig._id),
  }));

  const gigs = showFavouritesOnly
    ? gigsWithFlag.filter((gig) => gig.isFavourite)
    : gigsWithFlag;

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.min) params.set("min", filters.min);
    if (filters.max) params.set("max", filters.max);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.search) params.set("search", filters.search);
    if (showFavouritesOnly) params.set("favourites", "1");
    setSearchParams(params);
  }, [filters, showFavouritesOnly, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      min: "",
      max: "",
      sort: "createdAt",
      search: "",
    });
  };


  const sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "sales", label: "Best Selling" },
    { value: "rating", label: "Top Rated" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  const getCategoryLabel = () => {
    if (showFavouritesOnly) return "My Favourites";
    const cat = categoriesForFilter.find((c) => c.value === filters.category);
    return cat ? cat.label : "All Services";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getCategoryLabel()}</h1>
          {filters.search && (
            <p className="text-gray-600 mt-2">
              Results for "{filters.search}"
            </p>
          )}
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-4 flex-wrap">
              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categoriesForFilter.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={filters.min}
                  onChange={(e) => handleFilterChange("min", e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={filters.max}
                  onChange={(e) => handleFilterChange("max", e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Clear Filters */}
              {(filters.category ||
                filters.min ||
                filters.max ||
                filters.search) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600"
                >
                  <FiX className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <FiFilter className="w-4 h-4" />
              Filters
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {categoriesForFilter.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={filters.min}
                    onChange={(e) => handleFilterChange("min", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={filters.max}
                    onChange={(e) => handleFilterChange("max", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          {isLoading ? "Loading..." : `${gigs?.length || 0} services available`}
        </p>

        {/* Gigs Grid */}
        {isLoading ? (
          <Loading />
        ) : gigs && gigs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map((gig) => {
              console.log('Gig being passed to GigCard:', gig);
              return <GigCard key={gig._id} gig={gig} />;
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
