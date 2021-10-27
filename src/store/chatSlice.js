import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
  chats: [],
  messages: {},
  currentChatName: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    ADD_CONTACT: (state, action) => {
      action.payload.forEach((contact) => {
        state.contacts.push(contact);
      });
    },

    EDIT_CONTACT: (state, action) => {
      return {
        ...state,
        contacts: state.contacts.map((contact) => {
          if (contact.email === action.payload.email) return action.payload;
          else return contact;
        }),
      };
    },

    REMOVE_CONTACT: (state, action) => {
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact.email !== action.payload.email
        ),
      };
    },

    SET_CURRENT_CHAT: (state, action) => {
      const { currentChatterEmail, currentUserEmail } = action.payload;

      const currentChatName = [currentChatterEmail, currentUserEmail]
        .sort()
        .join("");

      state.currentChatName = currentChatName;
    },

    SET_CURRENT_CHATTER: (state, action) => {
      state.currentChatterName = action.payload;
    },

    ADD_MESSAGE: (state, action) => {
      const { chatName, message } = action.payload;
      state.messages[chatName]
        ? state.messages[chatName].push(message)
        : (state.messages[chatName] = [message]);
    },

    UPDATE_MESSAGE: (state, action) => {
      const { chatName, newMessage } = action.payload;

      state.messages[chatName] = state.messages[chatName].map((message) =>
        message.time === newMessage.time ? newMessage : message
      );
    },

    SET_CHATS: (state, action) => {
      state.chats = action.payload;
    },

    NEW_USER: (state) => ({
      contacts: [],
      chats: [],
      messages: {},
      currentChatName: "",
    }),
  },
});

// Action creators are generated for each case reducer function
export const {
  ADD_CONTACT,
  REMOVE_CONTACT,
  EDIT_CONTACT,
  SET_CURRENT_CHAT,
  ADD_MESSAGE,
  SET_CHATS,
  NEW_USER,
  UPDATE_MESSAGE,
  SET_CURRENT_CHATTER,
} = chatSlice.actions;

export default chatSlice.reducer;
