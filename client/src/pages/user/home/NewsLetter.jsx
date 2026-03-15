const Newsletter = () => {
  return (
    <section className="bg-linear-to-b from-amber-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Join Our Family
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Subscribe for exclusive offers, health tips, and updates on new
          products
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-6 py-4 rounded-full border-2 border-gray-300 focus:border-green-600 focus:outline-none text-lg"
          />
          <button className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg whitespace-nowrap">
            Subscribe Now
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          🎁 Get 10% off on your first order when you subscribe
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
