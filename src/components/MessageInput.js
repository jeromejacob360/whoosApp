import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_REPLY_MESSAGE, FORWARD_MODE_OFF } from '../store/chatSlice';
import Picker from 'emoji-picker-react';

import { ReactComponent as CloseIcon } from '../assets/icons/closeSVG.svg';
import ContactsPicker from './ContactsPicker';
import sendMessagetoDB from '../helpers/sendMessage';

//----------------------------------------------//
export default function MessageInput({ chatHistoryRef }) {
  //State variables
  const [message, setMessage] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openContactsPicker, setOpenContactsPicker] = useState(false);

  const inputRef = useRef();
  const dispatch = useDispatch();

  //Access the store
  const currentChatName = useSelector(
    (state) => state?.chatState.currentChatName,
  );
  const currentChatterEmail = useSelector(
    (state) => state?.chatState.currentChatterEmail,
  );
  const currentUserName = useSelector((state) => state?.authState.user.email);
  const messageToReply =
    useSelector((state) => state?.chatState.messageToReply[currentChatName]) ||
    '';
  const focusInput = useSelector((state) => state?.chatState.focusInput);

  // forwarding messages
  const forwardMode = useSelector((state) => state?.chatState.forwardMode);
  const totalSelectedMessages = useSelector(
    (state) => state?.chatState.totalSelectedMessages,
  );

  if (focusInput) {
    inputRef.current.focus();
  }

  //Side effects
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [currentChatName]);

  // logic

  function openContactsPickerForForwarding() {
    setOpenContactsPicker(true);
  }
  async function sendMessage(e) {
    e.preventDefault();
    setOpenEmojiPicker(false);
    if (messageToReply) dispatch(CLEAR_REPLY_MESSAGE(currentChatName));

    sendMessagetoDB(
      message,
      currentChatterEmail,
      currentUserName,
      currentChatName,
      setMessage,
      chatHistoryRef,
      messageToReply,
    );
  }

  const onEmojiClick = (event, emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    inputRef.current.focus();
  };

  if (openContactsPicker) {
    return (
      <div className="px-4 bg-selected">
        <ContactsPicker setOpenContactsPicker={setOpenContactsPicker} />
      </div>
    );
  }

  if (forwardMode) {
    return (
      <div className="px-4 bg-selected">
        <div className="flex items-center justify-between h-10 ">
          <button onClick={() => dispatch(FORWARD_MODE_OFF())}>x</button>
          <span>{totalSelectedMessages} selected</span>
          <div>
            {/* TODO add starring */}
            <button>star</button>
            {/* TODO add delete for me and delete for all with modal */}
            <button>Delete</button>
            <button onClick={openContactsPickerForForwarding}>Forward</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {currentChatName && openEmojiPicker && (
        <div>
          <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick} />
        </div>
      )}
      {messageToReply && (
        <div className="relative w-full p-2 pt-6 rounded-md rounded-bl-none rounded-br-none cursor-pointer bg-main">
          <CloseIcon
            onClick={() => dispatch(CLEAR_REPLY_MESSAGE(currentChatName))}
            className="absolute w-4 h-4 top-1 right-4"
          />
          <div className="py-1 pl-2 border-l-8 border-yellow-700 rounded-md bg-dim">
            <span> {messageToReply.message}</span>
          </div>
        </div>
      )}
      <form
        onSubmit={sendMessage}
        className={`flex px-4 py-2 border shadow-md bg-main ${
          !currentChatName && 'no-cursor'
        }`}
      >
        <input
          ref={inputRef}
          disabled={!currentChatName}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 border rounded-full"
          placeholder="Type a message.."
          type="text"
        ></input>
        <span
          onClick={() => setOpenEmojiPicker((prev) => !prev)}
          className={`px-2 py-1 ${
            !currentChatName ? 'opacity-20' : 'cursor-pointer'
          }`}
        >
          🙂
        </span>

        <button
          type="submit"
          disabled={!currentChatName}
          className="px-3 py-1 border shadow-md rounded-2xl disabled:opacity-20 border-dodgerblue"
        >
          Send
        </button>
      </form>
    </div>
  );
}
