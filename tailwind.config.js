module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        appBg: 'white',
        titleBg: 'white',
        contactBg: 'white',
        contactsEmptySpaceBg: 'white',
        contactSelectedBg: 'white',
        contactHoverBg: 'white',
        chatHistoryBg: 'white',
        sentChatBg: 'white',
        receivedChatBg: 'white',

        dim: '#f2f2f2',
        main: '#f7faf9',
        selected: '#00968814',
        icons: '#65676b',
        mutedText: 'black',
        dodgerblue: '#1877f2',
        flourescentGreen: '#09e85e',
        WaGreen: '#00bfa5',
        WaDarkGreen: '#009688',
        chatGreen: '#dcf8c6',
        dblTckBlue: '#30b6f6',
        whiteBG: '#ffffff',
        titleBG: '#ededed',
        dimBG: '#f6f6f6',
        hoverBG: '#f5f5f5',
        darkBG: '#ebebeb',
        chatBlue: '#e1f3fb',
        unreadBadgeGreen: '#06D755',
      },
      fontSize: {
        xxs: '.6rem',
      },
      spacing: {
        18: '72px',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled', 'hover'],
      cursor: ['disabled'],
      display: ['hover', 'group-hover'],
    },
  },
  plugins: [],
};
