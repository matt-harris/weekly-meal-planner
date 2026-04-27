"use client";

import { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ToastState {
  message: string;
  onUndo: () => void;
}

interface ToastContextType {
  showUndo: (message: string, onUndo: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setToast(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showUndo = useCallback((message: string, onUndo: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, onUndo });
    timerRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  function handleUndo() {
    toast?.onUndo();
    dismiss();
  }

  return (
    <ToastContext.Provider value={{ showUndo }}>
      {children}
      {toast &&
        createPortal(
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-modal-in">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
              <p className="text-sm text-foreground">{toast.message}</p>
              <button
                onClick={handleUndo}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Undo
              </button>
              <button
                onClick={dismiss}
                className="text-xs text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
