import { createSlice } from '@reduxjs/toolkit';
import { chatNameGenerator } from '../helpers/formatters';

const initialState = {
  chats: {},
  currentChatName: '',
  userContacts: '',
  currentChatterEmail: '',
  chatNames: '',
  userWAContacts: '',
  messageToReply: '',
  focusInput: false,
  namelessChats: [],
  unreadMessages: {},
  forwardMode: false,
  selectedMessages: {},
  totalSelectedMessages: 0,
};

function calculateForwardMessagesLength(state) {
  return Object.keys(state.selectedMessages).length;
}

export const chatSlice = createSlice({
  name: 'CHATSLICE',
  initialState,
  reducers: {
    SET_USER_CONTACTS: (state, action) => {
      state.userContacts = action.payload;
    },

    UPDATE_USER_CONTACTS: (state, action) => {
      state.userContacts = state.userContacts.map((contact) =>
        contact.email === action.payload.email ? action.payload : contact,
      );
    },

    REMOVE_USER_CONTACT: (state, action) => {
      console.log('REMOVE USER CONTACT');
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
      const { currentUserEmail, currentChatterEmail, contactName } =
        action.payload;
      const currentChatName = chatNameGenerator(
        currentUserEmail,
        currentChatterEmail,
      );
      state.currentChatName = currentChatName;
      state.currentChatterEmail = currentChatterEmail;
      state.currentChatterName = contactName;
    },

    CLEAR_CURRENT_CHAT: (state) => {
      state.currentChatName = '';
    },

    ADD_CHATNAMES: (state, action) => {
      state.chatNames = action.payload;
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
      const { chatName, message } = action.payload;
      state.chats[chatName]
        ? state.chats[chatName].push(message)
        : (state.chats[chatName] = [message]);

      if (chatName !== state.currentChatName) {
        state.unreadMessages[chatName]
          ? state.unreadMessages[chatName]++
          : (state.unreadMessages[chatName] = 1);
      }
    },

    DELETE_MESSAGE: (state, action) => {
      const { chatName, message } = action.payload;
      state.chats[chatName] = state.chats[chatName].filter(
        (chat) => chat.time !== message.time,
      );
    },

    MODIFY_MESSAGE: (state, action) => {
      const { chatName, message } = action.payload;
      state.chats[chatName] = state.chats[chatName].map((chat) =>
        chat.time === message.time ? message : chat,
      );
    },

    CLEAR_UNREAD_MESSAGES: (state) => {
      state.unreadMessages[state.currentChatName] = 0;
    },

    REPLY: (state, action) => {
      const { message: messageObject, currentChatName } = action.payload;
      const messageText = messageObject.message;

      const trimmedMessage =
        messageText.length > 20
          ? messageText.substring(0, 20) + '...'
          : messageText;

      const messageToReply = { ...messageObject, message: trimmedMessage };

      state.messageToReply = {
        ...state.messageToReply,
        [currentChatName]: messageToReply,
      };
      state.focusInput = true;
    },

    CLEAR_REPLY_MESSAGE: (state, action) => {
      const currentChatName = action.payload;
      state.messageToReply[currentChatName] = ''; //TODO remote the key from the object
      state.focusInput = false;
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
      state.selectedMessages[time] = action.payload.message;
      state.totalSelectedMessages = calculateForwardMessagesLength(state);
    },

    REMOVE_MESSAGE_TO_FORWARDS: (state, action) => {
      const { time } = action.payload;
      delete state.selectedMessages[time];
      state.totalSelectedMessages = calculateForwardMessagesLength(state);
    },

    CLEAR_STATE: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function

export const {
  SET_USER_CONTACTS,
  SET_CURRENT_CHAT,
  CLEAR_CURRENT_CHAT,
  CLEAR_UNREAD_MESSAGES,
  ADD_CHATNAMES,
  CLEAR_STATE,
  SET_USERS_WA_CONTACTS,
  ADD_MESSAGE,
  MODIFY_MESSAGE,
  DELETE_MESSAGE,
  CHAT_HISTORY_REF,
  REPLY,
  CLEAR_REPLY_MESSAGE,
  NAMELESS_CHAT,
  REMOVE_NAMELESS_CHAT,
  REMOVE_USER_CONTACT,
  UPDATE_USER_CONTACTS,
  FORWARD_MODE_ON,
  FORWARD_MODE_OFF,
  ADD_MESSAGE_TO_FORWARDS,
  REMOVE_MESSAGE_TO_FORWARDS,
} = chatSlice.actions;

export default chatSlice.reducer;
