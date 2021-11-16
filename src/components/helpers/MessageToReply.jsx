import { motion } from 'framer-motion';
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_REPLY_MESSAGE } from '../../store/chatSlice';

export default function MessageToReply() {
  const dispatch = useDispatch();

  const currentChatName = useSelector(
    (state) => state?.chatState.currentChatName,
  );

  const messageToReply =
    useSelector((state) => state?.chatState.messageToReply[currentChatName]) ||
    '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ height: 0, opacity: 0 }}
      className="w-full p-2 rounded-md rounded-bl-none rounded-br-none cursor-pointer bg-main"
    >
      <AiOutlineClose
        onClick={() => dispatch(CLEAR_REPLY_MESSAGE(currentChatName))}
        className="w-4 h-4 top-1 right-4"
      />
      <div className="py-1 pl-2 border-l-8 border-yellow-700 rounded-md bg-dim">
        {messageToReply.mediaUrl ? (
          <div>
            <span>Photo</span>
            <img className="h-8 " src={messageToReply.mediaUrl} alt="" />
          </div>
        ) : (
          <span> {messageToReply.message}</span>
        )}
      </div>
    </motion.div>
  );
}
