import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const GV_TopNav: React.FC = () => {
  // Local state variables defined in the datamap
  const [active_nav_item, setActiveNavItem] = useState<string>("home");
  const [is_mobile_menu_open, setMobileMenuOpen] = useState<boolean>(false);

  const location = useLocation();

  // Set active navigation item based on current route
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/") {
      setActiveNavItem("home");
    } else if (pathname.startsWith("/recipes")) {
      setActiveNavItem("recipes");
    } else if (pathname === "/about") {
      setActiveNavItem("about");
    } else if (pathname === "/contact") {
      setActiveNavItem("contact");
    } else {
      setActiveNavItem("home");
    }
  }, [location]);

  // Action: Toggle mobile menu open/close state
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!is_mobile_menu_open);
  };

  // Action: Set active nav item and close mobile menu if open
  const handleNavClick = (nav_item: string) => {
    setActiveNavItem(nav_item);
    if (is_mobile_menu_open) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Branding Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" onClick={() => handleNavClick("home")}>
                <img
                  className="h-8 w-8"
                  src="https://picsum.photos/seed/logo/50"
                  alt="Logo"
                />
              </Link>
              <div className="ml-2">
                <Link to="/" onClick={() => handleNavClick("home")}>
                  <span className="text-xl font-bold">Libyan Hot Food</span>
                </Link>
                <p className="text-sm text-gray-500">Authentic Taste of Libya</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center">
              <Link
                to="/"
                onClick={() => handleNavClick("home")}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                  active_nav_item === "home"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link
                to="/recipes"
                onClick={() => handleNavClick("recipes")}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                  active_nav_item === "recipes"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Recipes
              </Link>
              <Link
                to="/about"
                onClick={() => handleNavClick("about")}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                  active_nav_item === "about"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => handleNavClick("contact")}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                  active_nav_item === "contact"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
              >
                <span className="sr-only">Toggle main menu</span>
                {is_mobile_menu_open ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {is_mobile_menu_open && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                onClick={() => handleNavClick("home")}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  active_nav_item === "home"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link
                to="/recipes"
                onClick={() => handleNavClick("recipes")}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  active_nav_item === "recipes"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Recipes
              </Link>
              <Link
                to="/about"
                onClick={() => handleNavClick("about")}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  active_nav_item === "about"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => handleNavClick("contact")}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  active_nav_item === "contact"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default GV_TopNav;