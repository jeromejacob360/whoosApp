import { useEffect } from 'react';

export default function useCameraPreviewDimensions(
  chatHistoryRef,
  setChatHistoryDimensions,
  currentChatName,
) {
  useEffect(() => {
    let listener;
    if (chatHistoryRef.current) {
      //initial dimensions

      const h = chatHistoryRef.current.getBoundingClientRect().height + 65; // 65px is the height of the input bar
      const tempW = chatHistoryRef.current.getBoundingClientRect().width;
      const w = tempW || '100%';

      setChatHistoryDimensions({ height: h, width: w });

      //on window resize, update the dimensions
      listener = window.addEventListener('resize', () => {
        const clientHeight =
          chatHistoryRef.current &&
          chatHistoryRef.current.getBoundingClientRect().height;
        const clientWidth =
          chatHistoryRef.current &&
          chatHistoryRef.current.getBoundingClientRect().width;

        setChatHistoryDimensions({
          height: clientHeight,
          width: clientWidth,
        });
      });
    }
    return listener;
  }, [chatHistoryRef, setChatHistoryDimensions, currentChatName]);
}
