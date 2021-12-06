import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import Chat from '../components/Chat';
import { CLEAR_MESSAGE_INFO } from '../store/chatSlice';
import bgImg from '../assets/images/pattern.png';

export default function MessageInfo() {
  const message = useSelector((state) => state.chatState.messageInfo);
  const dispatch = useDispatch();

  function clearMessageInfo() {
    dispatch(CLEAR_MESSAGE_INFO());
  }

  return (
    <div
      className="w-full h-full border"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex justify-between w-full px-2 py-4 bg-dim">
        <h4>Message info</h4>
        <AiOutlineClose onClick={clearMessageInfo} />
      </div>
      <div className="relative h-full">
        <div className="flex items-center justify-end w-full py-10 pr-4">
          <Chat message={message} />
        </div>

        <div className="h-full px-10 bg-white">
          <div>message: {message.message}</div>
          <div>read at : </div>
          <div>Delivered at : </div>
        </div>
      </div>
      {JSON.stringify(message)}
    </div>
  );
}
