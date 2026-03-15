import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/user/useCartStore";

export default function CartCountBadge() {
  // We grab the count directly.
  // Because it's a selector, this component only re-renders
  // when the number of items in the cart actually changes.
  const count = useCartStore((state) => state.cartCount());

  return (
    <div className="relative inline-block group">
      <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-green-600 transition-colors duration-200" />

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
          {count > 99 ? "9" : count}
        </span>
      )}
    </div>
  );
}
