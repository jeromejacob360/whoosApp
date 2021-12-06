import React from 'react';
import Contacts from './Contacts';
import Header from './Header';

export default function Left() {
  return (
    <div
      className="z-10 border-r shadow-lg rounded-bl-md rounded-tl-md bg-blue-50"
      style={{ minWidth: '350px' }}
    >
      <Header />
      {/* <Search /> */}
      <Contacts />
    </div>
  );
}
