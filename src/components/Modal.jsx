import { motion } from 'framer-motion';
import React from 'react';
import ClickAway from '../hooks/ClickAway';

export default function Modal({ onClickAway, children, props }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-80"
    >
      <ClickAway onClickAway={onClickAway} {...props}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {children}
        </motion.div>
      </ClickAway>
    </motion.div>
  );
}
