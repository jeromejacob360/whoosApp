import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useSelector } from 'react-redux';
import Left from '../components/Left';
import Right from '../components/Right';
import MessageInfo from '../minor-components/MessageInfo';

export default function ChatPage() {
  const showMessageInfo = useSelector((state) => state?.chatState?.messageInfo);
  return (
    <div className="relative flex h-full shadow-2xl rounded-3xl">
      <Left />
      <Right />
      <AnimatePresence>
        {showMessageInfo && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '400px' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ ease: 'linear', duration: 0.15 }}
            className="h-full overflow-y-hidden"
          >
            <MessageInfo />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
