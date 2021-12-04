import { CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ADD_MESSAGE_TO_FORWARDS,
  REMOVE_MESSAGE_TO_FORWARDS,
} from '../store/chatSlice';
import Modal from './Modal';
import ChatOptions from './optionMenus/chatOptions';
import NotSent from '../assets/svgs/NotSent';
import SingleTick from '../assets/svgs/SingleTick';
import { AnimatePresence, motion } from 'framer-motion';

//----------------------------------------------//
export default function Chat({ message: messageObj }) {
  //State variables
  const [openOptions, setOpenOptions] = useState(false);
  const [largeMessage, setLargeMessage] = useState('');
  const [largeMessageCutoff, setLargeMessageCutoff] = useState(300);
  const [selected, setSelected] = useState(false);
  const [imageToPreview, setImageToPreview] = useState('');
  const [progressIndicator, setProgressIndicator] = useState('');

  const imageRef = useRef(null);

  const dispatch = useDispatch();

  //Access the store
  const currentUserName = useSelector((state) => state?.authState?.user?.email);
  const forwardMode = useSelector((state) => state?.chatState?.forwardMode);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );
  const progress = useSelector(
    (state) => state?.chatState?.progress[currentChatName],
  );

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
    if (progress && progress[messageObj.time]) {
      const currentProgress = progress[messageObj.time];
      if (currentProgress === -1) {
        setProgressIndicator(<NotSent />);
      } else if (currentProgress > 0 && currentProgress < 100) {
        setProgressIndicator(
          <CircularProgress
            size={10}
            variant={'determinate'}
            value={progress[messageObj.time]}
          />,
        );
      } else if (currentProgress === 100) {
        setProgressIndicator(<SingleTick />);
      }
    }
  }, [messageObj.time, progress]);

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

  useEffect(() => {
    // prevent image drag to allow drag to reply
    if (imageRef.current) imageRef.current.ondragstart = () => false;
  }, []);

  return (
    <div
      onClick={forwardMode ? addOrRemove : null}
      id={messageObj.time}
      className={`flex duration-200 my-1 bg-opacity-30  ${
        selected ? 'bg-selected' : ''
      } ${messageIsFromMe ? 'justify-end' : 'justify-start'} ${
        forwardMode ? 'cursor-pointer' : ''
      }`}
    >
      {/* Image modal */}
      <AnimatePresence>
        {imageToPreview && (
          <Modal id={messageObj.time} onClickAway={() => setImageToPreview('')}>
            <img src={imageToPreview} alt="preview" />
          </Modal>
        )}
      </AnimatePresence>

      <div
        className={`p-1 group m-2 break-words max-w-sm border-main rounded-lg shadow-sm relative ${
          messageIsFromMe ? 'bg-chatGreen' : 'bg-whiteBG'
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
                  ref={imageRef}
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
          <motion.img
            layout
            layoutId={'messageObj.time'}
            ref={imageRef}
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
              <span>{largeMessage}</span>
              <span
                onClick={() => setLargeMessageCutoff((prev) => prev * 2)}
                className="text-dodgerblue"
              >
                {' '}
                more...
              </span>
            </div>
          ) : (
            <div>{messageObj.message}</div>
          )}
        </div>

        <div className="relative flex items-center justify-end mt-2 mr-2 space-x-2">
          <span className={`text-xs text-right text-gray-400 mr-6`}>
            {new Date(messageObj?.time).toLocaleTimeString()}
          </span>
          <span className="absolute bottom-0 right-0">{progressIndicator}</span>
        </div>
      </div>
    </div>
  );
}
