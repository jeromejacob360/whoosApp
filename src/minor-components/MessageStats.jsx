import React from 'react';
import { RiCheckDoubleFill } from 'react-icons/ri';
import SingleTick from '../assets/svgs/SingleTick';

export default function MessageStats({ messageIsFromMe, messageObj }) {
  return (
    messageIsFromMe && (
      <div>
        {messageObj.status === 'sent' && (
          <SingleTick className="transform opacity-50 rotate-12" />
        )}
        {messageObj.status === 'delivered' && (
          <RiCheckDoubleFill className="opacity-50" />
        )}
        {messageObj.status === 'read' && (
          <RiCheckDoubleFill className="text-blue-800" />
        )}
      </div>
    )
  );
}
