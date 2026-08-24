import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, BarChart3, FlaskConical, LineChart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Home',              path: '/',           icon: <Sprout      className="w-5 h-5" /> },
    { name: 'Disease Detection', path: '/disease',    icon: <FlaskConical className="w-5 h-5" /> },
    { name: 'Yield Prediction',  path: '/yield',      icon: <BarChart3   className="w-5 h-5" /> },
    { name: 'Fertilizer',        path: '/fertilizer', icon: <FlaskConical className="w-5 h-5" /> },
    { name: 'Insights',          path: '/insights',   icon: <LineChart   className="w-5 h-5" /> },
  ];

  const linkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 px-2 pt-1 border-b-2 text-base font-semibold transition-colors duration-150 ${
      isActive
        ? 'border-brand-500 text-brand-700'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-3 group select-none">
            <div className="bg-brand-600 text-white rounded-xl p-2 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-7 h-7" />
            </div>
            <div className="leading-tight">
              <span className="block text-2xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Smart Agri
              </span>
              <span className="block text-xs font-semibold text-brand-600 tracking-widest uppercase">
                See. Predict. Grow.
              </span>
            </div>
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden sm:flex sm:items-center sm:gap-1 h-full">
            {navItems.map((item) => (
              <NavLink key={item.name} to={item.path} className={linkClass}>
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
  );
};

export default Navbar;
