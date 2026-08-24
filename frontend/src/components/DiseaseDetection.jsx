import React, { useState } from 'react';
import { UploadCloud, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { predictDisease } from '../api';

const DiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await predictDisease(file);
      setResult(data);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to analyze image. Make sure the backend is running on port 8000.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Plant Disease Detection</h2>
        <p className="mt-2 text-gray-600">Upload a leaf image to instantly identify potential diseases.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          {preview ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <img src={preview} alt="Leaf preview" className="max-h-64 rounded-lg object-contain mb-6" />
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Reset
                </button>
                {!result && (
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    {loading ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors py-20">
              <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-gray-600 font-medium">Click to upload a leaf image</span>
              <span className="text-sm text-gray-400 mt-2">JPG, JPEG, PNG</span>
              <input type="file" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange} />
            </label>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Analysis Results</h3>
          
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <RefreshCw className="w-10 h-10 animate-spin text-brand-500 mb-4" />
              <p>AI model is processing the image...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-sm mt-1 break-all">{error}</p>
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <UploadCloud className="w-10 h-10 mb-4 opacity-50" />
              <p>Upload and analyze an image to see results here.</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className={`p-4 rounded-xl border flex items-start gap-4 ${result.is_healthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {result.is_healthy ? (
                  <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600 mt-1" />
                )}
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{result.plant}</h4>
                  <p className={`text-lg ${result.is_healthy ? 'text-green-700' : 'text-red-700'}`}>
                    {result.disease}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Confidence: {result.confidence.toFixed(2)}%</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Top 3 Predictions</h4>
                <div className="space-y-4">
                  {result.top3.map((pred, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{pred.name}</span>
                        <span className="font-medium">{pred.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-brand-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(pred.confidence, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
