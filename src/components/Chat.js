import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ADD_MESSAGE_TO_FORWARDS,
  REMOVE_MESSAGE_TO_FORWARDS,
} from '../store/chatSlice';
import Modal from './Modal';
import ChatOptions from './optionMenus/chatOptions';

//----------------------------------------------//
export default function Chat({ message: messageObj }) {
  //State variables
  const [openOptions, setOpenOptions] = useState(false);
  const [largeMessage, setLargeMessage] = useState('');
  const [largeMessageCutoff, setLargeMessageCutoff] = useState(50);
  const [selected, setSelected] = useState(false);
  const [imageToPreview, setImageToPreview] = useState('');

  const dispatch = useDispatch();

  //Access the store
  const currentUserName = useSelector((state) => state?.authState?.user?.email);
  const forwardMode = useSelector((state) => state?.chatState?.forwardMode);

  //logic
  const messageIsFromMe = messageObj?.from === currentUserName;

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
    if (!forwardMode) {
      setSelected(false);
    }
  }, [forwardMode]);

  useEffect(() => {
    function trimLargeMessage() {
      const trimmedMessage = messageObj.message.substring(
        0,
        largeMessageCutoff,
      );
      setLargeMessage(trimmedMessage + '...');
    }
    if (messageObj.message.length > largeMessageCutoff) {
      trimLargeMessage();
    } else setLargeMessage('');
  }, [largeMessageCutoff, messageObj]);

  useEffect(() => {
    selected
      ? dispatch(ADD_MESSAGE_TO_FORWARDS(messageObj))
      : dispatch(REMOVE_MESSAGE_TO_FORWARDS(messageObj));
  }, [dispatch, messageObj, selected]);

  // add or remove selected message to forward
  function addOrRemove() {
    setSelected((prev) => !prev);
  }

  return (
    <div
      onClick={forwardMode ? addOrRemove : null}
      id={messageObj.time}
      className={`flex duration-200 my-1 bg-opacity-30 ${
        selected ? 'bg-selected' : 'bg-transparent'
      } ${messageIsFromMe ? 'justify-end' : 'justify-start'} ${
        forwardMode ? 'cursor-pointer' : ''
      }`}
    >
      {/* Image modal */}
      {imageToPreview && (
        <Modal onClickAway={() => setImageToPreview('')}>
          <img src={imageToPreview} alt="preview" />
        </Modal>
      )}
      {!messageObj?.deletedForMe.includes(currentUserName) && (
        <div
          className={`p-1 group m-2 break-words border-main rounded-lg shadow-sm w-52 relative ${
            messageIsFromMe ? 'bg-blue-200' : 'bg-WaGreen'
          }`}
        >
          {/* Options button */}
          {!messageObj.deleted && !forwardMode && (
            <div className="absolute duration-200 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100 group-hover:bg-white">
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
            {openOptions && !messageObj.deleted && (
              <ChatOptions
                message={messageObj}
                setOpenOptions={setOpenOptions}
                setSelected={setSelected}
              />
            )}
          </div>
          {/* Replied message */}
          {messageObj.messageToReply && (
            <div
              onClick={() => scrollIntoView(messageObj.messageToReply.time)}
              className="p-1 border-l-8 border-yellow-700 rounded-lg cursor-pointer bg-dim"
            >
              {messageObj.messageToReply.mediaUrl && (
                <div>
                  <span>Photo</span>
                  <img
                    className="h-8 "
                    src={messageObj.messageToReply.mediaUrl}
                    alt=""
                  />
                </div>
              )}
              {messageObj.messageToReply.message}
            </div>
          )}

          {messageObj.mediaUrl && (
            <img
              onClick={() => setImageToPreview(messageObj.mediaUrl)}
              className="rounded-md cursor-pointer"
              src={messageObj.mediaUrl}
              alt=""
            />
          )}

          <div
            className={`${
              messageObj?.deleted && 'text-sm text-gray-600 italic'
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
              messageObj.message
            )}
          </div>
          <p className={`text-xs text-right text-gray-400 mt-1`}>
            {new Date(messageObj?.time).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
