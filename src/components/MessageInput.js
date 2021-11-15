import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import ContactsPicker from './ContactsPicker';
import { CLEAR_REPLY_MESSAGE } from '../store/chatSlice';
import ClickAway from '../hooks/ClickAway';
import sendMessagetoDB from '../helpers/sendMessage';
import {
  FullScreenLoadingIndicator,
  CameraPreview,
  ForwardMenu,
  MessageToReply,
  CapturedImagePreview,
} from './helpers/index';
import { AiFillCamera, AiOutlineSend, AiOutlineSmile } from 'react-icons/ai';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';

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
    inputRef.current.focus();
  }

  //Side effects
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
        setLoading(false);
        setCameraPreviewOn(true);
        const video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = video.play;
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
        {loading && <FullScreenLoadingIndicator />}

        {cameraPreviewOn && (
          <CameraPreview
            closeCamera={closeCamera}
            capturedImage={capturedImage}
            canvasRef={canvasRef}
            videoRef={videoRef}
            setCapturedImage={setCapturedImage}
          />
        )}

        {/* Emoji picker */}
        {openEmojiPicker && (
          <ClickAway onClickAway={() => setOpenEmojiPicker(false)}>
            <Picker
              pickerStyle={{ width: '100%' }}
              onEmojiClick={onEmojiClick}
            />
          </ClickAway>
        )}

        {messageToReply && <MessageToReply />}

        {capturedImage && (
          <CapturedImagePreview
            capturedImage={capturedImage}
            setCapturedImage={setCapturedImage}
            imageUploading={imageUploading}
            retake={retake}
          />
        )}

        {/* Input methods */}
        <form
          onSubmit={sendMessage}
          className={`flex px-4 py-2 border shadow-md bg-main items-center ${
            !currentChatName && 'no-cursor'
          }`}
        >
          <AiFillCamera onClick={openCamera} className={`w-6 h-6 mr-4`} />
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
      </div>
    )
  );
}
