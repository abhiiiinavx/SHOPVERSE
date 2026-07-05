import { motion } from 'framer-motion';

const LoadingSkeleton = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 w-full"
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
