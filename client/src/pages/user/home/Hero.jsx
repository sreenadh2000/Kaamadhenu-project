import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Truck,
  Shield,
  Leaf,
  Heart,
} from "lucide-react";
import Farm from "../../../assets/user/hero/Farm.jpeg";
import Milk from "../../../assets/user/hero/Milk.jpeg";
import Minerals from "../../../assets/user/hero/Minerals.jpeg";

const slides = [
  {
    mobile: Farm,
    desktop: Farm,
    title: "Forming Foods",
    subtitle: "Building better nutrition with natural ingredients.",
  },
  {
    mobile: Milk,
    desktop: Milk,
    title: "Pure Milk",
    subtitle: "Pure, fresh, and naturally nourishing every day.",
  },
  {
    mobile: Minerals,
    desktop: Minerals,
    title: "Healthy Pulses",
    subtitle: "Traditional pulses filled with essential nutrients.",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative">
      <div className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={slide.desktop} />
              <img
                src={slide.mobile}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </picture>

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl mb-6 font-light">
                  {slide.subtitle}
                </p>
                <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                  Honoring Farmers, Delivering Purity
                </p>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                  <a href="/products">Explore</a>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-12"
                : "bg-white/60 w-2 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
