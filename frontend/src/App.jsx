import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DiseaseDetection from './components/DiseaseDetection';
import YieldPrediction from './components/YieldPrediction';
import FertilizerOptimizer from './components/FertilizerOptimizer';
import ShapInsights from './components/ShapInsights';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/disease" element={<DiseaseDetection />} />
            <Route path="/yield" element={<YieldPrediction />} />
            <Route path="/fertilizer" element={<FertilizerOptimizer />} />
            <Route path="/insights" element={<ShapInsights />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
