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
      },
      fontSize: {
        xxs: '.6rem',
      },
      spacing: {
        18: '72px',
      },
      screens: {
        xs: '420px',
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['active'],
      opacity: ['disabled', 'hover'],
      cursor: ['disabled'],
      display: ['hover', 'group-hover'],
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
