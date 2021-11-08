import React, { useEffect, useRef } from 'react';

export default function ClickAway({ children, setToggle, classNames }) {
  const ref = useRef();
  useEffect(() => {
    function cb(e) {
      if (!ref.current?.contains(e.target)) {
        setToggle(false);
      }
    }
    document.addEventListener('click', cb);
    return () => document.removeEventListener('click', cb);
  }, [setToggle]);

  return (
    <div className={classNames} ref={ref}>
      {children}
    </div>
  );
}
