import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";
import { categories } from "../utils/categories";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${searchQuery}`);
      setSearchQuery("");
    }
  };


  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled || !isHome
            ? "bg-white shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span
                className={`text-2xl font-bold ${
                  isScrolled || !isHome ? "text-gray-900" : "text-white"
                }`}
              >
                Talk{" "}
                <span
                  className={
                    isScrolled || !isHome
                      ? "text-primary"
                      : "text-white font-extrabold drop-shadow-md"
                  }
                >
                  Trade
                </span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            {(isScrolled || !isHome) && (
              <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center flex-1 max-w-xl mx-8"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="What service are you looking for today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 px-4 pr-12 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-md hover:bg-primary-dark transition"
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/gigs"
                className={`font-medium hover:text-primary transition ${
                  isScrolled || !isHome ? "text-gray-700" : "text-white"
                }`}
              >
                Explore
              </Link>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={currentUser.img || "/default-avatar.png"}
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=1dbf73&color=fff`;
                      }}
                    />
                    <span
                      className={`font-medium ${
                        isScrolled || !isHome ? "text-gray-700" : "text-white"
                      }`}
                    >
                      {currentUser.username}
                    </span>
                    <FiChevronDown
                      className={
                        isScrolled || !isHome ? "text-gray-700" : "text-white"
                      }
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
                      <Link
                        to={`/profile/${currentUser._id}`}
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      {currentUser.isSeller && (
                        <>
                          <Link
                            to="/mygigs"
                            onClick={() => setShowDropdown(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            My Gigs
                          </Link>
                          <Link
                            to="/add"
                            onClick={() => setShowDropdown(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Add New Gig
                          </Link>
                        </>
                      )}
                      {currentUser.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2 text-primary font-medium hover:bg-primary/5"
                        >
                          Admin
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/messages"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Messages
                      </Link>
                      <Link
                        to="/gigs?favourites=1"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Favourites
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          localStorage.clear();
                          alert('localStorage cleared');
                          window.location.reload();
                        }}
                        className="block w-full text-left px-4 py-2 text-yellow-600 hover:bg-gray-100"
                      >
                        Clear localStorage (Dev)
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`font-medium hover:text-primary transition ${
                      isScrolled || !isHome ? "text-gray-700" : "text-white"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-md font-medium transition ${
                      isScrolled || !isHome
                        ? "bg-primary text-white hover:bg-primary-dark"
                        : "border border-white text-white hover:bg-white hover:text-gray-900"
                    }`}
                  >
                    Join
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <FiX
                  className={`w-6 h-6 ${
                    isScrolled || !isHome ? "text-gray-900" : "text-white"
                  }`}
                />
              ) : (
                <FiMenu
                  className={`w-6 h-6 ${
                    isScrolled || !isHome ? "text-gray-900" : "text-white"
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg animate-fadeIn">
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md"
                />
              </form>
              <Link
                to="/gigs"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 font-medium"
              >
                Explore
              </Link>
              {currentUser ? (
                <>
                  <Link
                    to={`/profile/${currentUser._id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700"
                  >
                    Profile
                  </Link>
                  {currentUser.isSeller && (
                    <>
                      <Link
                        to="/mygigs"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-700"
                      >
                        My Gigs
                      </Link>
                      <Link
                        to="/add"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-700"
                      >
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link
                    to="/gigs?favourites=1"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700"
                  >
                    Favourites
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700"
                  >
                    Messages
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block py-2 text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 bg-primary text-white text-center rounded-md"
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Categories Menu */}
        {(isScrolled || !isHome) && (
          <div className="hidden md:block bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-8 py-2 overflow-x-auto">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className="text-sm text-gray-600 hover:text-primary whitespace-nowrap transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className={isHome && !isScrolled ? "" : "h-24"} />
    </>
  );
};

export default Navbar;
