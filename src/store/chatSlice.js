import { doc, getDoc, setDoc } from '@firebase/firestore';
import { createSlice } from '@reduxjs/toolkit';
import { db } from '../firebase/firebase';
import { chatNameGenerator } from '../helper-functions/formatters';
import { textTrimmer } from '../helper-functions/formatters';

const initialState = {
  chats: {},
  currentChatName: '',
  userContacts: '',
  currentChatterEmail: '',
  currentChatterName: '',
  currentUserAvatar: '',
  chatNames: '',
  userWAContacts: '',
  messageToReply: '',
  focusInput: false,
  namelessChats: [],
  unreadMessages: {},
  forwardMode: false,
  selectedMessages: {},
  totalSelectedMessages: 0,
  sortedWAContactNames: [],
  lastMessages: {},
  progress: {},
  pageRendered: false,
  messageInfo: '',
  windowWidth: 0,
  chatHistoryRef: '',
  invitees: {},
};

function calculateForwardMessagesLength(state) {
  return Object.keys(state.selectedMessages).length;
}

export const chatSlice = createSlice({
  name: 'CHATSLICE',
  initialState,
  reducers: {
    PAGE_RENDERED: (state) => {
      state.pageRendered = true;
    },

    PAGE_LOADING: (state) => {
      state.pageRendered = false;
    },

    SET_USER_CONTACTS: (state, action) => {
      state.userContacts = action.payload;
    },

    UPDATE_USER_CONTACTS: (state, action) => {
      state.userContacts = state.userContacts.map((contact) =>
        contact.email === action.payload.email ? action.payload : contact,
      );
    },

    REMOVE_USER_CONTACT: (state, action) => {
      const { deletedContact } = action.payload;

      state.userContacts = state.userContacts.filter(
        (contact) => contact.email !== deletedContact.email,
      );
      state.userWAContacts = state.userWAContacts.filter(
        (contact) => contact.email !== deletedContact.email,
      );
    },

    SET_USERS_WA_CONTACTS: (state, action) => {
      state.userWAContacts = action.payload;
    },

    SET_CURRENT_CHAT: (state, action) => {
      const { currentUserEmail, currentChatterEmail, senderName, avatar } =
        action.payload;

      const currentChatName = chatNameGenerator(
        currentUserEmail,
        currentChatterEmail,
      );
      state.currentChatName = currentChatName;
      state.currentChatterEmail = currentChatterEmail;
      state.currentChatterName = senderName;
      state.currentUserAvatar = avatar;
    },

    CLEAR_CURRENT_CHAT: (state) => {
      state.currentChatName = '';
    },

    ADD_CHATNAMES: (state, action) => {
      state.chatNames = action.payload;
    },

    ADD_TO_INVITEES: (state, action) => {
      const { email } = action.payload;
      state.invitees[email] = action.payload;
    },

    NAMELESS_CHAT: (state, action) => {
      state.namelessChats.push(action.payload);
    },

    REMOVE_NAMELESS_CHAT: (state, action) => {
      const chatName = action.payload;
      const namelessChats = state.namelessChats;

      const index = namelessChats.indexOf(chatName);
      if (index > -1) {
        namelessChats.splice(index, 1);
      }

      state.namelessChats = namelessChats;
    },

    //manage messaging

    ADD_MESSAGE: (state, action) => {
      const { chatName, message, currentUserEmail, from } = action.payload;

      const chatterEmail = chatName.split(currentUserEmail).join('');
      if (!state.userWAContacts) return;
      state.userWAContacts = state.userWAContacts.map((contact) => {
        if (contact.email === chatterEmail) {
          return {
            ...contact,
            lastMessageTime: message.time,
          };
        } else
          return contact.lastMessageTime
            ? contact
            : { ...contact, lastMessageTime: 0 };
      });

      state.userWAContacts = state.userWAContacts.sort((a, b) => {
        if (a.lastMessageTime > b.lastMessageTime) return -1;
        if (a.lastMessageTime < b.lastMessageTime) return 1;
        return 0;
      });

      if (from === 'server' && message.from !== currentUserEmail) {
        const q = doc(
          db,
          `whatsApp/chats/${chatName}/${message.time.toString()}`,
        );
        getDoc(q).then((document) => {
          if (document.exists) {
            if (document.data().status === 'sent') {
              setDoc(
                document.ref,
                { status: 'delivered', deliveredTime: Date.now() },
                { merge: true },
              );
            }
          }
        });
      }

      const chat = state.chats[chatName];
      if (chat)
        for (let i = chat.length - 1; i >= 0; i--) {
          const existingMessage = chat[i];
          if (existingMessage.time === message.time) {
            return;
          }
        }

      //set last message of that chat
      state.lastMessages[chatName] = message;

      // add to unread messages count
      if (
        chatName !== state.currentChatName &&
        message.from !== action.payload.currentUserEmail &&
        !message.deletedForMe.includes(currentUserEmail) &&
        message.status !== 'read'
      ) {
        state.unreadMessages[chatName]
          ? state.unreadMessages[chatName]++
          : (state.unreadMessages[chatName] = 1);
      }

      //push message to state
      state.chats[chatName]
        ? state.chats[chatName].push(message)
        : (state.chats[chatName] = [message]);

      state.chats[chatName] = state.chats[chatName].sort((a, b) => {
        return a.time - b.time;
      });
    },

    MESSAGE_SENT: (state, action) => {
      const { chatName, message } = action.payload;

      const chat = state.chats[chatName];
      if (chat)
        for (let i = chat.length - 1; i >= 0; i--) {
          const existingMessage = chat[i];
          if (existingMessage.time === message.time) {
            existingMessage.status = 'sent';
            return;
          }
        }
    },

    UPLOAD_STARTED: (state, action) => {
      const { chatName, id } = action.payload;

      if (state.progress[chatName]) {
        state.progress[chatName][id] = -1;
      } else {
        state.progress[chatName] = {};
        state.progress[chatName][id] = -1;
      }
    },
    SET_UPLOAD_PROGRESS: (state, action) => {
      const { chatName, id, progress } = action.payload;

      state.progress[chatName][id] = progress;
    },

    REMOVE_UPLOAD_PROGRESS: (state, action) => {
      const { chatName, id } = action.payload;
      if (state.progress[chatName]) {
        if (state.progress[chatName][id]) {
          delete state.progress[chatName][id];
        }
      }
    },

    WINDOW_RESIZE: (state, action) => {
      const { width } = action.payload;
      state.windowWidth = width;
    },

    CHAT_HISTORY_REF: (state, action) => {
      state.chatHistoryRef = action.payload;
    },

    DELETE_MESSAGE: (state, action) => {
      const { chatName, message } = action.payload;
      state.chats[chatName] = state.chats[chatName].filter(
        (chat) => chat.time !== message.time,
      );
    },

    MODIFY_MESSAGE: (state, action) => {
      const { chatName, message } = action.payload;
      state.chats[chatName] = state.chats[chatName]?.map((chat) =>
        chat.time === message.time ? message : chat,
      );
    },

    CLEAR_UNREAD_MESSAGES: (state) => {
      state.unreadMessages[state.currentChatName] = 0;
    },

    REPLY: (state, action) => {
      const { message: messageObject } = action.payload;
      const currentChatName = state.currentChatName;
      const messageText = messageObject.message;

      const trimmedMessage = textTrimmer(messageText);

      const messageToReply = { ...messageObject, message: trimmedMessage };

      state.messageToReply = {
        ...state.messageToReply,
        [currentChatName]: messageToReply,
      };
      state.focusInput = true;
    },

    CLEAR_REPLY_MESSAGE: (state) => {
      const currentChatName = state.currentChatName;
      if (state.messageToReply) state.messageToReply[currentChatName] = '';
      state.focusInput = false;
    },

    MESSAGE_INFO: (state, action) => {
      state.messageInfo = action.payload;
    },

    CLEAR_MESSAGE_INFO: (state) => {
      state.messageInfo = '';
    },

    //forwarding messages

    FORWARD_MODE_ON: (state) => {
      state.forwardMode = true;
    },

    FORWARD_MODE_OFF: (state) => {
      state.forwardMode = false;
      state.selectedMessages = {};
      state.totalSelectedMessages = 0;
    },

    ADD_MESSAGE_TO_FORWARDS: (state, action) => {
      const { time } = action.payload;
      state.selectedMessages[time] = action.payload;
      state.totalSelectedMessages = calculateForwardMessagesLength(state);
    },

    REMOVE_MESSAGE_TO_FORWARDS: (state, action) => {
      const { time } = action.payload;
      delete state.selectedMessages[time];
      state.totalSelectedMessages = 0;
    },

    CLEAR_STATE: (state) => {
      return { ...initialState, pageRendered: state.pageRendered };
    },
  },
});

