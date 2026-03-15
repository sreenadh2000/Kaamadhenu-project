import { Star } from "lucide-react";

const products = [
  {
    name: "Raw Honey (Shivaliks)",
    price: 320,
    oldPrice: 384,
    img: "https://plus.unsplash.com/premium_photo-1691095182210-a1b3c46a31d6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmF3JTIwaG9uZXl8ZW58MHx8MHx8fDA%3D",
    rating: 5,
    reviews: 124,
  },
  {
    name: "Organic Buffalo Ghee",
    price: 900,
    oldPrice: 1080,
    img: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500",
    rating: 5,
    reviews: 89,
  },
  {
    name: "Raw Honey (Jim Corbett)",
    price: 320,
    oldPrice: 384,
    img: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmF3JTIwaG9uZXl8ZW58MHx8MHx8fDA%3D",
    rating: 5,
    reviews: 156,
  },
  {
    name: "Himalayan Pink Salt",
    price: 230,
    oldPrice: 276,
    img: "https://images.unsplash.com/photo-1633727783375-750547d0fc21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGluayUyMHNhbHR8ZW58MHx8MHx8fDA%3D",
    rating: 5,
    reviews: 203,
  },
  {
    name: "Wild Forest Honey",
    price: 600,
    oldPrice: 720,
    img: "https://images.unsplash.com/photo-1623018697148-8350cf18e64e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9uZXl8ZW58MHx8MHx8fDA%3D",
    rating: 5,
    reviews: 178,
  },
  {
    name: "A2 Cow Ghee",
    price: 900,
    oldPrice: 1080,
    img: "https://plus.unsplash.com/premium_photo-1664647903543-2ef213d1e754?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y293JTIwbWlsa3xlbnwwfHwwfHx8MA%3D%3D",
    rating: 5,
    reviews: 145,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="bg-linear-to-b from-white to-amber-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked premium products loved by our customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden aspect-square">
                <span className="absolute top-4 left-4 bg-linear-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg">
                  {Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) *
                      100,
                  )}
                  % OFF
                </span>
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviews})
                  </span>
                </div>

                <p className="text-xs text-green-700 font-semibold mb-1 uppercase tracking-wide">
                  Proud Farmer Organics
                </p>
                <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-800">
                    ₹{product.price}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.oldPrice}
                  </span>
                </div>

                <button className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
