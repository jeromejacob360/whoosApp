import React from 'react';

export default function Camera() {
  return (
    <svg
      style={{ filter: 'drop-shadow( 2px 4px 4px rgba(0, 0, 0, .7))' }}
      viewBox="0 0 53 53"
      width="53"
      height="53"
    >
      <defs>
        <circle id="camera-SVGID_1_" cx="26.5" cy="26.5" r="25.5"></circle>
      </defs>
      <clipPath id="camera-SVGID_2_">
        <use xlinkHref="#camera-SVGID_1_" overflow="visible"></use>
      </clipPath>
      <g clipPath="url(#camera-SVGID_2_)">
        <path
          fill="#D3396D"
          d="M26.5-1.1C11.9-1.1-1.1 5.6-1.1 27.6h55.2c-.1-19-13-28.7-27.6-28.7z"
        ></path>
        <path
          fill="#EC407A"
          d="M53 26.5H-1.1c0 14.6 13 27.6 27.6 27.6s27.6-13 27.6-27.6H53z"
        ></path>
        <path fill="#D3396D" d="M17 24.5h15v9H17z"></path>
      </g>
      <g fill="#F5F5F5">
        <path
          id="svg-camera"
          d="M27.795 17a3 3 0 0 1 2.405 1.206l.3.403a3 3 0 0 0 2.405 1.206H34.2a2.8 2.8 0 0 1 2.8 2.8V32a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4v-9.385a2.8 2.8 0 0 1 2.8-2.8h1.295a3 3 0 0 0 2.405-1.206l.3-.403A3 3 0 0 1 25.205 17h2.59zM26.5 22.25a5.25 5.25 0 1 0 .001 10.501A5.25 5.25 0 0 0 26.5 22.25zm0 1.75a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z"
        ></path>
      </g>
    </svg>
  );
}
