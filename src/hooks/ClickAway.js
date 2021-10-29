import React, { useEffect, useRef } from "react";

export default function ClickAway({ children, setToggle }) {
  const ref = useRef();
  useEffect(() => {
    function cb(e) {
      if (!ref.current?.contains(e.target)) {
        setToggle(false);
      }
    }
    document.addEventListener("click", cb);
    return () => document.removeEventListener("click", cb);
  }, [setToggle]);

  return <div ref={ref}>{children}</div>;
}
