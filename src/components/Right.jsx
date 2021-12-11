import { useEffect, useRef, useState } from 'react';
import ChatHistory from './ChatHistory';
import MessageInput from './MessageInput';
import Title from './Title';

export default function Right() {
  const [openContacts, setOpenContacts] = useState(false);
  const chatHistoryRef = useRef();

  useEffect(() => {
    setOpenContacts(true);
  }, []);

  return (
    <div className="relative flex flex-col justify-between flex-1 w-full h-full">
      <Title openContacts={openContacts} setOpenContacts={setOpenContacts} />
      <ChatHistory chatHistoryRef={chatHistoryRef} />
      <MessageInput chatHistoryRef={chatHistoryRef} />
    </div>
  );
}
