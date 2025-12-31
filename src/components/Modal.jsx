import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'default',
  size = 'md' 
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const typeClasses = {
    default: isDark ? 'border-gray-800' : 'border-gray-200',
    success: isDark ? 'border-green-500/20' : 'border-green-200',
    warning: isDark ? 'border-yellow-500/20' : 'border-yellow-200',
    danger: isDark ? 'border-red-500/20' : 'border-red-200',
    info: isDark ? 'border-blue-500/20' : 'border-blue-200'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden rounded-2xl border transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900' 
          : 'bg-white'
      } ${typeClasses[type]}`}>
        {/* Header */}
        {title && (
          <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300 ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <h2 className={`text-xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;