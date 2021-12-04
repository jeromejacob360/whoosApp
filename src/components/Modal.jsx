import { motion } from 'framer-motion';
import React from 'react';
import ClickAway from '../hooks/ClickAway';

export default function Modal({ onClickAway, children, props }) {
  return (
    <motion.div
      layout
      layoutId={'messageObj.time'}
      className="fixed inset-0 z-10 flex items-center justify-center w-screen h-screen bg-white bg-opacity-95"
    >
      <ClickAway onClickAway={onClickAway} {...props}>
        {children}
      </ClickAway>
    </motion.div>
  );
}
