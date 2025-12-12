import React, { useRef, useState } from 'react';
import { Upload, Camera, X } from './Icons';
import { isValidImageFile } from '../utils/fileHelpers';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage, onClear, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidImageFile(file)) {
        onImageSelected(file);
      } else {
        alert("Please upload a valid image file (JPEG, PNG, WebP).");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidImageFile(file)) {
        onImageSelected(file);
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (selectedImage && previewUrl) {
    return (
      <div className="relative w-full aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-gray-100 group">
        <img 
          src={previewUrl} 
          alt="Selected" 
          className="w-full h-full object-contain bg-gray-900"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {!disabled && (
            <button 
              onClick={onClear}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <X size={18} />
              <span>Remove Image</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 text-center
        ${dragActive ? 'border-green-500 bg-green-50 scale-[1.02]' : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-50/30'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={!disabled ? onButtonClick : undefined}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={handleChange}
        disabled={disabled}
      />
      
      <div className="bg-green-100 p-4 rounded-full mb-4 text-green-600">
        <Camera size={32} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mb-1">
        Identify an Animal
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mb-4">
        Upload a photo to detect species and confidence levels
      </p>
    </div>
  );
};

export default ImageUploader;
