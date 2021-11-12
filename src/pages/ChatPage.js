import React from 'react';
import Left from '../components/Left';
import Right from '../components/Right';

export default function ChatPage() {
  return (
    <div className="relative flex h-full px-10">
      <Left />
      <Right />
    </div>
  );
}
