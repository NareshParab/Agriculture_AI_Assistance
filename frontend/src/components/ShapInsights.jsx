import React, { useState, useEffect } from 'react';
import { getShapInsights } from '../api';
import { Lightbulb, Info } from 'lucide-react';

const ShapInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const data = await getShapInsights();
        setInsights(data);
      } catch (err) {
        setError("Failed to load SHAP insights.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          Explainable AI <Lightbulb className="w-8 h-8 text-yellow-500" />
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Machine learning models shouldn't be black boxes. Using SHAP (SHapley Additive exPlanations), 
          we break down exactly which factors influence our yield predictions the most.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-full bg-gray-200 rounded-xl mb-4"></div>
            <div className="text-gray-400">Loading AI Insights...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {insights && Object.keys(insights).length === 0 && (
        <div className="bg-blue-50 text-blue-800 p-6 rounded-xl flex items-start gap-4">
          <Info className="w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg mb-1">Insights not generated yet</h3>
            <p>The SHAP plots have not been generated yet. You need to run the main ML pipeline script (`python main.py`) to generate these insights first.</p>
          </div>
        </div>
      )}

      {insights && Object.keys(insights).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {insights.bar_plot && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Feature Importance</h3>
              <p className="text-sm text-gray-500 mb-6">
                This chart shows the average impact of each feature on the model's output magnitude. 
                Features at the top have the highest overall influence on yield prediction.
              </p>
              <img src={insights.bar_plot} alt="SHAP Bar Plot" className="w-full rounded-lg" />
            </div>
          )}

          {insights.beeswarm_plot && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Feature Impact Direction</h3>
              <p className="text-sm text-gray-500 mb-6">
                This chart shows how high or low values of a feature affect the prediction. 
                Red means a high feature value, blue means a low feature value. 
                Points on the right increase yield, points on the left decrease it.
              </p>
              <img src={insights.beeswarm_plot} alt="SHAP Beeswarm Plot" className="w-full rounded-lg" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShapInsights;
