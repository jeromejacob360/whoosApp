import { CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ADD_MESSAGE_TO_FORWARDS,
  REMOVE_MESSAGE_TO_FORWARDS,
} from '../store/chatSlice';
import Modal from './Modal';
import ChatOptions from '../optionMenus/chatOptions';
import NotSent from '../assets/svgs/NotSent';
import { TiTick } from 'react-icons/ti';
import { AnimatePresence } from 'framer-motion';
import { AiOutlineDown } from 'react-icons/ai';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase/firebase';
import MessageStats from '../minor-components/MessageStats';

//----------------------------------------------//
export default function Chat({
  message: messageObj,
  chatHistoryRef,
  nextSender,
  prevSender,
}) {
  //State variables
  const [openOptions, setOpenOptions] = useState(false);
  const [largeMessage, setLargeMessage] = useState('');
  const [largeMessageCutoff, setLargeMessageCutoff] = useState(300);
  const [selected, setSelected] = useState(false);
  const [imageToPreview, setImageToPreview] = useState('');
  const [progressIndicator, setProgressIndicator] = useState('');
  const [menuVertical, setMenuVertical] = useState('down');
  const [menuHorizontal, setMenuHorizontal] = useState('left');

  const chatRef = useRef();

  const firstChat =
    nextSender === messageObj.from && prevSender !== messageObj.from;
  const lastChat =
    nextSender !== messageObj.from && prevSender === messageObj.from;
  const intermediateChat =
    nextSender === messageObj.from && prevSender === messageObj.from;

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
  const messageInfo = useSelector((state) => state.chatState.messageInfo);

  //logic
  const messageIsFromMe = messageObj?.from === currentUserName;

  function scrollIntoView(id) {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
    element.style.backgroundColor = '#abcced';
    element.style.borderRadius = '0px';
    setTimeout(() => {
      element.style.backgroundColor = 'transparent';
      element.style.borderRadius = '60px';
    }, 2000);
  }

  //scroll the new message into view
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageObj]);

  useEffect(() => {
    if (progress && progress[messageObj.time]) {
      const currentProgress = progress[messageObj.time];
      console.log(`currentProgress`, currentProgress);
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
        setProgressIndicator(<TiTick />);
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
    if (messageObj?.message?.length > largeMessageCutoff) {
      trimLargeMessage();
    } else setLargeMessage('');
  }, [largeMessageCutoff, messageObj]);

  useEffect(() => {
    if (forwardMode) {
      selected
        ? dispatch(ADD_MESSAGE_TO_FORWARDS(messageObj))
        : dispatch(REMOVE_MESSAGE_TO_FORWARDS(messageObj));
    }
  }, [dispatch, forwardMode, messageObj, selected]);

  //read receipt
  const now = Date.now();
  useEffect(() => {
    getDoc(
      doc(db, `whatsApp/chats/${currentChatName}/${messageObj.time}`),
    ).then((document) => {
      if (document.data()) {
        const status = document.data().status;
        if (status === 'delivered') {
          if (messageObj.from !== currentUserName) {
            setDoc(
              document.ref,
              { status: 'read', readTime: now },
              { merge: true },
            );
          }
        }
      }
    });
  }, [currentChatName, currentUserName, messageObj, now]);

  // add or remove selected message to forward
  function addOrRemove() {
    setSelected((prev) => !prev);
  }

  function openChatOptions(e) {
    const menuWidth = 160;
    const menuHeight = 250;
    setOpenOptions((prev) => !prev);

    const rect = chatHistoryRef.current.getBoundingClientRect();
    setMenuVertical(rect.bottom - e.clientY < menuHeight ? 'up' : 'down');
    setMenuHorizontal(e.clientX - rect.left < menuWidth ? 'right' : 'left');
  }

  return (
    <div
      ref={chatRef}
      onClick={forwardMode ? addOrRemove : null}
      id={messageObj.time}
      className={`flex duration-500 bg-opacity-30 ${
        selected ? 'bg-selected' : ''
      } ${messageIsFromMe ? 'justify-end' : 'justify-start'} ${
        forwardMode ? 'cursor-pointer' : ''
      }`}
    >
      {/* Image modal */}
      <AnimatePresence>
        {imageToPreview && (
          <Modal onClickAway={() => setImageToPreview('')}>
            <img src={imageToPreview} alt="preview" />
          </Modal>
        )}
      </AnimatePresence>
      <div
        className={`p-2 group break-words max-w-sm border-main relative 
        ${firstChat && 'mt-4'}
        ${firstChat && messageIsFromMe && 'rounded-tl-2xl'}
        ${firstChat && !messageIsFromMe && 'rounded-tr-2xl'}
        ${lastChat && 'rounded-bl-2xl rounded-br-2xl'}
        ${(firstChat || intermediateChat) && 'border-b'}
        ${
          !firstChat &&
          !lastChat &&
          !intermediateChat &&
          messageIsFromMe &&
          'rounded-2xl rounded-tr-none'
        }
        ${
          !firstChat &&
          !lastChat &&
          !intermediateChat &&
          !messageIsFromMe &&
          'rounded-2xl rounded-tl-none'
        }
      ${messageIsFromMe ? 'bg-indigo-300' : 'bg-blue-300'}`}
        style={{
          minWidth: '100px',
        }}
      >
        {/* Options button */}
        {!messageObj.deleted && !forwardMode && (
          <div className="absolute duration-200 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100 group-hover:bg-white">
            <AiOutlineDown
              className="p-1"
              size={20}
              onClick={openChatOptions}
            />
          </div>
        )}
        {/* Options menu */}
        <AnimatePresence>
          {openOptions && !messageObj.deleted && (
            <ChatOptions
              menuVertical={menuVertical}
              menuHorizontal={menuHorizontal}
              message={messageObj}
              setOpenOptions={setOpenOptions}
              setSelected={setSelected}
            />
          )}
        </AnimatePresence>

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
                  className="h-8"
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
            ref={imageRef}
            onClick={() =>
              messageInfo.time !== messageObj.time &&
              setImageToPreview(messageObj.mediaUrl)
            }
            className="object-contain rounded-md cursor-pointer w-96 h-72"
            src={messageObj.mediaUrl}
            alt=""
          />
        )}

        <div
          className={`${
            messageObj?.deleted && 'text-sm text-gray-600 italic'
          } pl-2`}
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
            <div className="pb-1">{messageObj.message}</div>
          )}
        </div>

        <div className="relative flex items-center justify-end mt-1">
          <span
            className={`text-xxs text-right text-gray-600 ${
              messageIsFromMe && 'mr-6'
            }`}
          >
            {new Date(messageObj?.time).toLocaleTimeString()}
          </span>
          <span className="absolute bottom-0 right-0">{progressIndicator}</span>
          <MessageStats
            messageObj={messageObj}
            messageIsFromMe={messageIsFromMe}
          />
        </div>
      </div>
    </div>
  );
}
