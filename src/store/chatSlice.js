import { createSlice } from '@reduxjs/toolkit';
import { chatNameGenerator } from '../helpers/formatters';
import { textTrimmer } from '../helpers/formatters';

const initialState = {
  chats: {},
  currentChatName: '',
  userContacts: '',
  currentChatterEmail: '',
  currentChatterName: '',
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
      const { chatName, message, currentUserEmail } = action.payload;

      //push message to state
      state.chats[chatName]
        ? state.chats[chatName].push(message)
        : (state.chats[chatName] = [message]);

      //set last message of that chat
      state.lastMessages[chatName] = message;

      // add to unread messages count
      if (
        chatName !== state.currentChatName &&
        message.from !== action.payload.currentUserEmail &&
        !message.deletedForMe.includes(currentUserEmail)
      ) {
        state.unreadMessages[chatName]
          ? state.unreadMessages[chatName]++
          : (state.unreadMessages[chatName] = 1);
      }

      const userWAContacts = state.userWAContacts;

      if (userWAContacts.length > 1) {
        //sort contacts list

        //find the chat in the contacts list
        const senderEmail = chatName.replace(currentUserEmail, '');
        let indexOfContact;
        userWAContacts.forEach((contact, index) => {
          if (contact.email === senderEmail) {
            indexOfContact = index;
            return;
          }
        });

        //sort!
        const firstContact = userWAContacts[indexOfContact];
        userWAContacts.splice(indexOfContact, 1);
        userWAContacts.unshift(firstContact);
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
      state.messageToReply[currentChatName] = '';
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
      state.totalSelectedMessages = 0;
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
