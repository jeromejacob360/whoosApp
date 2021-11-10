import React, { useEffect, useRef } from 'react';

export default function ClickAway({ children, onClickAway, classNames }) {
  const ref = useRef();
  useEffect(() => {
    function cb(e) {
      if (!ref.current?.contains(e.target)) {
        onClickAway();
      }
    }
    document.addEventListener('click', cb);
    return () => document.removeEventListener('click', cb);
  }, [onClickAway]);

  return (
    <div className={classNames} ref={ref}>
      {children}
    </div>
  );
}
