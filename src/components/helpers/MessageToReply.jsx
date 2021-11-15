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
    <div className="relative w-full p-2 pt-6 rounded-md rounded-bl-none rounded-br-none cursor-pointer bg-main">
      <AiOutlineClose
        onClick={() => dispatch(CLEAR_REPLY_MESSAGE(currentChatName))}
        className="absolute w-4 h-4 top-1 right-4"
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
    </div>
  );
}