export const {
  PAGE_RENDERED,
  PAGE_LOADING,
  SET_USER_CONTACTS,
  SET_CURRENT_CHAT,
  CLEAR_CURRENT_CHAT,
  CLEAR_UNREAD_MESSAGES,
  ADD_CHATNAMES,
  CLEAR_STATE,
  SET_USERS_WA_CONTACTS,
  ADD_MESSAGE,
  MESSAGE_SENT,
  UPLOAD_STARTED,
  SET_UPLOAD_PROGRESS,
  REMOVE_UPLOAD_PROGRESS,
  MODIFY_MESSAGE,
  DELETE_MESSAGE,
  CHAT_HISTORY_REF,
  REPLY,
  WINDOW_RESIZE,
  MESSAGE_INFO,
  CLEAR_MESSAGE_INFO,
  CLEAR_REPLY_MESSAGE,
  NAMELESS_CHAT,
  REMOVE_NAMELESS_CHAT,
  REMOVE_USER_CONTACT,
  UPDATE_USER_CONTACTS,
  FORWARD_MODE_ON,
  FORWARD_MODE_OFF,
  ADD_MESSAGE_TO_FORWARDS,
  REMOVE_MESSAGE_TO_FORWARDS,
  ADD_TO_INVITEES,
} = chatSlice.actions;

export default chatSlice.reducer;
