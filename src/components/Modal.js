import React from 'react';
import ClickAway from '../hooks/ClickAway';

export default function Modal({ onClickAway, children, props }) {
  return (
    <div className="fixed inset-0 z-50 grid w-screen h-screen bg-white place-items-center bg-opacity-80">
      <ClickAway onClickAway={onClickAway} {...props}>
        {children}
      </ClickAway>
    </div>
  );
}
