import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Droplets, Lightbulb } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'AI Disease Detection',
      description: 'Upload an image of a crop leaf and instantly identify diseases using our CNN model with 93.5% accuracy across 72 classes.',
      icon: <ShieldCheck className="w-8 h-8 text-brand-600" />,
      path: '/disease',
    },
    {
      title: 'Crop Yield Prediction',
      description: 'Forecast your harvest based on climate, soil, and agricultural inputs using our advanced predictive models.',
      icon: <TrendingUp className="w-8 h-8 text-brand-600" />,
      path: '/yield',
    },
    {
      title: 'Fertilizer Optimization',
      description: 'Discover the exact NPK ratios needed to maximize your yield based on your specific region and current soil conditions.',
      icon: <Droplets className="w-8 h-8 text-brand-600" />,
      path: '/fertilizer',
    },
    {
      title: 'Explainable AI',
      description: 'Understand the "why" behind the predictions. View SHAP insights that explain which features drive our AI models.',
      icon: <Lightbulb className="w-8 h-8 text-brand-600" />,
      path: '/insights',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl">
        <h1 className="tracking-tight font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', lineHeight: 1.15 }}>
          <span className="block">Smart Agri</span>
          <span className="block text-brand-600">See. Predict. Grow.</span>
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-500 sm:text-xl md:mt-6 md:text-2xl leading-relaxed">
          Empowering modern farmers with machine learning. Predict yields, optimize fertilizers, and detect diseases instantly to maximize your harvest.
        </p>
      </div>

      <div className="mt-16 max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.path}
            className="group block p-7 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-200 hover:-translate-y-1"
          >
            <div className="bg-brand-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-base leading-relaxed">{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
