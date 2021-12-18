import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import ContactsPicker from './ContactsPicker';
import ClickAway from '../hooks/ClickAway';
import {
  CameraPreview,
  ForwardMenu,
  MessageToReply,
} from '../minor-components/index';
import { AnimatePresence, motion } from 'framer-motion';
import MessageInfo from '../minor-components/MessageInfo';
import Form from '../minor-components/Form';

//----------------------------------------------//
export default function MessageInput() {
  //State variables
  const [message, setMessage] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openContactsPicker, setOpenContactsPicker] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);

  const [capturedImage, setCapturedImage] = useState('');
  const [blob, setBlob] = useState('');

  const inputRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();

  const currentChatName = useSelector(
    (state) => state?.chatState.currentChatName,
  );

  const messageInfo = useSelector((state) => state.chatState.messageInfo);
  // const userWaContacts = useSelector((state) => state.chatState.userWAContacts);

  const messageToReply =
    useSelector((state) => state?.chatState.messageToReply[currentChatName]) ||
    '';
  const focusInput = useSelector((state) => state?.chatState.focusInput);

  const windowWidth = useSelector((state) => state?.chatState.windowWidth);

  // forwarding messages
  const forwardMode = useSelector((state) => state?.chatState.forwardMode);

  if (focusInput) {
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 0);
  }

  //Side effects

  useEffect(() => {
    if (windowWidth >= 640) inputRef.current && inputRef.current.focus();
  }, [currentChatName, windowWidth]);

  function onEmojiClick(_, emojiObject) {
    setMessage((prev) => prev + emojiObject.emoji);
    inputRef.current.focus();
  }

  if (openContactsPicker) {
    return (
      <div className="px-4 bg-blue-500">
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
              className="absolute h-20 overflow-hidden bottom-16"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '350px', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ClickAway onClickAway={() => setOpenEmojiPicker(false)}>
                <Picker
                  pickerStyle={{ width: '100%', height: '350px' }}
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
          <div className="relative">
            <Form
              message={message}
              capturedImage={capturedImage}
              setPhotoMode={setPhotoMode}
              setOpenEmojiPicker={setOpenEmojiPicker}
              setMessage={setMessage}
              blob={blob}
              setCapturedImage={setCapturedImage}
              photoMode={photoMode}
              inputRef={inputRef}
            />
            <AnimatePresence>
              {messageInfo && windowWidth <= 1028 && (
                <motion.div
                  className="absolute block w-full p-1 overflow-hidden bg-blue-400 shadow-lg bottom-16 lg:hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: 'linear', duration: 0.2 }}
                >
                  <MessageInfo />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    )
  );
}
