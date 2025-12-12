import React from 'react';
import { Camera } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-2 rounded-lg text-white">
            <Camera size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none">
              Fauna<span className="text-green-600">Detect</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase mt-0.5">
              AI Animal Recognition
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;