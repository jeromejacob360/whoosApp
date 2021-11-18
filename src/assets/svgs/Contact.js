import React from 'react';

export default function Contact() {
  return (
    <svg
      style={{ filter: 'drop-shadow( 2px 4px 4px rgba(0, 0, 0, .7))' }}
      viewBox="0 0 53 53"
      width="53"
      height="53"
    >
      <defs>
        <circle id="contact-SVGID_1_" cx="26.5" cy="26.5" r="25.5"></circle>
      </defs>
      <clipPath id="contact-SVGID_2_">
        <use xlinkHref="#contact-SVGID_1_" overflow="visible"></use>
      </clipPath>
      <g clipPath="url(#contact-SVGID_2_)">
        <path
          fill="#0795DC"
          d="M26.5-1.1C11.9-1.1-1.1 5.6-1.1 27.6h55.2c-.1-19-13-28.7-27.6-28.7z"
        ></path>
        <path
          fill="#0EABF4"
          d="M53 26.5H-1.1c0 14.6 13 27.6 27.6 27.6s27.6-13 27.6-27.6H53z"
        ></path>
      </g>
      <g fill="#F5F5F5">
        <path
          id="svg-contact"
          d="M26.5 26.5A4.5 4.5 0 0 0 31 22a4.5 4.5 0 0 0-4.5-4.5A4.5 4.5 0 0 0 22 22a4.5 4.5 0 0 0 4.5 4.5zm0 2.25c-3.004 0-9 1.508-9 4.5v1.125c0 .619.506 1.125 1.125 1.125h15.75c.619 0 1.125-.506 1.125-1.125V33.25c0-2.992-5.996-4.5-9-4.5z"
        ></path>
      </g>
    </svg>
  );
}
