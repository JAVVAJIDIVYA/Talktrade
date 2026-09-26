import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight, FiStar, FiZap, FiShield } from "react-icons/fi";

const CATEGORIES = [
  { name: "Design", emoji: "🎨", path: "Graphics & Design" },
  { name: "Marketing", emoji: "📈", path: "Digital Marketing" },
  { name: "Writing", emoji: "✍️", path: "Writing & Translation" },
  { name: "Video", emoji: "🎬", path: "Video & Animation" },
  { name: "Tech", emoji: "💻", path: "Programming & Tech" },
  { name: "Business", emoji: "💼", path: "Business" },
  { name: "Music", emoji: "🎵", path: "Music & Audio" },
  { name: "AI", emoji: "🤖", path: "AI Services" },
];

const STATS = [
  { value: "500+", label: "Expert Freelancers" },
  { value: "1,200+", label: "Projects Delivered" },
  { value: "4.9★", label: "Average Rating" },
  { value: "24/7", label: "Support Available" },
];

const VantaHero = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadVanta = async () => {
      try {
        const THREE = await import("three");
        const VANTA = await import("vanta/dist/vanta.net.min");
        if (!mounted || !vantaRef.current) return;

        vantaEffect.current = VANTA.default({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xF97316,       // orange
          backgroundColor: 0x0F0D14, // dark
          points: 12,
          maxDistance: 22,
          spacing: 18,
        });
      } catch (e) {
        console.warn("Vanta failed to load:", e);
      }
    };

    loadVanta();

    return () => {
      mounted = false;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/gigs?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section
      ref={vantaRef}
      style={{ background: "#0F0D14", minHeight: "100vh", position: "relative" }}
      className="flex flex-col"
    >
      {/* Gradient overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(15,13,20,0.85) 0%, rgba(249,115,22,0.08) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 pt-32 pb-16 text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: "rgba(249,115,22,0.15)",
            border: "1px solid rgba(249,115,22,0.3)",
            color: "#F97316",
          }}
        >
          <FiZap size={14} />
          India's Premier Freelance Marketplace
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold mb-6 leading-tight"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            color: "#FAFAF9",
            maxWidth: 780,
          }}
        >
          Find Expert Freelancers,{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #F97316, #EAB308)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Deliver Great Work
          </span>
        </h1>

        <p
          className="mb-10 text-lg"
          style={{ color: "#A8A29E", maxWidth: 520 }}
        >
          Connect with skilled professionals across design, tech, marketing and more — trusted by thousands of businesses.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-xl gap-0 mb-12 rounded-xl overflow-hidden shadow-2xl"
          style={{ border: "1.5px solid rgba(249,115,22,0.35)" }}
        >
          <div className="flex-1 flex items-center gap-3 px-4" style={{ background: "#1A1825" }}>
            <FiSearch style={{ color: "#78716C", flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Try "Logo Design", "React Developer"...'
              className="flex-1 py-4 bg-transparent outline-none text-sm"
              style={{ color: "#FAFAF9" }}
            />
          </div>
          <button
            type="submit"
            className="px-6 font-semibold text-white flex items-center gap-2 text-sm"
            style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
          >
            Search <FiArrowRight size={16} />
          </button>
        </form>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/gigs?category=${encodeURIComponent(cat.path)}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#D6D3D1",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(249,115,22,0.18)";
                e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)";
                e.currentTarget.style.color = "#F97316";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "#D6D3D1";
              }}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl font-bold font-display"
                style={{ color: "#F97316" }}
              >
                {s.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "#78716C" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges at bottom */}
      <div
        className="relative z-10 flex justify-center gap-6 pb-8 flex-wrap"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}
      >
        {[
          { icon: <FiShield size={14} />, text: "Verified Freelancers" },
          { icon: <FiStar size={14} />, text: "Quality Guaranteed" },
          { icon: <FiZap size={14} />, text: "Fast Delivery" },
        ].map((b) => (
          <div
            key={b.text}
            className="flex items-center gap-2 text-sm"
            style={{ color: "#78716C" }}
          >
            <span style={{ color: "#F97316" }}>{b.icon}</span>
            {b.text}
          </div>
        ))}
      </div>
    </section>
  );
};

export default VantaHero;
