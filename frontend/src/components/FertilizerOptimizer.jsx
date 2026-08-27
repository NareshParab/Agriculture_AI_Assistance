import React, { useState, useEffect } from 'react';
import { getFertilizerCrops, recommendFertilizer } from '../api';
import { FlaskConical, TrendingDown, TrendingUp, CheckCircle2, Leaf } from 'lucide-react';

// ─── Status configuration ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  LOW: {
    bg       : 'bg-amber-50',
    border   : 'border-amber-200',
    badge    : 'bg-amber-100 text-amber-800',
    icon     : TrendingUp,
    iconColor: 'text-amber-500',
    label    : 'LOW',
    textColor: 'text-amber-700',
    barColor : 'bg-amber-400',
  },
  HIGH: {
    bg       : 'bg-red-50',
    border   : 'border-red-200',
    badge    : 'bg-red-100 text-red-800',
    icon     : TrendingDown,
    iconColor: 'text-red-500',
    label    : 'HIGH',
    textColor: 'text-red-700',
    barColor : 'bg-red-400',
  },
  GOOD: {
    bg       : 'bg-emerald-50',
    border   : 'border-emerald-200',
    badge    : 'bg-emerald-100 text-emerald-800',
    icon     : CheckCircle2,
    iconColor: 'text-emerald-500',
    label    : 'OPTIMAL',
    textColor: 'text-emerald-700',
    barColor : 'bg-emerald-400',
  },
};

// ─── Nutrient full names ────────────────────────────────────────────────────
const NUTRIENT_LABEL = { N: 'Nitrogen (N)', P: 'Phosphorus (P)', K: 'Potassium (K)' };
const NUTRIENT_COLOR = {
  N: { accent: 'text-blue-600',   dot: 'bg-blue-500'  },
  P: { accent: 'text-purple-600', dot: 'bg-purple-500' },
  K: { accent: 'text-orange-600', dot: 'bg-orange-500' },
};

