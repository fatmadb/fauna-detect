import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ConfidenceChart from './components/ConfidenceChart';
import { AnalysisState } from './types';
import { identifyAnimal } from './services/geminiService';
import { resizeImage } from './utils/fileHelpers';
import { Search, AlertCircle } from './components/Icons';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    status: 'idle',
    result: null,
    error: null,
  });

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setAnalysis({ status: 'idle', result: null, error: null });
  };

  const handleClear = () => {
    setSelectedImage(null);
    setAnalysis({ status: 'idle', result: null, error: null });
  };

  const handleIdentify = async () => {
    if (!selectedImage) return;

    setAnalysis({ status: 'analyzing', result: null, error: null });

    try {
      const base64 = await resizeImage(selectedImage, 800);
      const result = await identifyAnimal(base64);
      setAnalysis({ status: 'success', result, error: null });
    } catch (err: any) {
      setAnalysis({ 
        status: 'error', 
        result: null, 
        error: err.message || "Failed to identify animal."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        
        <div className="w-full max-w-2xl text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            What animal is that?
          </h2>
          <p className="text-lg text-gray-600">
            Our AI analyzes your image to identify the species and provides a confidence score for its prediction.
          </p>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Upload */}
          <div className="flex flex-col space-y-6">
            <ImageUploader 
              onImageSelected={handleImageSelect}
              selectedImage={selectedImage}
              onClear={handleClear}
              disabled={analysis.status === 'analyzing'}
            />
            
            <button
              onClick={handleIdentify}
              disabled={!selectedImage || analysis.status === 'analyzing'}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform flex items-center justify-center space-x-2
                ${!selectedImage || analysis.status === 'analyzing'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-500/30 hover:-translate-y-1 active:translate-y-0'
                }
              `}
            >
              {analysis.status === 'analyzing' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search size={24} />
                  <span>Identify Animal</span>
                </>
              )}
            </button>

            {analysis.status === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm">{analysis.error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="flex flex-col justify-start min-h-[400px]">
            {analysis.status === 'success' && analysis.result ? (
              <ConfidenceChart result={analysis.result} />
            ) : (
              <div className="h-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-white">
                <div className="bg-gray-50 p-4 rounded-full mb-3">
                  <Search size={32} className="text-gray-300" />
                </div>
                <p>Results will appear here</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Copyright developed by Fatma Dbaa
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;