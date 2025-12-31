import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  message,
  type = 'default',
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const typeClasses = {
    default: 'border-gray-800',
    success: 'border-green-500/20',
    warning: 'border-yellow-500/20',
    danger: 'border-red-500/20',
    error: 'border-red-500/20',
    info: 'border-blue-500/20'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden rounded-2xl border bg-gray-900 ${typeClasses[type]}`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {message && <p className="text-gray-300">{message}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;