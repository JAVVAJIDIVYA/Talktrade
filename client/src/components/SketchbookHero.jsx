import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SketchbookHero.css";

/* ─────────────────────────────────────────────────────────────
   SERVICE DATA
   Swap name / emoji / color / path / desc / price / images[]
   ───────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 1,
    name: "Graphics & Design",
    emoji: "🎨",
    color: "#2563EB",
    bg: "linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)",
    path: "/gigs?category=design",
    desc: "Logos, brand identities, illustrations & print layouts crafted by top designers.",
    price: "Starting at $5",
    images: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&h=130&fit=crop",
    ],
  },
  {
    id: 2,
    name: "Writing & Translation",
    emoji: "✍️",
    color: "#7C3AED",
    bg: "linear-gradient(135deg,#F5F3FF 0%,#EDE9FE 100%)",
    path: "/gigs?category=writing",
    desc: "Blog posts, SEO copy, proofreading & 50+ language translations.",
    price: "Starting at $10",
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=200&h=130&fit=crop",
    ],
  },
  {
    id: 3,
    name: "Video & Animation",
    emoji: "🎬",
    color: "#DC2626",
    bg: "linear-gradient(135deg,#FEF2F2 0%,#FEE2E2 100%)",
    path: "/gigs?category=video",
    desc: "Explainer videos, motion graphics, reels & professional editing.",
    price: "Starting at $20",
    images: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1536240478700-b869ad10e2ba?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=200&h=130&fit=crop",
    ],
  },
  {
    id: 4,
    name: "Programming & Tech",
    emoji: "💻",
    color: "#059669",
    bg: "linear-gradient(135deg,#ECFDF5 0%,#D1FAE5 100%)",
    path: "/gigs?category=programming",
    desc: "Web apps, mobile apps, APIs, automation & full-stack solutions.",
    price: "Starting at $30",
    images: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=200&h=130&fit=crop",
    ],
  },
  {
    id: 5,
    name: "Digital Marketing",
    emoji: "📈",
    color: "#D97706",
    bg: "linear-gradient(135deg,#FFFBEB 0%,#FEF3C7 100%)",
    path: "/gigs?category=marketing",
    desc: "SEO, social media management, PPC ads & growth hacking strategies.",
    price: "Starting at $15",
    images: [
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=200&h=130&fit=crop",
    ],
  },
  {
    id: 6,
    name: "Music & Audio",
    emoji: "🎵",
    color: "#0891B2",
    bg: "linear-gradient(135deg,#ECFEFF 0%,#CFFAFE 100%)",
    path: "/gigs?category=music",
    desc: "Voice-overs, jingles, podcast editing, mixing & mastering.",
    price: "Starting at $10",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&h=130&fit=crop",
    ],
  },
  {
    id: 7,
    name: "Business",
    emoji: "💼",
    color: "#4338CA",
    bg: "linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 100%)",
    path: "/gigs?category=business",
    desc: "Business plans, financial modeling, consulting & virtual assistance.",
    price: "Starting at $25",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=130&fit=crop",
    ],
  },
  {
    id: 8,
    name: "AI Services",
    emoji: "🤖",
    color: "#BE185D",
    bg: "linear-gradient(135deg,#FDF2F8 0%,#FCE7F3 100%)",
    path: "/gigs?category=ai",
    desc: "AI prompts, chatbot builds, image generation & model fine-tuning.",
    price: "Starting at $20",
    images: [
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1676299081847-824916de030a?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?w=200&h=130&fit=crop",
    ],
  },
  {
    id: 9,
    name: "Photography",
    emoji: "📷",
    color: "#16A34A",
    bg: "linear-gradient(135deg,#F0FDF4 0%,#DCFCE7 100%)",
    path: "/gigs?category=photography",
    desc: "Product photography, retouching, photo editing & stock images.",
    price: "Starting at $15",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=130&fit=crop",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=130&fit=crop",
    ],
  },
];

/* ─── Page face content ─────────────────────────── */
function PageFace({ service, num, total }) {
  return (
    <div className="pf-root" style={{ background: service.bg }}>
      {/* top bar */}
      <div className="pf-topbar">
        <span className="pf-pg">{String(num).padStart(2, "0")}&thinsp;/&thinsp;{String(total).padStart(2, "0")}</span>
        <span className="pf-tag" style={{ background: service.color }}>TalkTrade</span>
      </div>

      {/* service hero row */}
      <div className="pf-hero-row">
        <span className="pf-emoji" style={{ textShadow: `0 8px 24px ${service.color}55` }}>
          {service.emoji}
        </span>
        <div className="pf-title-block">
          <h3 className="pf-title" style={{ color: service.color }}>{service.name}</h3>
          <span className="pf-price" style={{ background: service.color }}>{service.price}</span>
        </div>
      </div>

      {/* desc */}
      <p className="pf-desc">{service.desc}</p>

      {/* image strip */}
      <div className="pf-imgs">
        {service.images.map((src, i) => (
          <img key={i} src={src} alt={`${service.name} sample ${i + 1}`} className="pf-img" loading="lazy" />
        ))}
      </div>

      {/* tap hint */}
      <p className="pf-hint">Tap center · swipe to flip</p>

      {/* corner curl */}
      <div className="pf-curl" style={{ "--ccolor": service.color }} />
    </div>
  );
}

