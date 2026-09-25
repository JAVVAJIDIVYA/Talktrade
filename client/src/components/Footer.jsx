import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
} from "react-icons/fi";

const Footer = () => {
  const categories = [
    "Graphics & Design",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Business",
    "Lifestyle",
  ];

  const about = [
    "About Fiverr",
    "Careers",
    "Press & News",
    "Partnerships",
    "Privacy Policy",
    "Terms of Service",
  ];

  const support = [
    "Help & Support",
    "Trust & Safety",
    "Selling on Fiverr",
    "Buying on Fiverr",
  ];

  const community = [
    "Events",
    "Blog",
    "Forum",
    "Community Standards",
    "Podcast",
    "Affiliates",
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item}>
                  <Link
                    to={`/gigs?category=${item.toLowerCase().split(" ")[0]}`}
                    className="text-sm hover:text-primary transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {about.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-primary transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-primary transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {community.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-primary transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More From Fiverr */}
          <div>
            <h3 className="text-white font-semibold mb-4">More From Fiverr</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary transition">
                  Fiverr Business
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition">
                  Fiverr Pro
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition">
                  Fiverr Studios
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition">
                  Fiverr Logo Maker
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition">
                  Fiverr Guides
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-2xl font-bold text-white">
              Talk<span className="text-primary">Trade</span>
            </span>
            <span className="ml-4 text-sm">
              © Talk Trade {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-primary transition"
            >
              <FiFacebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary transition"
            >
              <FiTwitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary transition"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary transition"
            >
              <FiInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
