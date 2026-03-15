import React from "react";
import { ShoppingCart, LogIn, X } from "lucide-react";

const AuthPromptModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 pt-10 text-center">
          {/* Icon Circle */}
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <ShoppingCart className="w-10 h-10 text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Sign in to shop
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Please sign in to add products to your cart and sync your shopping
            list across all your devices.
          </p>

          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full py-3.5 bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In to Continue
            </button>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-transparent text-gray-500 font-medium rounded-xl hover:text-gray-800 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Bottom Accent Strip */}
        <div className="h-2 bg-linear-to-r from-green-400 to-emerald-500" />
      </div>
    </div>
  );
};

export default AuthPromptModal;
