// import React, { useState, useEffect, useRef, useMemo } from "react";
// import {
//   Search,
//   User,
//   ChevronDown,
//   Package,
//   LogOut,
//   Edit,
//   Truck,
//   Star,
//   Shield,
//   Gift,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import CartCountBadge from "../../components/user/CartCounterBadge";
// import useDebounce from "../../hooks/common/useDebounce";
// import AuthPromptModal from "../../components/user/AuthPromptModal";
// import { useAuthStore } from "../../store/auth/useAuthStore";
// import { useCartStore } from "../../store/user/useCartStore";
// import { useOrderStore } from "../../store/user/useOrderStore";

// const UserNavbar = () => {
//   const navigate = useNavigate();
//   const { user: currentUser, logout } = useAuthStore();
//   const { fetchCart } = useCartStore();
//   const { fetchMyOrders, orders } = useOrderStore();

//   // Component State
//   const [announcementIndex, setAnnouncementIndex] = useState(0);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Refs for Outside Click Handling
//   const userMenuRef = useRef(null);
//   // const debouncedSearch = useDebounce(searchTerm, 500);

//   /* ---------------------- Initial Data Fetch ---------------------- */
//   useEffect(() => {
//     if (currentUser) {
//       fetchCart();
//       fetchMyOrders();
//     }
//   }, [currentUser, fetchCart, fetchMyOrders]);

//   /* ---------------------- Announcement Logic ---------------------- */
//   const announcements = useMemo(
//     () => [
//       { text: "Free shipping on orders over ₹500", icon: Truck },
//       { text: "4.8/5 Customer Satisfaction", icon: Star },
//       { text: "100% Quality Guarantee", icon: Shield },
//       { text: "New User? Get 20% OFF", icon: Gift },
//     ],
//     [],
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [announcements.length]);

//   const CurrentIcon = announcements[announcementIndex].icon;

//   /* ---------------------- Click Outside Handler ---------------------- */
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // If the click is OUTSIDE the userMenuRef container, close the dropdown
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ---------------------- Event Handlers ---------------------- */
//   const handleLogout = async () => {
//     await logout();
//     setIsDropdownOpen(false);
//     navigate("/");
//   };

//   const handleCartClick = (e) => {
//     e.preventDefault();
//     if (!currentUser) setIsAuthModalOpen(true);
//     else navigate("/cart");
//   };

//   /* ---------------------- UI Components ---------------------- */
//   return (
//     <div className="w-full bg-white shadow-sm sticky top-0 z-50">
//       {/* 🔔 Announcement Bar */}
//       <div className="bg-linear-to-r from-green-50 via-emerald-50 to-teal-50 border-b border-green-100 py-2">
//         <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
//           <CurrentIcon className="w-4 h-4 text-green-600 shrink-0" />
//           <p className="text-sm font-medium text-gray-800 transition-all duration-500">
//             {announcements[announcementIndex].text}
//           </p>
//         </div>
//       </div>

//       {/* Main NavBar */}
//       <div className="bg-white border-b py-3">
//         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-[auto_1fr_auto] items-center gap-4">
//           {/* 1. Logo */}
//           <Link to="/" className="flex items-center gap-2.5 group">
//             <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
//               <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
//                 <div className="w-3.5 h-3.5 bg-green-500 rounded-sm"></div>
//               </div>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 leading-none">
//                 Fresh<span className="text-green-600">Mart</span>
//               </h1>
//               <p className="hidden sm:block text-[10px] text-gray-500 mt-0.5 font-bold uppercase tracking-wider">
//                 Quality Groceries
//               </p>
//             </div>
//           </Link>

//           {/* 2. Search Bar (Center) */}
//           <div className="col-span-2 md:col-span-1 md:order-2 md:mx-12 lg:mx-20">
//             <div className="relative">
//               <input
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 type="text"
//                 placeholder="Search for fruits, vegetables, dairy..."
//                 className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all text-sm"
//               />
//               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             </div>
//           </div>

