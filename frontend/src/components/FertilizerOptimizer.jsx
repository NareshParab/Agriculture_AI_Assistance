import React, { useState, useEffect } from 'react';
import { getMetadata, optimizeFertilizer } from '../api';
import { Droplets, ArrowRight, Zap, Target } from 'lucide-react';

const FertilizerOptimizer = () => {
  const [metadata, setMetadata] = useState({ crops: [], areas: [] });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    crop: '',
    area: '',
    N: 40,
    P: 40,
    K: 40
  });

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const data = await getMetadata();
        setMetadata(data);
        if (data.crops.length > 0 && data.areas.length > 0) {
          setFormData(prev => ({ ...prev, crop: data.crops[0], area: data.areas[0] }));
        }
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    };
    fetchMeta();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'crop' || name === 'area' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await optimizeFertilizer(formData);
      setResult(data);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Optimization failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Fertilizer Optimizer</h2>
        <p className="mt-2 text-gray-600">Discover the exact NPK ratios needed to maximize your crop yield.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select name="area" value={formData.area} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
              {metadata.areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
            <select name="crop" value={formData.crop} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
              {metadata.crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current N</label>
              <input type="number" name="N" value={formData.N} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current P</label>
              <input type="number" name="P" value={formData.P} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current K</label>
              <input type="number" name="K" value={formData.K} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div className="md:col-span-1">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 font-semibold transition-colors disabled:opacity-70 flex justify-center items-center gap-2 h-[42px]"
            >
              {loading ? 'Optimizing...' : 'Optimize'}
              {!loading && <Zap className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="text-red-500 text-center mb-8">{error}</div>}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* NPK Recommendations */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center">
              <div className="text-blue-500 font-bold mb-1">Nitrogen (N)</div>
              <div className="text-4xl font-extrabold text-blue-900 mb-2">{result.optimal_N}</div>
              <div className="text-sm font-medium text-blue-600 flex items-center gap-1">
                {result.delta_N > 0 ? '+' : ''}{result.delta_N} from current
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex flex-col items-center">
              <div className="text-purple-500 font-bold mb-1">Phosphorus (P)</div>
              <div className="text-4xl font-extrabold text-purple-900 mb-2">{result.optimal_P}</div>
              <div className="text-sm font-medium text-purple-600 flex items-center gap-1">
                {result.delta_P > 0 ? '+' : ''}{result.delta_P} from current
              </div>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center">
              <div className="text-orange-500 font-bold mb-1">Potassium (K)</div>
              <div className="text-4xl font-extrabold text-orange-900 mb-2">{result.optimal_K}</div>
              <div className="text-sm font-medium text-orange-600 flex items-center gap-1">
                {result.delta_K > 0 ? '+' : ''}{result.delta_K} from current
              </div>
            </div>
          </div>

          {/* Yield Impact */}
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-6 rounded-2xl shadow-md text-white flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-brand-100" />
              <h3 className="text-lg font-semibold text-brand-50">Impact Analysis</h3>
            </div>
            
            <div className="flex justify-between items-end mb-4 border-b border-brand-400 pb-4">
              <div>
                <div className="text-brand-200 text-sm mb-1">Baseline Yield</div>
                <div className="text-xl font-medium">{result.baseline_yield.toLocaleString()}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-300 mb-1" />
              <div className="text-right">
                <div className="text-brand-200 text-sm mb-1">Maximized Yield</div>
                <div className="text-3xl font-bold text-white">{result.predicted_yield.toLocaleString()}</div>
              </div>
            </div>

            <div>
              <div className="text-brand-100 text-sm mb-1">Potential Improvement</div>
              <div className="text-2xl font-bold text-yellow-300">
                +{result.improvement_hgha.toLocaleString()} hg/ha
                <span className="text-lg text-brand-200 ml-2">({result.improvement_pct}%)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerOptimizer;
