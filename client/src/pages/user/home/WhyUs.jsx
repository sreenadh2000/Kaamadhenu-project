import { Award, Leaf, Heart } from "lucide-react";

const WhyUs = () => {
  return (
    <section className="bg-linear-to-br from-green-800 to-green-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Kaamadhenu ?
          </h2>
          <p className="text-xl opacity-90">
            Committed to purity, quality, and sustainability
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">100% Fresh</h3>
            <p className="opacity-90 leading-relaxed">
              All our products are fresh, free from chemicals, pesticides, and
              preservatives.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Farmer Owned</h3>
            <p className="opacity-90 leading-relaxed">
              Direct partnerships with farmers ensure fair prices and support
              rural communities.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Premium Quality</h3>
            <p className="opacity-90 leading-relaxed">
              Traditional methods combined with modern quality standards for the
              finest products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
