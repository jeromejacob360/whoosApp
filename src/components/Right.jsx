import { useRef, useState } from 'react';
import ChatHistory from './ChatHistory';
import MessageInput from './MessageInput';
import Title from './Title';

export default function Right() {
  const chatHistoryRef = useRef();
  const [openContacts, setOpenContacts] = useState(false);

  return (
    <div className="relative flex flex-col justify-between flex-1 w-full h-full">
      <Title openContacts={openContacts} setOpenContacts={setOpenContacts} />
      <ChatHistory chatHistoryRef={chatHistoryRef} />
      <MessageInput chatHistoryRef={chatHistoryRef} />
    </div>
  );
}
