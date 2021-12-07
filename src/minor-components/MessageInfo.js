import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { RiCheckDoubleFill } from 'react-icons/ri';
import { TiTick } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import Chat from '../components/Chat';
import { CLEAR_MESSAGE_INFO } from '../store/chatSlice';

export default function MessageInfo() {
  const message = useSelector((state) => state.chatState.messageInfo);
  const dispatch = useDispatch();

  function clearMessageInfo() {
    dispatch(CLEAR_MESSAGE_INFO());
  }

  return (
    <div className="h-full bg-blue-50">
      <div className="flex items-center justify-between w-full h-20 pl-8 pr-6 shadow-md bg-blue-50">
        <h4 className="text-xl text-gray-700">Message info</h4>
        <AiOutlineClose
          className="p-1 bg-blue-100 border rounded-md shadow-sm hover:shadow-md"
          size={35}
          onClick={clearMessageInfo}
        />
      </div>
      <div className="relative h-full">
        <div className="relative w-full h-48 py-10 pr-4">
          <div
            className={`flex items-center justify-center w-full h-full transform ${
              message.mediaUrl && 'scale-50'
            } `}
          >
            <Chat message={message} />
          </div>
          <div className="absolute inset-0 w-full h-full bg-transparent"></div>
        </div>

        <div className="h-full px-10 text-gray-500 bg-blue-100">
          {message.status === 'read' && (
            <div className="py-4 pl-4 border-b">
              <div className="flex items-center space-x-2 text-dodgerblue">
                <RiCheckDoubleFill className="text-dodgerblue" />
                <span>Read</span>
              </div>
              <div>{new Date(message.readTime).toLocaleString()}</div>
            </div>
          )}
          {(message.status === 'read' || message.status === 'delivered') && (
            <div className="py-4 pl-4 border-b">
              <div className="flex items-center space-x-2">
                <RiCheckDoubleFill />
                <span>Delivered</span>
              </div>
              <div>{new Date(message.deliveredTime).toLocaleString()}</div>
            </div>
          )}
          {(message.status === 'read' ||
            message.status === 'delivered' ||
            message.status === 'sent') && (
            <div className="py-4 pl-4 border-b">
              <div className="flex items-center space-x-2">
                <TiTick />
                <span>Sent</span>
              </div>
              <div>{new Date(message.time).toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
      {JSON.stringify(message)}
    </div>
  );
}
