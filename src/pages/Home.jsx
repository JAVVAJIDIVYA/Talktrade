import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FiSearch,
  FiCheck,
  FiArrowRight,
  FiPlay,
} from "react-icons/fi";
import GigCard from "../components/GigCard";
import Loading from "../components/Loading";
import { gigAPI } from "../utils/api";
import { categories } from "../utils/categories";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: popularGigs, isLoading } = useQuery({
    queryKey: ["popularGigs"],
    queryFn: async () => {
      const res = await gigAPI.getGigs({ sort: "sales", limit: 8 });
      return res.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${searchQuery}`);
    }
  };


  const trustedBy = [
    "Meta",
    "Google",
    "Netflix",
    "Paypal",
    "Payoneer",
  ];

  const features = [
    {
      title: "The best for every budget",
      desc: "Find high-quality services at every price point. No hourly rates, just project-based pricing.",
    },
    {
      title: "Quality work done quickly",
      desc: "Find the right freelancer to begin working on your project within minutes.",
    },
    {
      title: "Protected payments, every time",
      desc: "Always know what you'll pay upfront. Your payment isn't released until you approve the work.",
    },
    {
      title: "24/7 support",
      desc: "Questions? Our round-the-clock support team is available to help anytime, anywhere.",
    },
  ];

  const testimonials = [
    {
      name: "Rahul Mehta",
      company: "Tech Startup CEO",
      text: "Talk Trade helped us find amazing developers for our project. The quality of work exceeded our expectations!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Nair",
      company: "Marketing Director",
      text: "We've been using Talk Trade for all our design needs. Fast, reliable, and always professional.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Vikram Reddy",
      company: "E-commerce Owner",
      text: "Found the perfect video editor for my YouTube channel. Best decision for my business!",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="-mt-24">
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center bg-gradient-to-r from-blue-600 to-blue-400"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Find the perfect{" "}
              <span className="italic text-white font-extrabold drop-shadow-md">
                freelancing
              </span>{" "}
              services for your business
            </h1>

            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex bg-white rounded-md overflow-hidden">
                <div className="flex-1 flex items-center px-4">
                  <FiSearch className="text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder='Try "building mobile app"'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-4 px-4 focus:outline-none text-gray-800"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-8 font-medium transition"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center text-white text-sm">
              <span className="mr-4 text-gray-300">Popular:</span>
              {["Website Design", "WordPress", "Logo Design", "Video Editing"].map(
                (tag) => (
                  <Link
                    key={tag}
                    to={`/gigs?search=${tag}`}
                    className="mr-2 px-3 py-1 border border-white/30 rounded-full hover:bg-white/10 transition"
                  >
                    {tag}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 md:space-x-16">
            <span className="text-gray-500 font-medium">Trusted by:</span>
            {trustedBy.map((company) => (
              <span key={company} className="text-gray-400 font-semibold text-xl">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Explore Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${cat.color} text-white group hover:scale-105 transition duration-300`}
              >
                <span className="text-4xl mb-4 block">{cat.icon}</span>
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <FiArrowRight className="absolute bottom-4 right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                A whole world of freelance talent at your fingertips
              </h2>
              <div className="space-y-6 mt-8">
                {features.map((feature) => (
                  <div key={feature.title} className="flex">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-4 mt-1">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_700,dpr_1.0/v1/attachments/generic_asset/asset/089e3bb9352f90802ad07ad9f6a4a450-1599517407052/selling-702x792.png"
                alt="Freelancer"
                className="rounded-xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 animate-bounce">
                <div className="flex items-center">
                  <FiPlay className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Watch how it works</p>
                    <p className="text-sm text-gray-500">2 min video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Popular Services
          </h2>
          {isLoading ? (
            <Loading />
          ) : popularGigs && popularGigs.length > 0 ? (
            <Slider {...sliderSettings}>
              {popularGigs.map((gig) => (
                <div key={gig._id} className="px-2">
                  <GigCard gig={gig} />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No gigs available yet.</p>
              <Link
                to="/gigs"
                className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Browse All Services
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-slate-700 rounded-xl p-6"
              >
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Find the talent needed to get your business growing.
          </h2>
          <Link
            to="/gigs"
            className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
