import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, BarChart3, FlaskConical, LineChart, Home as HomeIcon, Menu, X } from 'lucide-react';

const Navbar = ({ isHome = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { name: 'Home',                      path: '/',           icon: <HomeIcon     className="w-[18px] h-[18px]" /> },
    { name: 'Disease Detection',         path: '/disease',    icon: <FlaskConical className="w-[18px] h-[18px]" /> },
    { name: 'Yield Prediction',          path: '/yield',      icon: <BarChart3    className="w-[18px] h-[18px]" /> },
    { name: 'Fertilizer Recommendation', path: '/fertilizer', icon: <FlaskConical className="w-[18px] h-[18px]" /> },
    { name: 'Insights',                  path: '/insights',   icon: <LineChart    className="w-[18px] h-[18px]" /> },
  ];

  const linkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-all duration-150 rounded-md ${
      isActive
        ? 'text-emerald-700 border-b-2 border-emerald-600'
        : 'text-gray-700 hover:text-emerald-700 border-b-2 border-transparent'
    }`;

  const navBase = isHome
    ? `fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1280px] rounded-2xl border border-gray-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 ${
        scrolled ? 'bg-white/98 shadow-lg' : 'bg-white/92'
      } backdrop-blur-sm`
    : 'sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100';

  return (
    <>
      <nav className={navBase}>
        <div className="px-5 lg:px-7">
          <div className="flex justify-between items-center h-[68px]">

            {/* Brand */}
            <NavLink to="/" className="flex items-center gap-3 group select-none shrink-0">
              <div className="bg-emerald-700 text-white rounded-xl p-2 shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="block text-xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Smart Agri
                </span>
                <span className="block text-[9px] font-bold text-emerald-700 tracking-[0.18em] uppercase mt-0.5">
                  See. Predict. Grow.
                </span>
              </div>
            </NavLink>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 h-full">
              {navItems.map((item) => (
                <NavLink key={item.name} to={item.path} className={linkClass} end={item.path === '/'}>
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/98 border-t border-gray-100 px-4 pb-4 pt-2 space-y-1 rounded-b-2xl">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-700'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Spacer: only for non-home pages where navbar is sticky */}
      {!isHome && <div className="h-0" />}
    </>
  );
};

export default Navbar;
