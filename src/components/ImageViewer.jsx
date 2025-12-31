import { useTheme } from '../context/ThemeContext';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

const ImageViewer = ({ imageUrl, onClose, title }) => {
  const { isDark } = useTheme();
  const [zoom, setZoom] = useState(1);

  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleDownload}
          className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-1 bg-black/50 text-white rounded-lg text-sm">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="max-w-full max-h-full overflow-auto cursor-pointer"
        onClick={onClose}
      >
        <img
          src={imageUrl}
          alt={title || "Image"}
          className="max-w-none transition-transform duration-300"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Title */}
      {title && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="px-4 py-2 bg-black/50 text-white rounded-lg text-sm max-w-md text-center">
            {title}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;