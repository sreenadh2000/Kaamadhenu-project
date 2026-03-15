import Banner from "./Banner";
import Categories from "./Categories";
import FeaturedProducts from "./FeaturedProducts";
import FeaturesBar from "./FeaturesBar";
import Hero from "./Hero";
import Newsletter from "./NewsLetter";
import Testimonials from "./Testimonials";
import WhyUs from "./WhyUs";

const Home = () => {
  return (
    <div className="bg-linear-to-b from-white to-amber-50">
      {/* Hero Slider */}
      <Hero />
      {/* Features Bar */}
      {/* <FeaturesBar /> */}
      {/* Categories Section */}
      <Categories />
      {/* Featured Products */}
      {/* <FeaturedProducts /> */}
      {/* Banner CTA */}
      <Banner />
      {/* Testimonials */}
      <Testimonials />
      {/* Why Choose Us */}
      <WhyUs />
      {/* Newsletter */}
      {/* <Newsletter /> */}
    </div>
  );
};

export default Home;
