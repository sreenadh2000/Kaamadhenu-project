import { Award, Truck, Shield, Leaf, Heart } from "lucide-react";

const features = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "100% Organic",
    desc: "Certified pure products",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Premium Quality",
    desc: "Finest ingredients",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Farmer Friendly",
    desc: "Direct from farmers",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Lab Tested",
    desc: "Quality assured",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Free Shipping",
    desc: "On orders above ₹1000",
  },
];
const FeaturesBar = () => {
  return (
    <section className="bg-white shadow-lg relative z-10 -mt-20 mx-4 md:mx-8 lg:mx-16 rounded-2xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-50 to-amber-50 rounded-full mb-3 group-hover:scale-110 transition-transform text-green-700">
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
