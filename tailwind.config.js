module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        dim: '#f2f2f2',
        main: '#f7faf9',
        selected: '#e4e6eb',
        icons: '#65676b',
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
        introBG: '#f8f9fa',
        chatBlue: '#e1f3fb',
      },
      fontSize: {
        xxs: '.6rem',
      },
      display: ['group-hover'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled', 'hover'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
};
