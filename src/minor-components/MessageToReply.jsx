import { motion } from 'framer-motion';
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_REPLY_MESSAGE } from '../store/chatSlice';

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
      className="w-full p-2 bg-blue-200 rounded-md rounded-bl-none rounded-br-none cursor-pointer"
    >
      <AiOutlineClose
        size={25}
        onClick={() => dispatch(CLEAR_REPLY_MESSAGE())}
        className="p-1 mb-2 text-blue-900 border border-blue-700 rounded-md top-1 right-4"
      />
      <div className="py-1 pl-2 bg-black border-l-8 border-green-700 rounded-md bg-opacity-10">
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
