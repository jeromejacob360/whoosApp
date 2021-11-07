import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ChatOptions from './optionMenus/chatOptions';

//----------------------------------------------//
export default function Chat({ message }) {
  //State variables
  const [openOptions, setOpenOptions] = useState(false);
  const [largeMessage, setLargeMessage] = useState('');
  const [largeMessageCutoff, setLargeMessageCutoff] = useState(50);

  //Access the store
  const currentUserName = useSelector((state) => state?.authState?.user?.email);

  //logic
  const messageIsFromMe = message?.from === currentUserName;

  function scrollIntoView(id) {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
    element.style.backgroundColor = '#f5f5f5';
    element.style.borderRadius = '0px';
    setTimeout(() => {
      element.style.backgroundColor = 'transparent';
      element.style.borderRadius = '60px';
    }, 2000);
  }

  useEffect(() => {
    function trimLargeMessage() {
      const trimmedMessage = message.message.substring(0, largeMessageCutoff);
      setLargeMessage(trimmedMessage + '...');
    }
    if (message.message.length > largeMessageCutoff) {
      trimLargeMessage();
    } else setLargeMessage('');
  }, [largeMessageCutoff, message]);

  return (
    <div
      id={message.time}
      className={`flex ${
        messageIsFromMe ? 'justify-end' : 'justify-start'
      } duration-500`}
    >
      {!message?.deletedForMe.includes(currentUserName) && (
        <div
          className={`px-1 group py-1 mx-2 my-4 break-words border-main rounded-lg shadow-sm w-52 relative ${
            messageIsFromMe ? 'bg-blue-200' : 'bg-WaGreen'
          }`}
        >
          {/* Options button */}
          {!message.deleted && (
            <div className="absolute opacity-0 top-1 right-1 group-hover:opacity-100">
              <svg
                onClick={() => setOpenOptions((prev) => !prev)}
                className="h-5 w-5h-5 text-icons"
                viewBox="0 0 20 20"
                fill="blue"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {/* Options menu */}
          <div onClick={() => setOpenOptions(false)}>
            {openOptions && !message.deleted && (
              <ChatOptions message={message} setOpenOptions={setOpenOptions} />
            )}
          </div>
          {/* Replied message */}
          {message.messageToReply && (
            <div
              onClick={() => scrollIntoView(message.messageToReply.time)}
              className="p-1 border-l-8 border-yellow-700 rounded-lg cursor-pointer bg-dim"
            >
              {message.messageToReply.message}
            </div>
          )}

          <div
            className={`${
              message?.deleted && 'text-sm text-gray-600 italic'
            } pl-4`}
          >
            {largeMessage ? (
              <div>
                <div>{largeMessage}</div>
                <button
                  onClick={() => setLargeMessageCutoff((prev) => prev * 2)}
                  className="text-blue-700 underline"
                >
                  more..
                </button>
              </div>
            ) : (
              message.message
            )}
          </div>
          <p className={`text-xs text-right text-gray-400`}>
            {new Date(message?.time).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
