import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import ContactsPicker from './ContactsPicker';
import { CLEAR_REPLY_MESSAGE } from '../store/chatSlice';
import ClickAway from '../hooks/ClickAway';
import sendMessagetoDB from '../helpers/sendMessage';
import { CameraPreview, ForwardMenu, MessageToReply } from './helpers/index';
import { IoMdHappy } from 'react-icons/io';
import AttachIcon from '../assets/svgs/Attach.js';
import Mic from '../assets/svgs/Mic';

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import { AnimatePresence } from 'framer-motion';

import AttachOptions from './helpers/AttachOptions';
import useCameraPreviewDimensions from '../hooks/CameraPreviewDimensions';

//----------------------------------------------//
export default function MessageInput({ chatHistoryRef }) {
  //State variables
  const [message, setMessage] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openContactsPicker, setOpenContactsPicker] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);

  const [imageUploading, setImageUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(false);
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

  if (focusInput) {
    setTimeout(() => {
      inputRef.current.focus();
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

  async function sendMessage(e) {
    e.preventDefault();
    setPhotoMode(false);
    setOpenEmojiPicker(false);
    if (messageToReply) {
      dispatch(CLEAR_REPLY_MESSAGE(currentChatName));
    }

    let mediaUrl = '';
    if (capturedImage) {
      setImageUploading(true);
      mediaUrl = await uploadImage();
      setCapturedImage('');
      setImageUploading(false);
    }

    await sendMessagetoDB(
      message,
      currentChatterEmail,
      currentUserName,
      currentChatName,
      setMessage,
      chatHistoryRef,
      messageToReply,
      mediaUrl,
    );
  }

  function onEmojiClick(_, emojiObject) {
    setMessage((prev) => prev + emojiObject.emoji);
    inputRef.current.focus();
  }

  function uploadImage() {
    // send image to DB
    return new Promise((resolve, reject) => {
      try {
        const storage = getStorage();
        const location = `whatsApp/media/images/${currentChatName}/${Date.now().toString()}`;
        const storageRef = ref(storage, location);
        uploadString(storageRef, capturedImage.split(',')[1], 'base64', {
          contentType: 'image/jpeg',
        }).then(() => {
          getDownloadURL(ref(storage, location)).then(async (url) => {
            resolve(url);
          });
        });
      } catch (err) {
        reject(err);
      }
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
      <div className="relative">
        <AnimatePresence>
          {photoMode && (
            <CameraPreview
              chatHistoryDimensions={chatHistoryDimensions}
              canvasRef={canvasRef}
              videoRef={videoRef}
              capturedImage={capturedImage}
              setCapturedImage={setCapturedImage}
              setPhotoMode={setPhotoMode}
            />
          )}
        </AnimatePresence>

        {/* EMOJI PICKER */}
        {openEmojiPicker && (
          <ClickAway onClickAway={() => setOpenEmojiPicker(false)}>
            <Picker
              pickerStyle={{ width: '100%' }}
              onEmojiClick={onEmojiClick}
            />
          </ClickAway>
        )}

        {/* MESSAGE TO REPLY */}
        <AnimatePresence>
          {messageToReply && <MessageToReply />}
        </AnimatePresence>

        {/* INPUT METHODS */}
        {(!photoMode || capturedImage) && (
          <form
            onSubmit={sendMessage}
            className={`flex px-4 h-16 border shadow-md bg-darkBG items-center ${
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
              {!capturedImage && <AttachIcon />}
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
              className="flex-1 px-4 py-2 rounded-full bg-whiteBG"
              placeholder="Type a message.."
              type="text"
            ></input>

            <button
              type="submit"
              disabled={!currentChatName}
              className="px-3 py-1"
            >
              <Mic />
            </button>
          </form>
        )}
      </div>
    )
  );
}
