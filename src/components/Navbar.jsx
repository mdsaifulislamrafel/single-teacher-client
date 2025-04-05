/* eslint-disable no-constant-binary-expression */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../provider/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  let lastScrollY = useRef(0);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setTimeout(() => window.location.reload(), 500); 
    toast.success("Logout Successful", { duration: 2000 });
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

  // Animation variants
  const navbarVariants = {
    visible: { 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }
    },
    hidden: { 
      y: "-100%",
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }
    }
  };

  const mobileMenuVariants = {
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const menuItemVariants = {
    open: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { 
      y: 20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const dropdownVariants = {
    open: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 22,
        staggerChildren: 0.07,
        delayChildren: 0.05
      }
    },
    closed: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const dropdownItemVariants = {
    open: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { 
      y: 10, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.nav
      variants={navbarVariants}
      initial="visible"
      animate={isVisible ? "visible" : "hidden"}
      className="bg-white shadow-md fixed top-0 left-0 w-full z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-xl font-bold">
              <motion.span 
                whileHover={{ 
                  scale: 1.05, 
                  color: "#3B82F6",
                  transition: { duration: 0.2 }
                }}
              >
                শিক্ষা প্লাটফর্ম
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link to="/">
                <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10">হোম</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
            </motion.div>

            {user ? (
              <motion.div 
                className="relative" 
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="btn btn-ghost btn-circle avatar focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      alt="User Avatar"
                      src={
                        user?.avatar?.url ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                       || "/placeholder.svg"}
                    />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <ul className="py-2">
                        <motion.li 
                          variants={dropdownItemVariants}
                          className="px-4 py-2 hover:bg-gray-100 transition-all"
                        >
                          <Link
                            to={user.role === "admin" ? "/admin" : "/user"}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </motion.li>
                        <motion.li 
                          variants={dropdownItemVariants}
                          className="px-4 py-2 hover:bg-gray-100 transition-all"
                        >
                          <Link
                            to="/settings"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Settings
                          </Link>
                        </motion.li>
                        <motion.li
                          variants={dropdownItemVariants}
                          className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer transition-all"
                          onClick={handleLogout}
                        >
                          Logout
                        </motion.li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/login">
                  <motion.button 
                    className="w-36 h-12 border-2 border-sky-300 text-sky-800 font-black rounded-full relative group overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.span 
                      className="absolute w-12 rounded-full inset-2 bg-sky-300 -z-10"
                      initial={{ width: "12px" }}
                      whileHover={{ 
                        width: "calc(100% - 16px)", 
                        backgroundColor: "#0EA5E9" 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span
                      initial={{ color: "#075985" }}
                      whileHover={{ color: "#FFFFFF" }}
                      transition={{ duration: 0.3 }}
                    >
                      Login
                    </motion.span>
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bars3Icon className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu with Enhanced Animations */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden fixed top-16 left-0 w-full bg-white border-t border-gray-100 shadow-md overflow-hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col space-y-4 py-4 px-4">
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/"
                    className="block hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    হোম
                  </Link>
                </motion.div>

                {user ? (
                  <>
                    <motion.div variants={menuItemVariants}>
                      <Link
                        to={user.role === "admin" ? "/admin" : "/user"}
                        className="block hover:text-blue-600 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Link
                        to="/settings"
                        className="block hover:text-blue-600 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-600 transition-all duration-300"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/login"
                      className="block hover:text-blue-600 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
