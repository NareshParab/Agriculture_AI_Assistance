import React, { useState, useEffect } from 'react';
import { getMetadata, predictYield } from '../api';
import { TrendingUp, Activity, CloudRain, Thermometer, MapPin, Wheat } from 'lucide-react';

const YieldPrediction = () => {
  const [metadata, setMetadata] = useState({ crops: [], areas: [] });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    crop: '',
    area: '',
    year: 2024,
    rainfall: 1000,
    temp: 25,
    N: 50,
    P: 50,
    K: 50,
    ph: 6.5,
    humidity: 70,
    pesticides: 10
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
      const data = await predictYield(formData);
      setResult(data);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to predict yield. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Crop Yield Prediction</h2>
        <p className="mt-2 text-gray-600">Forecast your agricultural output based on environmental and soil factors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Location & Crop */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-500" /> Location & Crop
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <select name="area" value={formData.area} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500">
                    {metadata.areas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                  <select name="crop" value={formData.crop} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500">
                    {metadata.crops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="range" name="year" min="1990" max="2030" value={formData.year} onChange={handleChange} className="w-full" />
                  <div className="text-right text-sm text-gray-500">{formData.year}</div>
                </div>
              </div>

              {/* Climate */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-blue-500" /> Climate Conditions
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm/year)</label>
                  <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avg Temperature (°C)</label>
                  <input type="number" name="temp" value={formData.temp} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                </div>
              </div>

              {/* Soil */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" /> Soil Nutrition (NPK)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N</label>
                    <input type="number" name="N" value={formData.N} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">P</label>
                    <input type="number" name="P" value={formData.P} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">K</label>
                    <input type="number" name="K" value={formData.K} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Other inputs */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-yellow-500" /> Additional Factors
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soil pH ({formData.ph})</label>
                    <input type="range" name="ph" min="3.0" max="9.0" step="0.1" value={formData.ph} onChange={handleChange} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Humidity ({formData.humidity}%)</label>
                    <input type="range" name="humidity" min="0" max="100" value={formData.humidity} onChange={handleChange} className="w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pesticides (tonnes)</label>
                  <input type="number" name="pesticides" value={formData.pesticides} onChange={handleChange} step="0.1" className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

            </div>
            
            <div className="pt-4 border-t">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-600 text-white py-3 rounded-xl hover:bg-brand-700 font-semibold transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? 'Predicting...' : 'Predict Yield'}
                {!loading && <TrendingUp className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Prediction Result</h3>
          
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {!result && !error && (
            <div className="text-center text-gray-400">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Fill in the parameters and click predict to see your expected yield.</p>
            </div>
          )}

          {result && (
            <div className="text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wheat className="w-12 h-12 text-brand-600" />
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Estimated Yield</div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2">
                {result.predicted_yield_hg_ha.toLocaleString('en-US', {maximumFractionDigits:0})}
              </div>
              <div className="text-lg text-gray-600 mb-8">hg/ha</div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Equivalent to</div>
                <div className="text-xl font-bold text-gray-800">{result.predicted_yield_tonnes_ha.toFixed(4)} <span className="text-base font-normal">tonnes/hectare</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;
