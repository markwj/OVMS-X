import { useEffect, useRef } from 'react';

type CallbackFunction = () => void;

export function useInterval(callback: CallbackFunction, delay: number | null) {
  const savedCallback = useRef<CallbackFunction>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}