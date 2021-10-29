import { createSlice } from "@reduxjs/toolkit";
import { chatNameGenerator } from "../helpers/formatters";

const initialState = {
  contacts: [],
  chats: {},
  messages: {},
  currentChatName: "",
  userContacts: "",
  currentChatterEmail: "",
  chatNames: "",
  chatHistoryRef: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    SET_USER_CONTACTS: (state, action) => {
      state.userContacts = action.payload;
    },

    SET_CURRENT_CHAT: (state, action) => {
      const { currentUserEmail, currentChatterEmail } = action.payload;
      const currentChatName = chatNameGenerator(
        currentUserEmail,
        currentChatterEmail
      );
      state.currentChatName = currentChatName;
      state.currentChatterEmail = currentChatterEmail;
    },

    ADD_CHATNAMES: (state, action) => {
      state.chatNames = action.payload;
    },

    //manage messaging

    ADD_MESSAGE: (state, action) => {
      const { chatName, message } = action.payload;
      state.chats[chatName]
        ? state.chats[chatName].push(message)
        : (state.chats[chatName] = [message]);
    },

    CHAT_HISTORY_REF: (state, action) => {
      state.chatHistoryRef = action.payload;
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
  ADD_CHATNAMES,
  CLEAR_STATE,
  ADD_MESSAGE,
  CHAT_HISTORY_REF,
} = chatSlice.actions;

export default chatSlice.reducer;
