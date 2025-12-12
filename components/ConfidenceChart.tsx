import React from 'react';
import { IdentificationResult } from '../types';
import { Sparkles, Info } from './Icons';

interface ConfidenceChartProps {
  result: IdentificationResult;
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ result }) => {
  // Sort candidates by confidence descending
  const sortedCandidates = [...result.candidates].sort((a, b) => b.confidence - a.confidence);
  const winner = sortedCandidates[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-green-600 px-6 py-5 text-white">
        <h2 className="text-2xl font-bold tracking-tight">{winner.name}</h2>
        <p className="text-green-100 text-sm italic opacity-90">{result.scientificName}</p>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Description */}
        <div className="flex gap-3">
          <div className="text-green-600 shrink-0 mt-1">
             <Info size={20} />
          </div>
          <p className="text-gray-700 leading-relaxed">
            {result.description}
          </p>
        </div>

        {/* Confidence Bars */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles size={16} />
            Confidence Levels
          </h3>
          
          <div className="space-y-4">
            {sortedCandidates.map((candidate, index) => {
              const isWinner = index === 0;
              return (
                <div key={index}>
                  <div className="flex justify-between items-end mb-1">
                    <span className={`font-medium ${isWinner ? 'text-gray-900' : 'text-gray-600'}`}>
                      {candidate.name}
                    </span>
                    <span className={`font-mono text-sm ${isWinner ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                      {candidate.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${isWinner ? 'bg-green-500' : 'bg-gray-300'}`}
                      style={{ width: `${candidate.confidence}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfidenceChart;
