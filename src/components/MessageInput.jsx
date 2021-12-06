import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import ContactsPicker from './ContactsPicker';
import {
  ADD_MESSAGE,
  CLEAR_REPLY_MESSAGE,
  MESSAGE_SENT,
  REMOVE_UPLOAD_PROGRESS,
  SET_UPLOAD_PROGRESS,
  UPLOAD_STARTED,
} from '../store/chatSlice';
import ClickAway from '../hooks/ClickAway';
import sendMessagetoDB from '../helper-functions/sendMessage';
import {
  CameraPreview,
  ForwardMenu,
  MessageToReply,
} from '../minor-components/index';
import { IoMdHappy } from 'react-icons/io';
import AttachIcon from '../assets/svgs/Attach.js';
import Send from '../assets/svgs/Send.js';

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { AnimatePresence, motion } from 'framer-motion';

import AttachOptions from '../minor-components/AttachOptions';
import useCameraPreviewDimensions from '../hooks/CameraPreviewDimensions';
let newMessage;

//----------------------------------------------//
export default function MessageInput({ chatHistoryRef }) {
  //State variables
  const [message, setMessage] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openContactsPicker, setOpenContactsPicker] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);

  const [capturedImage, setCapturedImage] = useState('');
  const [blob, setBlob] = useState('');
  const [attachOptions, setAttachOptions] = useState(false);
  const [chatHistoryDimensions, setChatHistoryDimensions] = useState({
    height: 0,
    width: 0,
  });

  const inputRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const dispatch = useDispatch();

  //Access the store
  const currentUserEmail = useSelector((state) => state?.authState.user?.email);
  const currentChatterEmail = useSelector(
    (state) => state?.chatState.currentChatterEmail,
  );
  const currentChatName = useSelector(
    (state) => state?.chatState.currentChatName,
  );
  const currentUserName = useSelector((state) => state?.authState.user.email);

  const messageToReply =
    useSelector((state) => state?.chatState.messageToReply[currentChatName]) ||
    '';
  const focusInput = useSelector((state) => state?.chatState.focusInput);

  // forwarding messages
  const forwardMode = useSelector((state) => state?.chatState.forwardMode);

  if (focusInput) {
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 0);
  }

  //Side effects
  useCameraPreviewDimensions(
    chatHistoryRef,
    setChatHistoryDimensions,
    currentChatName,
  );

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [currentChatName]);

  //send message
  async function sendMessage(e) {
    e.preventDefault();
    if (message.trim() === '' && !capturedImage) return;

    setPhotoMode(false);
    setOpenEmojiPicker(false);

    let mediaUrl = '';
    let messageToReplyTrimmed = '';

    if (messageToReply) {
      //remove messageToReply contained in itself if there is

      messageToReplyTrimmed = { ...messageToReply };
      messageToReplyTrimmed.messageToReply &&
        delete messageToReplyTrimmed.messageToReply;
      dispatch(CLEAR_REPLY_MESSAGE());
    }

    newMessage = {
      time: Date.now(),
      message,
      mediaUrl: capturedImage,
      from: currentUserName,
      to: currentChatterEmail,
      deletedForMe: [],
      messageToReply: messageToReplyTrimmed,
    };

    if (capturedImage) {
      dispatch(
        UPLOAD_STARTED({
          chatName: currentChatName,
          id: newMessage.time,
        }),
      );
    }

    dispatch(
      ADD_MESSAGE({
        chatName: currentChatName,
        message: newMessage,
        currentUserEmail,
        from: 'local',
      }),
    );

    setTimeout(() => {
      chatHistoryRef.current.scrollTop =
        chatHistoryRef.current.scrollHeight -
        chatHistoryRef.current.clientHeight;
    }, 0);

    setMessage('');

    if (capturedImage) {
      mediaUrl = await uploadToDb();
      setCapturedImage('');
    }

    sendMessagetoDB({
      newMessage: { ...newMessage, mediaUrl },
      currentChatName,
    }).then((sentMessage) => {
      dispatch(
        MESSAGE_SENT({ chatName: currentChatName, message: sentMessage }),
      );
    });
  }

  function onEmojiClick(_, emojiObject) {
    setMessage((prev) => prev + emojiObject.emoji);
    inputRef.current.focus();
  }

  function uploadToDb() {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storage = getStorage();
    const location = `whatsApp/media/images/${currentChatName}/${Date.now().toString()}`;
    const storageRef = ref(storage, location);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          dispatch(
            SET_UPLOAD_PROGRESS({
              chatName: currentChatName,
              id: newMessage.time,
              progress,
            }),
          );
          switch (snapshot.state) {
            case 'paused':
              break;
            case 'running':
              break;
            default:
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          dispatch(
            REMOVE_UPLOAD_PROGRESS({
              chatName: currentChatName,
              id: newMessage.time,
            }),
          );
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  }

  if (openContactsPicker) {
    return (
      <div className="px-4 bg-selected">
        <ContactsPicker setOpenContactsPicker={setOpenContactsPicker} />
      </div>
    );
  }

  if (forwardMode) {
    return <ForwardMenu setOpenContactsPicker={setOpenContactsPicker} />;
  }

  return (
    currentChatName && (
      <>
        <AnimatePresence>
          {photoMode && (
            <CameraPreview
              chatHistoryDimensions={chatHistoryDimensions}
              canvasRef={canvasRef}
              videoRef={videoRef}
              capturedImage={capturedImage}
              setCapturedImage={setCapturedImage}
              setBlob={setBlob}
              setPhotoMode={setPhotoMode}
            />
          )}

          {/* EMOJI PICKER */}
          {openEmojiPicker && (
            <motion.div
              initial={{ height: 0, display: 'none', opacity: 0 }}
              animate={{ height: 'auto', display: 'block', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <ClickAway onClickAway={() => setOpenEmojiPicker(false)}>
                <Picker
                  pickerStyle={{ width: '100%' }}
                  onEmojiClick={onEmojiClick}
                />
              </ClickAway>
            </motion.div>
          )}

          {/* MESSAGE TO REPLY */}
          {messageToReply && <MessageToReply />}
        </AnimatePresence>

        {/* INPUT METHODS */}
        {(!photoMode || capturedImage) && (
          <form
            onSubmit={sendMessage}
            className={`flex px-4 z-50 h-16 shadow-2xl rounded-br-xl bg-blue-100 items-center ${
              !currentChatName && 'no-cursor'
            }`}
          >
            <span
              onClick={() => setOpenEmojiPicker((prev) => !prev)}
              className={`px-2 py-1`}
            >
              <IoMdHappy className="w-6 h-6 mr-2" />
            </span>

            <div
              className="relative mr-4"
              onClick={() => setAttachOptions(true)}
            >
              {!photoMode && <AttachIcon />}
              <AnimatePresence>
                {attachOptions && (
                  <AttachOptions
                    setPhotoMode={setPhotoMode}
                    setAttachOptions={setAttachOptions}
                  />
                )}
              </AnimatePresence>
            </div>
            <input
              ref={inputRef}
              disabled={!currentChatName}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-whiteBG"
              placeholder="Type a message.."
              type="text"
            ></input>

            <button
              type="submit"
              disabled={!currentChatName}
              className="px-3 py-1"
            >
              <Send />
            </button>
          </form>
        )}
      </>
    )
  );
}
