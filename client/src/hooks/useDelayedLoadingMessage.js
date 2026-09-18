import { useState, useEffect } from 'react';

export const useDelayedLoadingMessage = (isLoading = true, initialMessage = "Loading...", delayMs = 6000) => {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    if (!isLoading) {
      setMessage(initialMessage);
      return;
    }

    const timer = setTimeout(() => {
      setMessage("Hang tight, waking things up...");
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isLoading, initialMessage, delayMs]);

  return message;
};
