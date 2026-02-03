import { Link, Outlet, useLocation } from "react-router-dom";
import { FiGrid, FiUsers, FiPlusCircle, FiLogOut, FiUserCheck } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: FiGrid },
    { name: "Add Employee", path: "/admin/add", icon: FiPlusCircle },
    { name: "Seller Requests", path: "/admin/requests", icon: FiUserCheck },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6">
          <Link to="/admin" className="text-2xl font-bold text-gray-900">
            Admin Panel
          </Link>
        </div>
        <nav className="mt-6">
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="px-6 py-2">
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-gray-200 w-full"
            >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
