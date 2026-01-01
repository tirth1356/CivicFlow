import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const CardSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="animate-pulse">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-700/50 rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700/50 rounded"></div>
              <div className="h-3 bg-gray-700/50 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
          <div className="h-8 bg-gray-700/50 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
      <div className="animate-pulse flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-700/50 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-700/50 rounded-full w-16"></div>
      </div>
    </div>
  );

  const StatSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-gray-700/50 rounded-lg mb-4"></div>
        <div className="h-8 bg-gray-700/50 rounded w-16 mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-24"></div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return <ListSkeleton />;
      case 'stat':
        return <StatSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {skeletons.map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </motion.div>
  );
};

export default LoadingSkeleton;