import { useRef } from 'react';
import ChatHistory from './ChatHistory';
import MessageInput from './MessageInput';
import Title from './Title';

export default function Right() {
  const chatHistoryRef = useRef();

  return (
    <div className="relative flex flex-col justify-between flex-1 w-full h-screen">
      <Title />
      <ChatHistory chatHistoryRef={chatHistoryRef} />
      <MessageInput chatHistoryRef={chatHistoryRef} />
    </div>
  );
}
