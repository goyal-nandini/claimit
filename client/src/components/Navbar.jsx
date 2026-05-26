import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-base font-medium transition-colors duration-200 pb-1 ${
      isActive
        ? "text-purple-600 border-b-2 border-purple-600"
        : "text-gray-600 hover:text-purple-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/claimit-logo.png"
              alt="ClaimIt"
              className="h-20 w-auto"
            />
          </Link>

          {/* Center nav desktop */}
          {/* <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/items" className={navLinkClass}>Lost & Found</NavLink>
          </div> */}
          {/* Center nav desktop */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/items" className={navLinkClass}>
              Lost & Found
            </NavLink>
            <NavLink to="/post-item" className={navLinkClass}>
              Report Item
            </NavLink>
            <a
              href="/#how-it-works"
              className="text-base font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200"
            >
              How It Works
            </a>
          </div>

          {/* Right desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/post-item"
                  className="btn-primary text-base font-semibold px-3 py-2 rounded-xl"
                >
                  + Report Item
                </Link>
                <NavLink
                  to="/my-posts"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}`
                  }
                >
                  My Posts
                </NavLink>

                {/* Avatar dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-9 h-9 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center hover:bg-purple-700 transition-colors shadow-sm"
                    title={user.name}
                  >
                    {getInitials(user.name)}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-scale-in">
                      <div className="px-5 py-2.5 border-b border-gray-50 mb-1">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/my-posts"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        📋 My Posts
                      </Link>
                      <Link
                        to="/my-claims"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                         🙋 My Claims
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-purple-700 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4 animate-fade-in">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/items"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Lost & Found
            </NavLink>
            <NavLink
              to="/post-item"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Report Item
            </NavLink>
            <a
              href="/#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-gray-600 hover:text-purple-600"
            >
              How It Works
            </a>
            {user ? (
              <>
                <Link
                  to="/post-item"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary text-base font-semibold px-5 py-2.5 rounded-xl text-center"
                >
                  + Report Item
                </Link>
                <Link
                  to="/my-posts"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-gray-600"
                >
                  My Posts
                </Link>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary text-base font-semibold px-5 py-2.5 rounded-xl text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
