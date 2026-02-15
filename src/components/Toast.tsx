"use client";

import { useEffect } from "react";

type ToastType = "success" | "error" | "info";

export function Toast({
  message,
  type = "info",
  onDismiss,
  duration = 4000,
}: {
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [onDismiss, duration]);

  const styles = {
    success: "bg-emerald-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-slate-700 text-white",
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3 shadow-lg ${styles[type]}`}
      role="alert"
    >
      {message}
    </div>
  );
}
