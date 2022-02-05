import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
// import { AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { IoMdHappy } from 'react-icons/io';
// import { MdOutlineAttachFile } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import sendMessagetoDB from '../helper-functions/sendMessage';
import {
  ADD_MESSAGE,
  CLEAR_REPLY_MESSAGE,
  MESSAGE_SENT,
  REMOVE_UPLOAD_PROGRESS,
  SET_UPLOAD_PROGRESS,
  UPLOAD_STARTED,
} from '../store/chatSlice';
// import AttachOptions from './AttachOptions';

let newMessage;

export default function Form({
  message,
  capturedImage,
  setPhotoMode,
  setOpenEmojiPicker,
  setMessage,
  blob,
  setCapturedImage,
  photoMode,
  inputRef,
}) {
  // const [attachOptions, setAttachOptions] = useState(false);

  const dispatch = useDispatch();

  //Access the store
  const currentChatName = useSelector(
    (state) => state?.chatState.currentChatName,
  );

  const messageInfo = useSelector((state) => state.chatState.messageInfo);
  // const userWaContacts = useSelector((state) => state.chatState.userWAContacts);

  const messageToReply =
    useSelector((state) => state?.chatState.messageToReply[currentChatName]) ||
    '';

  const currentUserEmail = useSelector((state) => state?.authState.user?.email);
  const currentChatterEmail = useSelector(
    (state) => state?.chatState.currentChatterEmail,
  );
  const currentUserName = useSelector((state) => state?.authState.user.email);

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
      status: '',
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

    setMessage('');

    if (capturedImage) {
      mediaUrl = await uploadToDb();
      setCapturedImage('');
    }

    sendMessagetoDB({
      newMessage: { ...newMessage, mediaUrl },
      currentChatName,
      mutualChat: false,
    }).then((sentMessage) => {
      dispatch(
        MESSAGE_SENT({ chatName: currentChatName, message: sentMessage }),
      );
    });
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

  return (
    <form
      onSubmit={sendMessage}
      className={`flex rounded-bl-xl sm:rounded-bl-none px-4 h-16 shadow-2xl ${
        !messageInfo && 'rounded-br-md'
      } bg-blue-100 items-center ${!currentChatName && 'no-cursor'}`}
    >
      <span
        onClick={() => setOpenEmojiPicker((prev) => !prev)}
        className={`px-2 py-1`}
      >
        <IoMdHappy className="w-6 h-6 mr-2" />
      </span>

      {/* <div className="relative mr-4" onClick={() => setAttachOptions(true)}>
        {!photoMode && <MdOutlineAttachFile size={25} />}
        <AnimatePresence>
          {attachOptions && (
            <AttachOptions
              setPhotoMode={setPhotoMode}
              setAttachOptions={setAttachOptions}
            />
          )}
        </AnimatePresence>
      </div> */}
      <input
        ref={inputRef}
        disabled={!currentChatName}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 py-2 bg-white outline-none rounded-xl"
        placeholder="Message"
        type="text"
        style={{ minWidth: '20px' }}
      />

      <button type="submit" disabled={!currentChatName} className="px-3 py-1">
        <BiSend size={25} className="text-gray-600" />
      </button>
    </form>
  );
}
