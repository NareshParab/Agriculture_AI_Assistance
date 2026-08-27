import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DiseaseDetection from './components/DiseaseDetection';
import YieldPrediction from './components/YieldPrediction';
import FertilizerOptimizer from './components/FertilizerOptimizer';
import ShapInsights from './components/ShapInsights';
import heroImg from './assets/agri-hero.jpg';

/* Inner wrapper so we can read the current route */
function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="relative min-h-screen font-sans">

      {/* ── Global farm background — fixed so it stays on every page ── */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      {/* Soft overlay for inner pages: improved visibility with slight blur for readability */}
      {!isHome && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white/80 via-white/50 to-white/70 backdrop-blur-[2px]" />
      )}

      <Navbar isHome={isHome} />

      {isHome ? (
        /* Home page: full-bleed, no container */
        <Home />
      ) : (
        /* All other pages: normal padded container */
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/disease"    element={<DiseaseDetection />} />
            <Route path="/yield"      element={<YieldPrediction />} />
            <Route path="/fertilizer" element={<FertilizerOptimizer />} />
            <Route path="/insights"   element={<ShapInsights />} />
          </Routes>
        </main>
      )}
      {/* Keep the home route inside Routes for React Router matching */}
      {isHome && (
        <Routes>
          <Route path="/" element={null} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </Router>
  );
}

export default App;
