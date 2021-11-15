import React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

export default function FullScreenLoadingIndicator() {
  return (
    <div className="fixed inset-0 grid w-screen h-screen bg-white place-items-center bg-opacity-80">
      <AiOutlineLoading className="w-12 h-12 spin" />
    </div>
  );
}
