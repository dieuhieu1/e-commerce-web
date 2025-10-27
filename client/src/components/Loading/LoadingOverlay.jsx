import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const LoadingOverlay = ({ loading }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.p
            className="mt-4 text-white text-lg font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Please wait...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
