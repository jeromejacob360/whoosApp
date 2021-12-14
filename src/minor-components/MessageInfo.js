import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { RiCheckDoubleFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import SingleTick from '../assets/svgs/SingleTick';
import Chat from '../components/Chat';
import { CLEAR_MESSAGE_INFO } from '../store/chatSlice';
import dateFormat from 'dateformat';

export default function MessageInfo() {
  const message = useSelector((state) => state.chatState.messageInfo);
  const dispatch = useDispatch();

  function clearMessageInfo() {
    dispatch(CLEAR_MESSAGE_INFO());
  }

  return (
    <div className="bg-blue-50">
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

        <div
          className="h-full pl-10 text-gray-500 bg-blue-100 border-2 border-blue-600"
          style={{ minHeight: '300px' }}
        >
          {message.readTime && (
            <div className="py-4 pl-4 border-b">
              <div className="flex items-center space-x-2 text-dodgerblue">
                <RiCheckDoubleFill className="text-dodgerblue" />
                <span>Read</span>
              </div>
              <div className="flex space-x-2">
                <div>
                  {dateFormat(new Date(message.readTime), 'DDDD', 'h:MM:ss')}
                </div>
                <div>
                  {dateFormat(new Date(message.readTime), 'h:MM:ss TT')}
                </div>
              </div>
            </div>
          )}
          {message.deliveredTime && (
            <div className="py-4 pl-4 border-b">
              <div className="flex items-center space-x-2">
                <RiCheckDoubleFill />
                <span>Delivered</span>
              </div>
              <div className="flex space-x-2">
                <div>
                  {dateFormat(
                    new Date(message.deliveredTime),
                    'DDDD',
                    'h:MM:ss',
                  )}
                </div>
                <div>
                  {dateFormat(new Date(message.deliveredTime), 'h:MM:ss TT')}
                </div>
              </div>
            </div>
          )}
          {(message.status === 'read' ||
            message.status === 'delivered' ||
            message.status === 'sent') && (
            <div className="py-4 pl-4 border-b">
              <div className="flex items-center space-x-2">
                <SingleTick className="transform rotate-12" />
                <span>Sent</span>
              </div>
              <div className="flex space-x-2">
                <div>
                  {dateFormat(new Date(message.time), 'DDDD', 'h:MM:ss')}
                </div>
                <div>{dateFormat(new Date(message.time), 'h:MM:ss TT')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