// ─── Range bar visualisation ────────────────────────────────────────────────
function RangeBar({ current, min, max }) {
  // Extend view window 20% beyond min/max so the bar doesn't clip
  const viewMin  = Math.max(0, min - (max - min) * 0.3);
  const viewMax  = max + (max - min) * 0.3;
  const span     = viewMax - viewMin || 1;

  const toPercent = (v) => Math.min(100, Math.max(0, ((v - viewMin) / span) * 100));

  const rangeLeft  = toPercent(min);
  const rangeWidth = toPercent(max) - rangeLeft;
  const pinLeft    = toPercent(current);

  return (
    <div className="relative h-4 rounded-full bg-gray-200 overflow-visible mt-3 mb-1">
      {/* Green "safe zone" band */}
      <div
        className="absolute top-0 h-full rounded-full bg-emerald-200 opacity-70"
        style={{ left: `${rangeLeft}%`, width: `${rangeWidth}%` }}
      />
      {/* Current value pin */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 border-2 border-white shadow z-10 transition-all"
        style={{ left: `${pinLeft}%` }}
        title={`Current: ${current}`}
      />
    </div>
  );
}

// ─── Single nutrient card ───────────────────────────────────────────────────
function NutrientCard({ nutrient, data }) {
  const cfg    = STATUS_CONFIG[data.status];
  const nColor = NUTRIENT_COLOR[nutrient];
  const Icon   = cfg.icon;

  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${cfg.bg} ${cfg.border}`}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${nColor.dot}`} />
          <span className={`font-semibold text-sm ${nColor.accent}`}>
            {NUTRIENT_LABEL[nutrient]}
          </span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>

      {/* Current value */}
      <div className="flex items-end gap-1.5">
        <span className="text-4xl font-extrabold text-gray-900">{data.current}</span>
        <span className="text-sm text-gray-400 mb-1">kg/ha</span>
        <Icon className={`w-5 h-5 mb-1.5 ml-auto ${cfg.iconColor}`} />
      </div>

      {/* Range bar */}
      <RangeBar current={data.current} min={data.range_min} max={data.range_max} />

      {/* Range labels */}
      <div className="flex justify-between text-xs text-gray-400 -mt-1">
        <span>Min {data.range_min}</span>
        <span className="text-gray-500 font-medium">Recommended range</span>
        <span>Max {data.range_max}</span>
      </div>

      {/* Action advice */}
      <p className={`text-sm font-medium leading-snug ${cfg.textColor}`}>
        {cfg.label === 'OPTIMAL'
          ? 'Within the recommended range. No change needed.'
          : data.action}
      </p>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
const FertilizerOptimizer = () => {
  const [crops,    setCrops]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);

  const [formData, setFormData] = useState({
    crop: '',
    N   : '',
    P   : '',
    K   : '',
  });

  // Load soil-dataset crops on mount
  useEffect(() => {
    getFertilizerCrops()
      .then(({ crops: list }) => {
        setCrops(list);
        if (list.length > 0) setFormData(prev => ({ ...prev, crop: list[0] }));
      })
      .catch(() => setError('Could not load crop list. Please refresh.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'crop' ? value : value === '' ? '' : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate inputs
    if (formData.N === '' || formData.P === '' || formData.K === '') {
      setError('Please enter values for Nitrogen, Phosphorus, and Potassium.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await recommendFertilizer({
        crop: formData.crop,
        N   : Number(formData.N),
        P   : Number(formData.P),
        K   : Number(formData.K),
      });
      setResult(data);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Recommendation failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Summary counts
  const counts = result
    ? ['N', 'P', 'K'].reduce(
        (acc, n) => ({ ...acc, [result[n].status]: (acc[result[n].status] || 0) + 1 }),
        {}
      )
    : {};

  return (
    <div className="max-w-4xl mx-auto">

      {/* Page header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
          <Leaf className="w-4 h-4" />
          Soil-data based · No ML estimation
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Fertilizer Advisor</h2>
        <p className="mt-2 text-slate-800 font-medium max-w-xl mx-auto">
          Compare your current soil nutrients against the scientifically observed ranges
          for your crop derived from real field data.
        </p>
      </div>

      {/* Input card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Crop selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Crop
            </label>
            <select
              id="fert-crop"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none bg-gray-50"
            >
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* NPK inputs */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'N', label: 'Nitrogen (N)',    placeholder: 'e.g. 60', color: 'focus:ring-blue-400   focus:border-blue-400'   },
              { key: 'P', label: 'Phosphorus (P)',  placeholder: 'e.g. 45', color: 'focus:ring-purple-400 focus:border-purple-400' },
              { key: 'K', label: 'Potassium (K)',   placeholder: 'e.g. 20', color: 'focus:ring-orange-400 focus:border-orange-400' },
            ].map(({ key, label, placeholder, color }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {label}
                  <span className="text-gray-400 font-normal ml-1">(kg/ha)</span>
                </label>
                <input
                  id={`fert-${key.toLowerCase()}`}
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  min="0"
                  className={`w-full p-3 border border-gray-300 rounded-xl text-gray-800 outline-none bg-gray-50 focus:ring-2 ${color}`}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            id="fert-submit"
            type="submit"
            disabled={loading || crops.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? (
              <span className="animate-pulse">Analysing…</span>
            ) : (
              <>
                <FlaskConical className="w-4 h-4" />
                Get Recommendation
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in-up">

          {/* Summary banner */}
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Crop</p>
              <p className="text-lg font-bold text-gray-900">{result.crop}</p>
            </div>
            <div className="flex gap-3">
              {counts.GOOD  > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> {counts.GOOD} Optimal
                </span>
              )}
              {counts.LOW   > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" /> {counts.LOW} Low
                </span>
              )}
              {counts.HIGH  > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  <TrendingDown className="w-4 h-4" /> {counts.HIGH} High
                </span>
              )}
            </div>
          </div>

          {/* Three nutrient cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['N', 'P', 'K'].map(n => (
              <NutrientCard key={n} nutrient={n} data={result[n]} />
            ))}
          </div>

          {/* Data source note */}
          <p className="text-center text-xs text-gray-400">
            Recommended ranges derived from <strong>cleaned_soil.csv</strong> — real field sensor measurements across 100 samples per crop.
          </p>
        </div>
      )}

      {/* Supported Crops Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Supported Crop Categories</h3>
          <p className="mt-2 text-slate-800 font-medium">Fertilizer recommendations are currently available for the following crop categories.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {['Banana', 'Blackgram', 'Chickpea', 'Coconut', 'Coffee', 'Cotton', 'Jute', 'Kidneybeans', 'Lentil', 'Maize', 'Mango', 'Mothbeans', 'Mungbean', 'Muskmelon', 'Orange', 'Papaya', 'Pigeonpeas', 'Pomegranate', 'Rice', 'Watermelon'].map((crop) => (
            <span key={crop} className="px-4 py-2 bg-brand-50 text-brand-700 font-medium rounded-full text-sm border border-brand-100 shadow-sm">
              {crop}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FertilizerOptimizer;
