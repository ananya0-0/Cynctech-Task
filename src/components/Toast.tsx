"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-sage text-white",
    error: "bg-accent text-white",
    warning: "bg-amber-500 text-white",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
  };

  return (
    <div
      className={`toast fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-sm ${colors[type]}`}
    >
      <span className="text-base font-bold">{icons[type]}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity text-base leading-none"
      >
        ×
      </button>
    </div>
  );
}