"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authSlice.ts";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { BorderBeam } from "../components/magicui/border-beam";

export function NavbarComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, data: user } = useSelector((state) => state.auth);

  const navItems = [
    { name: "Courses", link: "/all-courses" },
    { name: "Our Students", link: "/" },
    { name: "Contact", link: "/contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState({});
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const logoutLock = useRef(false);

  // Stable handleLogout
  const handleLogout = useCallback(() => {
    if (logoutLock.current) return;
    
    try {
      logoutLock.current = true;
      console.log("Logout triggered!");
      
      dispatch(logout());
      toast.success("Logged out successfully!");
      
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/");
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setTimeout(() => { 
        logoutLock.current = false; 
      }, 1000);
    }
  }, [dispatch, navigate]);

  // Profile menu items
  const profileMenuItems = [
    {
      name: "My Dashboard",
      icon: "📊",
      action: () => {
        navigate("/dashboard");
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      },
    },
    {
      name: "My Profile",
      icon: "👤",
      action: () => {
        navigate("/me");
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      },
    },
    {
      name: "Settings",
      icon: "⚙️",
      action: () => {
        navigate("/settings");
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      },
    },
    {
      name: "Logout",
      icon: "🚪",
      action: handleLogout,
      className: "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20",
    },
  ];

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 1);
  };

  // Get avatar URL - Fixed to handle different possible structures
  const getAvatarUrl = (user:any) => {
    if (!user) return null;
    
    if (user.avatar) {
      if (user.avatar.secureUrl) {
        return user.avatar.secureUrl;
      }
    }
  };

  // Handle image load error
  const handleImageError = (userId:any) => {
    console.log("Image failed to load for user:", userId);
    setImageError(prev => ({
      ...prev,
      [userId]: true
    }));
  };

  // Profile Avatar Component
  const ProfileAvatar = ({ user, onClick, showDropdown = true, size = "default" }) => {
    const avatarUrl = getAvatarUrl(user);
    const hasImageError = imageError[user?.id] || imageError[user?._id];
    const shouldShowImage = avatarUrl && !hasImageError;
    
    const sizeClasses = {
      small: "w-8 h-8 text-xs",
      default: "w-10 h-10 text-sm",
      large: "w-12 h-12 text-base"
    };

    return (
      <div
        className="relative"
        ref={showDropdown ? dropdownRef : null}
        onMouseEnter={showDropdown ? () => {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          setIsProfileDropdownOpen(true);
        } : undefined}
        onMouseLeave={showDropdown ? () => {
          hoverTimeoutRef.current = setTimeout(() => setIsProfileDropdownOpen(false), 200);
        } : undefined}
      >
        
        <button
          type="button"
          onClick={onClick}
          className={`profile-avatar cursor-pointer flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative overflow-hidden ${sizeClasses[size]}`}
          aria-label="User profile menu"
        >
          {shouldShowImage ? (
            <>
              <BorderBeam />
              <img
                src={avatarUrl}
                alt={user?.name || "User"}
                className="w-full h-full rounded-full object-cover"
                onError={() => handleImageError(user?.id || user?._id)}
                onLoad={() => {
                  // Clear any previous error state when image loads successfully
                  setImageError(prev => {
                    const newState = { ...prev };
                    delete newState[user?.id];
                    delete newState[user?._id];
                    return newState;
                  });
                }}
              />
            </>
          ) : (
            <>
              <BorderBeam />
              <span>{getUserInitials(user?.name)}</span>
            </>
          )}
        </button>

        {showDropdown && isProfileDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
            onMouseEnter={() => hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current)}
            onMouseLeave={() => {
              hoverTimeoutRef.current = setTimeout(() => setIsProfileDropdownOpen(false), 200);
            }}
          >
            
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <ProfileAvatar 
                    user={user} 
                    showDropdown={false} 
                    onClick={() => {}}
                    size="default"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Hey, {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
                      
            <div className="py-1">
              {profileMenuItems.map((item, index) => (
                <div key={index} className="relative">
                  <BorderBeam />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      item.action();
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-150 cursor-pointer ${item.className || ""}`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <ProfileAvatar
                user={user}
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                showDropdown={true}
              />
            ) : (
              <>
                <NavbarButton href="/login" variant="secondary">
                  Login
                </NavbarButton>
                <NavbarButton href="/signup" variant="primary">
                  Register
                </NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-3">
              {isLoggedIn && (
                <ProfileAvatar
                  user={user}
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  showDropdown={false}
                  size="small"
                />
              )}
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            {isLoggedIn ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {/* Mobile User Info */}
                <div className="flex items-center space-x-3 px-2 py-3 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <ProfileAvatar 
                    user={user} 
                    showDropdown={false} 
                    onClick={() => {}}
                    size="large"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                    {/* Debug info - remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                      <p className="text-xs text-green-500 mt-1">
                        ID: {user?.id || user?._id || 'No ID'}
                      </p>
                    )}
                  </div>
                </div>
                {/* Mobile Menu Items */}
                {profileMenuItems.map((item, index) => (
                  <button
                    key={`mobile-profile-${index}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(`Mobile menu item clicked: ${item.name}`);
                      item.action();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-3 text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md px-2 ${item.className || ""}`}
                    disabled={item.name === "Logout" && logoutLock.current}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                    {item.name === "Logout" && logoutLock.current && (
                      <span className="ml-auto text-xs text-gray-400">...</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex w-full flex-col gap-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <NavbarButton
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  onClick={() => {
                    navigate("/signup");
                    setIsMobileMenuOpen(false);
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Register
                </NavbarButton>
              </div>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}