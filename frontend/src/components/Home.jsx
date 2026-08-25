import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ArrowRight, ShieldCheck, TrendingUp, Droplets, Lightbulb,
} from 'lucide-react';
import heroImg from '../assets/agri-hero.jpg';

/* ─── Botanical SVG decorations (matching reference card bottoms) ─────────── */
const BotanicalLeaves = () => (
  <svg viewBox="0 0 200 60" className="absolute bottom-0 left-0 right-0 w-full h-14 opacity-[0.18]" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
    <g fill="none" stroke="#15803d" strokeWidth="1.2">
      {/* Stem */}
      <path d="M20 60 Q30 40 45 30" />
      <path d="M45 30 Q52 20 44 10" />
      <path d="M45 30 Q58 22 62 12" />
      {/* Leaves left cluster */}
      <ellipse cx="44" cy="12" rx="7" ry="4" transform="rotate(-30 44 12)" />
      <ellipse cx="62" cy="13" rx="7" ry="4" transform="rotate(20 62 13)" />
      {/* Center plant */}
      <path d="M100 60 Q100 42 100 30" />
      <path d="M100 30 Q92 18 88 10" />
      <path d="M100 30 Q108 18 112 10" />
      <ellipse cx="88" cy="10" rx="8" ry="4" transform="rotate(-20 88 10)" />
      <ellipse cx="112" cy="10" rx="8" ry="4" transform="rotate(20 112 10)" />
      {/* Right cluster */}
      <path d="M160 60 Q155 42 150 30" />
      <path d="M150 30 Q142 20 138 12" />
      <path d="M150 30 Q160 22 166 14" />
      <ellipse cx="138" cy="12" rx="7" ry="4" transform="rotate(-30 138 12)" />
      <ellipse cx="166" cy="14" rx="7" ry="4" transform="rotate(20 166 14)" />
      {/* Grass blades */}
      <path d="M70 60 Q68 50 72 44" />
      <path d="M80 60 Q82 48 78 42" />
      <path d="M130 60 Q128 50 133 44" />
      <path d="M142 60 Q144 48 140 42" />
    </g>
  </svg>
);

/* ─── Card data ────────────────────────────────────────────────────────────── */
const cards = [
  {
    title: 'Disease Detection',
    description: 'Upload an image of a crop leaf and instantly identify diseases.',
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    path: '/disease',
  },
  {
    title: 'Yield Prediction',
    description: 'Forecast your harvest based on climate, soil, and agricultural inputs.',
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    path: '/yield',
  },
  {
    title: 'Fertilizer Recommendation',
    description: 'Discover the exact Nitrogen, Phosphorus, and Potassium levels your field needs based on your crop.',
    icon: <Droplets className="w-6 h-6 text-white" />,
    path: '/fertilizer',
  },
  {
    title: 'Insights',
    description: 'Understand the "why" behind the predictions. View SHAP insights that explain which features drive our AI models.',
    icon: <Lightbulb className="w-6 h-6 text-white" />,
    path: '/insights',
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
const Home = () => (
  /*
   * STRUCTURE (matching reference image exactly):
   *  ┌─────────────────────────────────────────────────────────────────┐
   *  │  [floating Navbar rendered by App.jsx/Navbar.jsx above]         │
   *  │                                                                 │
   *  │  HERO SECTION  (full viewport height)                           │
   *  │   ├─ Farm background image — full bleed, right side visible     │
   *  │   ├─ Left white-to-transparent gradient for text readability    │
   *  │   └─ Left-aligned content: badge → h1 → subtext → CTA button   │
   *  │                                                                 │
   *  │  BOTTOM CARD ROW  (overlapping hero bottom)                     │
   *  │   └─ 4 cream cards with green icon badges + botanical SVG       │
   *  └─────────────────────────────────────────────────────────────────┘
   */
  <div className="relative w-full overflow-x-hidden">

    {/* ── HERO ──────────────────────────────────────────────────────── */}
    <section
      className="relative w-full flex items-start"
      style={{ minHeight: '100svh' }}
    >
      {/* Background image — full bleed */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImg})` }}
      />

      {/*
       * Reduced gradients — image stays clearly visible across the full width.
       * Left side is lightened just enough for text readability, not washed out.
       */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#f3f4eb] to-transparent" />

      {/* Hero text content — left-aligned, matches reference proportions */}
      <div
        className="relative z-10 w-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24"
        style={{ paddingTop: '9rem', paddingBottom: '14rem' }}
      >
        <div className="max-w-[520px]">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-emerald-200 shadow-sm mb-7">
            <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-[11px] font-bold text-emerald-900 tracking-[0.13em] uppercase">
              Smart Farming in Harmony with Nature
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
            }}
          >
            Empowering Farmers<br />
            with <span className="text-emerald-700">Modern AI</span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-700 font-medium leading-relaxed mb-9" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)' }}>
            Detect diseases, predict yields, and get precise fertilizer
            recommendations instantly to maximize your harvest.
          </p>

          {/* CTA */}
          <Link
            to="/disease"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold text-[15px] transition-all shadow-[0_4px_18px_rgba(4,120,87,0.35)] hover:shadow-[0_6px_22px_rgba(4,120,87,0.45)] hover:-translate-y-0.5 active:translate-y-0 select-none"
          >
            <Leaf className="w-4 h-4" />
            Detect Crop Disease
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </section>

    {/* ── FEATURE CARDS ─────────────────────────────────────────────── */}
    {/*
     * Pulled up over the hero bottom with negative margin.
     * Cards sit on a warm cream section background (matching reference).
     */}
    <section
      className="relative z-20 w-full px-6 sm:px-10 lg:px-16 xl:px-24 pb-10"
      style={{ marginTop: '-7rem', background: 'linear-gradient(to bottom, transparent 0%, #f3f4eb 5rem)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            to={card.path}
            className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl no-underline"
            style={{
              background: '#f5f6e8',
              border: '1px solid rgba(180,200,170,0.5)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              minHeight: '190px',
            }}
          >
            {/* Top section: icon badge + title + description */}
            <div className="flex flex-col p-5 pb-3 flex-1">
              {/* Icon badge — dark green square, matching reference */}
              <div className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm shrink-0">
                {card.icon}
              </div>
              <h3 className="text-[15px] font-extrabold text-gray-900 mb-1.5 leading-snug">
                {card.title}
              </h3>
              <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                {card.description}
              </p>
            </div>

            {/* Botanical SVG illustration at bottom of each card */}
            <div className="relative h-14 mt-auto overflow-hidden">
              <BotanicalLeaves />
            </div>
          </Link>
        ))}
      </div>
    </section>

  </div>
);

export default Home;
