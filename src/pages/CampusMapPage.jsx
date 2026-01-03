import { useTheme } from '../context/ThemeContext';
import InteractiveMap from '../components/InteractiveMap';

/**
 * Campus Map Page
 * Route: /map
 */
const CampusMapPage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <InteractiveMap />
    </div>
  );
};

export default CampusMapPage;

