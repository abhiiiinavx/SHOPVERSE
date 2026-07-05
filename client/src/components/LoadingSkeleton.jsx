import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-white dark:bg-primary rounded-lg shadow-lg overflow-hidden"
        >
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
