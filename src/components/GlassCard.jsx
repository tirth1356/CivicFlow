import { useTheme } from '../context/ThemeContext';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  blur = 'backdrop-blur-sm',
  border = true,
  padding = 'p-6',
  rounded = 'rounded-2xl',
  ...props 
}) => {
  const { isDark } = useTheme();

  const baseClasses = `
    ${rounded}
    ${padding}
    ${blur}
    transition-all duration-300
    ${border ? 'border' : ''}
  `;

  const themeClasses = isDark
    ? `
        ${gradient 
          ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/40' 
          : 'bg-gray-900/60'
        }
        ${border ? 'border-gray-800/50' : ''}
        ${hover ? 'hover:bg-gray-900/70 hover:border-gray-700/50' : ''}
      `
    : `
        ${gradient 
          ? 'bg-gradient-to-br from-white/80 to-gray-50/60' 
          : 'bg-white/80'
        }
        ${border ? 'border-gray-200/50' : ''}
        ${hover ? 'hover:bg-white/90 hover:border-gray-300/50' : ''}
      `;

  const hoverEffects = hover 
    ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer' 
    : '';

  return (
    <div 
      className={`${baseClasses} ${themeClasses} ${hoverEffects} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Preset variants for common use cases
export const StatsCard = ({ children, className = '', ...props }) => (
  <GlassCard 
    className={`text-center ${className}`}
    hover={true}
    gradient={true}
    {...props}
  >
    {children}
  </GlassCard>
);

export const FeatureCard = ({ children, className = '', ...props }) => (
  <GlassCard 
    className={className}
    hover={true}
    padding="p-8"
    {...props}
  >
    {children}
  </GlassCard>
);

export const InfoCard = ({ children, className = '', ...props }) => (
  <GlassCard 
    className={className}
    gradient={true}
    {...props}
  >
    {children}
  </GlassCard>
);

export const FloatingCard = ({ children, className = '', ...props }) => (
  <GlassCard 
    className={`shadow-2xl ${className}`}
    blur="backdrop-blur-md"
    gradient={true}
    {...props}
  >
    {children}
  </GlassCard>
);

export default GlassCard;