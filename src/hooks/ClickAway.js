import React, { useEffect, useRef } from "react";

export default function ClickAway({ children, setToggle }) {
  const ref = useRef();

  function cb(e) {
    if (!ref.current?.contains(e.target)) {
      setToggle(false);
    }
  }
  useEffect(() => {
    document.addEventListener("click", cb);
    return () => document.removeEventListener("click", cb);
  }, []);

  return <div ref={ref}>{children}</div>;
}
