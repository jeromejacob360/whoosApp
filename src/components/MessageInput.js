import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as CloseIcon } from '../assets/icons/closeSVG.svg';
import Picker from 'emoji-picker-react';
import ContactsPicker from './ContactsPicker';
import { CLEAR_REPLY_MESSAGE, FORWARD_MODE_OFF } from '../store/chatSlice';
import sendMessagetoDB from '../helpers/sendMessage';
import ClickAway from '../hooks/ClickAway';

import {
  AiFillStar,
  AiFillDelete,
  AiOutlineClose,
  AiFillCamera,
  AiOutlineSend,
  AiOutlineSmile,
  AiOutlineCloseCircle,
  AiOutlineLoading,
  AiOutlineCamera,
} from 'react-icons/ai';
import { RiShareForwardFill } from 'react-icons/ri';
import { BiUndo } from 'react-icons/bi';
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

  function openContactsPickerForForwarding() {
    setOpenContactsPicker(true);
  }
  async function sendMessage(e) {
    e.preventDefault();
    setOpenEmojiPicker(false);
    if (messageToReply) {
      dispatch(CLEAR_REPLY_MESSAGE(currentChatName));
    }

    await sendMessagetoDB(
      message,
      currentChatterEmail,
      currentUserName,
      currentChatName,
      setMessage,
      chatHistoryRef,
      messageToReply,
    );
  }

  function onEmojiClick(event, emojiObject) {
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

  function captureImage() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL());
    closeCamera();
  }

  function closeCamera() {
    if (videoRef.current) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setCameraPreviewOn(false);
    }
  }

  function terminateImageSending() {
    setCapturedImage('');
    closeCamera();
  }

  function retake() {
    setCapturedImage('');
    openCamera();
  }

  function sendImage() {
    // send image to DB
    console.log('Uploading');
    const storage = getStorage();
    const location = `whatsApp/media/images/${currentChatName}/${Date.now().toString()}`;
    const storageRef = ref(storage, location);
    uploadString(storageRef, capturedImage.split(',')[1], 'base64', {
      contentType: 'image/jpeg',
    }).then(() => {
      console.log('Uploaded');
      getDownloadURL(ref(storage, location)).then(async (url) => {
        await sendMessagetoDB(
          message,
          currentChatterEmail,
          currentUserName,
          currentChatName,
          setMessage,
          chatHistoryRef,
          messageToReply,
          url,
        );
        console.log('MESSAGE SENT');
        terminateImageSending();
      });
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
    return (
      <div className="px-4 bg-selected">
        <div className="flex items-center justify-between h-10 px-10">
          <button onClick={() => dispatch(FORWARD_MODE_OFF())}>
            <AiOutlineClose className="w-6 h-6" />
          </button>
          <span>{totalSelectedMessages} selected</span>
          <div className="space-x-6">
            <button>
              <AiFillStar className="w-6 h-6" />
            </button>
            <button>
              <AiFillDelete className="w-6 h-6" />
            </button>
            <button onClick={openContactsPickerForForwarding}>
              <RiShareForwardFill className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    currentChatName && (
      <div className="relative">
        {/* loading indicator */}
        {loading && (
          <div className="fixed inset-0 grid w-screen h-screen bg-white place-items-center bg-opacity-80">
            <AiOutlineLoading className="w-12 h-12 spin" />
          </div>
        )}

        {(capturedImage || cameraPreviewOn) && (
          <div className="fixed inset-0 grid w-screen h-screen bg-white place-items-center bg-opacity-80">
            <ClickAway onClickAway={closeCamera}>
              <div className="max-w-xl">
                <div className="flex items-center justify-end h-10 bg-blue-400">
                  {capturedImage && (
                    <button
                      onClick={retake}
                      className="flex items-center text-white"
                    >
                      <BiUndo className="w-6 h-6 mr-2 text-white" />
                      <span>Retake</span>
                    </button>
                  )}
                  <AiOutlineCloseCircle
                    onClick={terminateImageSending}
                    className="w-6 h-6 ml-8 mr-4 text-white"
                  />
                </div>
                {/* Camera feed */}
                {cameraPreviewOn && (
                  <video
                    ref={videoRef}
                    src=""
                    className="w-full h-auto"
                  ></video>
                )}
                {/* View the captured image */}
                <canvas
                  className={`w-full h-auto ${
                    capturedImage
                      ? 'opacity-100'
                      : 'opacity-0 w-0 h-0 fixed -bottom-full -top-full'
                  }`}
                  ref={canvasRef}
                ></canvas>
                <div className="flex items-center h-10 bg-blue-400">
                  <button className="z-10 ml-auto mr-2">
                    {capturedImage ? (
                      <AiOutlineSend
                        onClick={sendImage}
                        className="w-16 h-16 p-2 mb-10 text-yellow-500 rounded-full shadow-lg cursor-pointer bg-dim"
                      />
                    ) : (
                      <AiOutlineCamera
                        onClick={captureImage}
                        className="w-16 h-16 p-2 mb-10 text-yellow-500 rounded-full shadow-lg cursor-pointer bg-dim"
                      />
                    )}
                  </button>
                </div>
              </div>
            </ClickAway>
          </div>
        )}
        {/* Emoji picker */}
        {currentChatName && openEmojiPicker && (
          <ClickAway onClickAway={() => setOpenEmojiPicker(false)}>
            <Picker
              pickerStyle={{ width: '100%' }}
              onEmojiClick={onEmojiClick}
            />
          </ClickAway>
        )}
        {/* Message to reply */}
        {messageToReply && (
          <div className="relative w-full p-2 pt-6 rounded-md rounded-bl-none rounded-br-none cursor-pointer bg-main">
            <CloseIcon
              onClick={() => dispatch(CLEAR_REPLY_MESSAGE(currentChatName))}
              className="absolute w-4 h-4 top-1 right-4"
            />
            <div className="py-1 pl-2 border-l-8 border-yellow-700 rounded-md bg-dim">
              {messageToReply.mediaUrl ? (
                <div>
                  <span>Photo</span>
                  <img className="h-8 " src={messageToReply.mediaUrl} alt="" />
                </div>
              ) : (
                <span> {messageToReply.message}</span>
              )}
            </div>
          </div>
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