/* ─── Detail modal ──────────────────────────────── */
function DetailModal({ service, onClose, onGo }) {
  // Close on Escape
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="dm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`${service.name} details`}
    >
      <div className="dm-card" style={{ "--c": service.color, background: service.bg }}>
        <button className="dm-close" onClick={onClose} aria-label="Close">✕</button>

        <span className="dm-emoji">{service.emoji}</span>
        <h2 className="dm-name" style={{ color: service.color }}>{service.name}</h2>
        <span className="dm-price" style={{ background: service.color }}>{service.price}</span>
        <p className="dm-desc">{service.desc}</p>

        <div className="dm-imgs">
          {service.images.map((src, i) => (
            <img key={i} src={src} alt="" className="dm-img" />
          ))}
        </div>

        <button className="dm-cta" style={{ background: service.color }} onClick={onGo}>
          Browse {service.name} →
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────── */
export default function SketchbookHero() {
  const navigate = useNavigate();
  const TOTAL = SERVICES.length;

  const [current, setCurrent]     = useState(0);
  const [backIdx, setBackIdx]     = useState(1);
  const [flipCls, setFlipCls]     = useState("");   // "flip-fwd" | "flip-bwd" | ""
  const [flipping, setFlipping]   = useState(false);
  const [zoom, setZoom]           = useState(1);
  const [detailSvc, setDetailSvc] = useState(null);

  const touchX   = useRef(null);
  const touchT   = useRef(null);

  /* ── flip engine ── */
  const doFlip = useCallback(
    (dir) => {
      if (flipping) return;
      const next = dir === "fwd"
        ? (current + 1) % TOTAL
        : (current - 1 + TOTAL) % TOTAL;
      if (next === current) return;

      // pre-load back face content
      setBackIdx(next);
      setFlipping(true);
      setFlipCls(`flip-${dir}`);

      setTimeout(() => {
        setCurrent(next);
        setBackIdx((next + 1) % TOTAL);
        setFlipCls("");
        setFlipping(false);
      }, 750);
    },
    [flipping, current, TOTAL]
  );

  /* ── click-on-page ── */
  const handlePageClick = useCallback(
    (e) => {
      if (flipping) return;
      const { left, width } = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - left) / width;
      if (ratio > 0.60) doFlip("fwd");
      else if (ratio < 0.40) doFlip("bwd");
      else setDetailSvc(SERVICES[current]);
    },
    [flipping, current, doFlip]
  );

  /* ── swipe / tap ── */
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
    touchT.current = Date.now();
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    const dt = Date.now() - touchT.current;
    if (Math.abs(dx) > 35 && dt < 500) doFlip(dx < 0 ? "fwd" : "bwd");
    else if (Math.abs(dx) < 10 && dt < 250) setDetailSvc(SERVICES[current]);
    touchX.current = null;
  };

  /* ── keyboard ── */
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight") doFlip("fwd");
      if (e.key === "ArrowLeft")  doFlip("bwd");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [doFlip]);

  const svc  = SERVICES[current];
  const back = SERVICES[backIdx];

  return (
    <section className="sb-hero" aria-label="Service categories">
      {/* ambient orbs */}
      <div className="sb-orb sb-orb1" style={{ background: svc.color }} />
      <div className="sb-orb sb-orb2" />

      <div className="sb-layout">
        {/* ── Left copy ── */}
        <div className="sb-copy">
          <p className="sb-eyebrow">✦ {TOTAL} Categories</p>
          <h1 className="sb-h1">
            Your work,
            <br />
            <span className="sb-grad" style={{ "--a": svc.color }}>
              expertly delivered.
            </span>
          </h1>
          <p className="sb-sub">
            Tap the page to flip, swipe on mobile, or press ← →.
            <br />
            Tap the centre to see details.
          </p>

          {/* current service indicator */}
          <div className="sb-active-row">
            <span className="sb-active-num" style={{ color: svc.color }}>
              {String(current + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="sb-active-label">Now viewing</p>
              <p className="sb-active-name" style={{ color: svc.color }}>{svc.name}</p>
            </div>
          </div>

          {/* dots */}
          <div className="sb-dots" role="tablist" aria-label="Service pages">
            {SERVICES.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === current}
                aria-label={s.name}
                className={`sb-dot ${i === current ? "sb-dot-active" : ""}`}
                style={i === current ? { background: s.color, boxShadow: `0 0 0 3px ${s.color}44` } : {}}
                onClick={() => {
                  if (flipping || i === current) return;
                  const dir = i > current ? "fwd" : "bwd";
                  setBackIdx(i);
                  setFlipping(true);
                  setFlipCls(`flip-${dir}`);
                  setTimeout(() => {
                    setCurrent(i);
                    setBackIdx((i + 1) % TOTAL);
                    setFlipCls("");
                    setFlipping(false);
                  }, 750);
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Right: 3D Book ── */}
        <div className="sb-book-col">
          {/* zoom bar */}
          <div className="sb-zoom">
            <button className="sb-zb" onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))} aria-label="Zoom in">+</button>
            <span className="sb-zl">{Math.round(zoom * 100)}%</span>
            <button className="sb-zb" onClick={() => setZoom((z) => Math.max(z - 0.1, 0.6))} aria-label="Zoom out">−</button>
          </div>

          {/* scene */}
          <div className="sb-scene-wrap" style={{ transform: `scale(${zoom})` }}>
            <div className={`sb-book ${flipping ? "sb-book-flip" : ""}`}>

              {/* ── 3-D spine (left face) ── */}
              <div className="sb-spine" style={{ background: svc.color }}>
                <span className="sb-spine-txt">TALK TRADE</span>
              </div>

              {/* ── page stack (right edge depth) ── */}
              {[5, 4, 3, 2, 1].map((n) => (
                <div
                  key={n}
                  className="sb-stack-leaf"
                  style={{ transform: `translateZ(${-n * 3}px) translateX(${n * 1.5}px)` }}
                />
              ))}

              {/* ── ground shadow ── */}
              <div className="sb-shadow" />

              {/* ── THE FLIPPING PAGE ── */}
              <div
                className={`sb-flipper ${flipCls}`}
                onClick={handlePageClick}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                role="button"
                tabIndex={0}
                aria-label={`${svc.name}. Tap right half to go forward, left half to go back, centre for details.`}
                onKeyDown={(e) => e.key === "Enter" && setDetailSvc(svc)}
              >
                {/* Front face */}
                <div className="sb-face sb-front">
                  <PageFace service={svc} num={current + 1} total={TOTAL} />
                  {/* edge tap zones (visible on hover) */}
                  <div className="sb-zone-l" aria-hidden="true">‹</div>
                  <div className="sb-zone-r" aria-hidden="true">›</div>
                </div>

                {/* Back face */}
                <div className="sb-face sb-back">
                  <PageFace service={back} num={backIdx + 1} total={TOTAL} />
                </div>
              </div>
            </div>
          </div>

          <p className="sb-flip-hint" aria-hidden="true">
            ← tap page edge to flip · tap centre for details →
          </p>
        </div>
      </div>

      {/* ── Detail modal ── */}
      {detailSvc && (
        <DetailModal
          service={detailSvc}
          onClose={() => setDetailSvc(null)}
          onGo={() => { navigate(detailSvc.path); setDetailSvc(null); }}
        />
      )}
    </section>
  );
}
