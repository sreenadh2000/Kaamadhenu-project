import { useNavigate } from "react-router";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <section className="relative h-96 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1600"
        alt="Organic Ghee"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/80 to-black/40" />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Premium A2 Organic Milk
            </h2>
            <p className="text-xl mb-6">
              Made with traditional bull-driven method, preserving all nutrients
            </p>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
