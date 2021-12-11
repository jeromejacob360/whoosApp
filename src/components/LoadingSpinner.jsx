import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { useSelector } from 'react-redux';

export default function LoadingSpinner() {
  const pageRendered = useSelector((state) => state.chatState.pageRendered);
  return (
    <AnimatePresence exitBeforeEnter>
      {!pageRendered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ height: 0, overflow: 'hidden' }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-blue-200"
        >
          <div className="flex flex-col items-center">
            <ImSpinner2 className={`text-blue-500 animate-spin`} size={80} />
            <div className="py-20 text-3xl text-gray-500">WhoosApp</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
