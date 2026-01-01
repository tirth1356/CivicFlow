import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, RotateCcw, Check } from 'lucide-react';

const CameraCapture = ({ onCapture, onClose }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage({ blob, url: imageUrl });
    }, 'image/jpeg', 0.8);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage.blob);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
    onClose();
  };

  // Start camera when component mounts
  useState(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm">
        <h3 className="text-white font-semibold">Take Photo</h3>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>Starting camera...</p>
            </div>
          </div>
        )}

        {capturedImage ? (
          <img
            src={capturedImage.url}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-900/80 backdrop-blur-sm">
        {capturedImage ? (
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={retakePhoto}
              className="flex items-center justify-center w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={confirmPhoto}
              className="flex items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
            >
              <Check className="w-8 h-8 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={capturePhoto}
              disabled={!stream}
              className="flex items-center justify-center w-20 h-20 bg-white hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-10 h-10 text-gray-900" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CameraCapture;