//           {/* 3. Actions (Right) */}
//           <div className="flex justify-end items-center gap-2 md:gap-4 md:order-3">
//             {currentUser ? (
//               <div className="relative" ref={userMenuRef}>
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className={`flex items-center gap-2 px-2 md:px-3 py-2 rounded-xl transition-all ${
//                     isDropdownOpen
//                       ? "bg-green-50 ring-1 ring-green-100"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="w-9 h-9 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
//                     <User className="w-4 h-4 text-white" />
//                   </div>
//                   <span className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-700">
//                     Hi, {currentUser.firstName}
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
//                     />
//                   </span>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-60 animate-in fade-in slide-in-from-top-2">
//                     <div className="px-5 py-4 border-b border-gray-50">
//                       <p className="font-bold text-gray-900 leading-tight">
//                         {currentUser.firstName} {currentUser.lastName}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1 truncate">
//                         {currentUser.email}
//                       </p>
//                     </div>

//                     <div className="p-2 space-y-1">
//                       <Link
//                         to="/profile"
//                         onClick={() => setIsDropdownOpen(false)}
//                         className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-lg transition-colors text-sm font-medium"
//                       >
//                         <Edit className="w-4 h-4" /> Edit Profile
//                       </Link>

//                       <Link
//                         to="/profile/orders"
//                         onClick={() => setIsDropdownOpen(false)}
//                         className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-lg transition-colors text-sm font-medium"
//                       >
//                         <Package className="w-4 h-4" /> My Orders (
//                         {orders.length})
//                       </Link>

//                       <hr className="my-1 border-gray-50" />

//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg transition-colors text-sm font-medium"
//                       >
//                         <LogOut className="w-4 h-4" /> Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div
//                 onClick={() => {
//                   setIsAuthModalOpen(false);
//                   navigate("/auth/login");
//                 }}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-md shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all"
//               >
//                 <User className="w-4 h-4" /> Sign In Work
//               </div>
//               // <Link
//               //   to="/auth/login"
//               //   className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-md shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all"
//               // >
//               //   <User className="w-4 h-4" /> Sign In
//               // </Link>
//             )}

//             {/* Cart Button */}
//             <div
//               onClick={handleCartClick}
//               className="cursor-pointer relative p-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all active:scale-90"
//             >
//               <CartCountBadge />
//             </div>

//             <AuthPromptModal
//               isOpen={isAuthModalOpen}
//               onClose={() => setIsAuthModalOpen(false)}
//               onLogin={() => {
//                 setIsAuthModalOpen(false);
//                 navigate("/auth/login");
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserNavbar;

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  User,
  ChevronDown,
  Package,
  LogOut,
  Edit,
  Truck,
  Star,
  Shield,
  Gift,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CartCountBadge from "../../components/user/CartCounterBadge";
import AuthPromptModal from "../../components/user/AuthPromptModal";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { useCartStore } from "../../store/user/useCartStore";
import { useOrderStore } from "../../store/user/useOrderStore";
import Logo from "../../assets/user/Logo.jpeg";

const UserNavbar = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchMyOrders, orders } = useOrderStore();

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userMenuRef = useRef(null);

  /* ---------------------- Fetch User Data ---------------------- */
  useEffect(() => {
    if (currentUser) {
      fetchCart();
      fetchMyOrders();
    }
  }, [currentUser, fetchCart, fetchMyOrders]);

  /* ---------------------- Announcement Messages ---------------------- */
  const announcements = useMemo(
    () => [
      { text: "Free shipping on orders over ₹500", icon: Truck },
      { text: "4.8/5 Customer Satisfaction", icon: Star },
      { text: "100% Quality Guarantee", icon: Shield },
      { text: "New User? Get 20% OFF", icon: Gift },
    ],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const CurrentIcon = announcements[announcementIndex].icon;

  /* ---------------------- Close Dropdown Outside Click ---------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------------- Handlers ---------------------- */
  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleCartClick = (e) => {
    e.preventDefault();

    if (!currentUser) setIsAuthModalOpen(true);
    else navigate("/cart");
  };

  /* ---------------------- UI ---------------------- */

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-linear-to-r from-green-50 via-emerald-50 to-teal-50 border-b border-green-100 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <CurrentIcon className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-sm font-medium text-gray-800 transition-all duration-500">
            {announcements[announcementIndex].text}
          </p>
        </div>
      </div>

      {/* Navbar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo */}
          {/* <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              </div>
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Fresh<span className="text-green-600">Mart</span>
              </h1>
              <p className="hidden sm:block text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Quality Groceries
              </p>
            </div>
          </Link> */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={Logo}
              alt="Kaamadhenu Logo"
              className="w-12 h-12 md:w-24 md:h-24 object-contain"
            />

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Kaamadhenu
              </h1>

              <p className="hidden sm:block text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Fresh Groceries
              </p>
            </div>
          </Link>

          {/* Search */}
          <div className="w-full order-3 md:order-2 md:flex-1 md:max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for fruits, vegetables..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 text-sm"
              />

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 order-2 md:order-3">
            {/* User Menu */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>

                  <span className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-700">
                    Hi, {currentUser.firstName}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 sm:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-5 py-4 border-b">
                      <p className="font-bold text-gray-900">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 rounded-lg text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </Link>

                      <Link
                        to="/profile/orders"
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 rounded-lg text-sm"
                      >
                        <Package className="w-4 h-4" />
                        My Orders ({orders.length})
                      </Link>

                      <hr />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-red-50 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth/login")}
                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-md hover:scale-[1.02]"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Cart */}
            <div
              onClick={handleCartClick}
              className="cursor-pointer relative p-2 sm:p-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100"
            >
              <CartCountBadge />
            </div>

            {/* Auth Modal */}
            <AuthPromptModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              onLogin={() => {
                setIsAuthModalOpen(false);
                navigate("/auth/login");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
