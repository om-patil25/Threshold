import { useState, useEffect } from "react";

export const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, ...e.detail }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-brand-primary text-bg-primary px-4 py-3 rounded-lg shadow-xl font-medium text-sm animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};
