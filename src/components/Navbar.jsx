import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../provider/AuthContext";
import { toast } from "sonner";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  let lastScrollY = useRef(0);

  const handleLogout = () => {
    logout();
    toast.success("Logout Successful", { duration: 2000 });
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle Navbar Hide/Show on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`bg-white shadow-md fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            শিক্ষা প্লাটফর্ম
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-600 transition-all duration-300">হোম</Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="btn btn-ghost btn-circle avatar focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
                    <img
                      alt="User Avatar"
                      src={user?.avatar?.url || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    />
                  </div>
                </button>
                
                <div
                  className={`absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 transform ${
                    isDropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                  }`}
                >
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 transition-all">
                      <Link to={user.role === 'admin' ? '/admin' : '/user'} onClick={() => setIsDropdownOpen(false)}>Dashboard</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 transition-all">
                      <Link to="/settings" onClick={() => setIsDropdownOpen(false)}>Settings</Link>
                    </li>
                    <li
                      className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer transition-all"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-600 transition-all duration-300">Login</Link>
                <Link to="/register" className="hover:text-blue-600 transition-all duration-300">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu with Smooth Slide Effect */}
        <div
          className={`md:hidden fixed top-16 left-0 w-full bg-white border-t border-gray-100 shadow-md transform transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "h-auto opacity-100 visible" : "h-0 opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col space-y-4 py-4 px-4">
            <Link to="/" className="hover:text-blue-600 transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
              হোম
            </Link>

            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/user'} className="hover:text-blue-600 transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/settings" className="hover:text-blue-600 transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  Settings
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition-all duration-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-600 transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-600 transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
