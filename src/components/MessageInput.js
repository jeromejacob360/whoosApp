import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import ContactsPicker from './ContactsPicker';
import { CLEAR_REPLY_MESSAGE } from '../store/chatSlice';
import ClickAway from '../hooks/ClickAway';
import sendMessagetoDB from '../helpers/sendMessage';
import { CameraPreview, ForwardMenu, MessageToReply } from './helpers/index';
import { AiFillCamera, AiOutlineSend, AiOutlineSmile } from 'react-icons/ai';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import { AnimatePresence } from 'framer-motion';

import CircularProgress from '@mui/material/CircularProgress';

//----------------------------------------------//
export default function MessageInput({ chatHistoryRef }) {
  //State variables
  const [message, setMessage] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openContactsPicker, setOpenContactsPicker] = useState(false);
  const [cameraPreviewOn, setCameraPreviewOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState('');
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

  useEffect(() => {
    if (chatHistoryRef.current) {
      const h = chatHistoryRef.current.getBoundingClientRect().height + 'px';
      const tempW = chatHistoryRef.current.getBoundingClientRect().width6;
      const w = tempW ? tempW + 'px' : '100%';

      setChatHistoryDimensions({ height: h, width: w });
    }
  }, [chatHistoryRef]);

  useEffect(() => {
    let listener;
    if (chatHistoryRef.current) {
      listener = window.addEventListener('resize', () => {
        const clientHeight =
          chatHistoryRef.current.getBoundingClientRect().height + 'px';
        const clientWidth =
          chatHistoryRef.current.getBoundingClientRect().width + 'px';

        setChatHistoryDimensions({
          height: clientHeight,
          width: clientWidth,
        });
      });
    }
    return listener;
  }, [chatHistoryRef, currentChatName]);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [currentChatName]);

  async function sendMessage(e) {
    e.preventDefault();
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

  function openCamera() {
    setLoading(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        setCameraPreviewOn(true);
        const video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = video.play;
        setLoading(false);
      })
      .catch(function (err) {
        setLoading(false);
        console.log(err);
      });
  }

  function closeCamera() {
    if (videoRef.current) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setCameraPreviewOn(false);
    }
  }

  function retake() {
    setCapturedImage('');
    openCamera();
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
        {loading && (
          <div className="absolute" style={{ left: '.75rem', top: '.6rem' }}>
            <CircularProgress size={35} />
          </div>
        )}
        <AnimatePresence>
          {(cameraPreviewOn || capturedImage) && (
            <CameraPreview
              chatHistoryDimensions={chatHistoryDimensions}
              canvasRef={canvasRef}
              videoRef={videoRef}
              capturedImage={capturedImage}
              setCapturedImage={setCapturedImage}
              imageUploading={imageUploading}
              retake={retake}
              closeCamera={closeCamera}
            />
          )}
        </AnimatePresence>

        {/* Emoji picker */}
        {openEmojiPicker && (
          <ClickAway onClickAway={() => setOpenEmojiPicker(false)}>
            <Picker
              pickerStyle={{ width: '100%' }}
              onEmojiClick={onEmojiClick}
            />
          </ClickAway>
        )}
        <AnimatePresence>
          {messageToReply && <MessageToReply />}
        </AnimatePresence>

        {/* Input methods */}
        {!cameraPreviewOn && (
          <form
            onSubmit={sendMessage}
            className={`flex px-4 py-2 border shadow-md bg-main items-center ${
              !currentChatName && 'no-cursor'
            }`}
          >
            <div tabIndex="0" onClick={openCamera}>
              <AiFillCamera className={`w-6 h-6 mr-4`} />
            </div>
            <input
              ref={inputRef}
              disabled={!currentChatName}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-1 border rounded-full"
              placeholder="Type a message.."
              type="text"
            ></input>
            <span
              onClick={() => setOpenEmojiPicker((prev) => !prev)}
              className={`px-2 py-1`}
            >
              <AiOutlineSmile className="w-6 h-6" />
            </span>

            <button
              type="submit"
              disabled={!currentChatName}
              className="px-3 py-1"
            >
              <AiOutlineSend className="w-6 h-6" />
            </button>
          </form>
        )}
      </div>
    )
  );
}
