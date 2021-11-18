import React from 'react';

export default function Document() {
  return (
    <svg
      style={{ filter: 'drop-shadow( 2px 4px 4px rgba(0, 0, 0, .7))' }}
      viewBox="0 0 53 53"
      width="53"
      height="53"
    >
      <defs>
        <circle id="document-SVGID_1_" cx="26.5" cy="26.5" r="25.5"></circle>
      </defs>
      <clipPath id="document-SVGID_2_">
        <use xlinkHref="#document-SVGID_1_" overflow="visible"></use>
      </clipPath>
      <g clipPath="url(#document-SVGID_2_)">
        <path
          fill="#5157AE"
          d="M26.5-1.1C11.9-1.1-1.1 5.6-1.1 27.6h55.2c-.1-19-13-28.7-27.6-28.7z"
        ></path>
        <path
          fill="#5F66CD"
          d="M53 26.5H-1.1c0 14.6 13 27.6 27.6 27.6s27.6-13 27.6-27.6H53z"
        ></path>
      </g>
      <g fill="#F5F5F5">
        <path
          id="svg-document"
          d="M29.09 17.09c-.38-.38-.89-.59-1.42-.59H20.5c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H32.5c1.1 0 2-.9 2-2V23.33c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM27.5 22.5V18l5.5 5.5h-4.5c-.55 0-1-.45-1-1z"
        ></path>
      </g>
    </svg>
  );
}
