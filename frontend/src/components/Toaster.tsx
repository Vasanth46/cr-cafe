import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToasterContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const useToaster = () => {
  const ctx = useContext(ToasterContext);
  if (!ctx) throw new Error('useToaster must be used within a ToasterProvider');
  return ctx;
};

let toastId = 0;

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              minWidth: 260,
              maxWidth: 340,
              background: toast.type === 'success' ? '#27ae60' : toast.type === 'error' ? '#c0392b' : '#375534',
              color: '#fff',
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              padding: '16px 24px 16px 20px',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              animation: 'slideInRight 0.3s cubic-bezier(.4,2,.6,1)',
              position: 'relative',
            }}
          >
            {/* Icon */}
            <span style={{ marginRight: 14, display: 'flex', alignItems: 'center' }}>
              {toast.type === 'success' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.18"/><path d="M7 13.5l3 3 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {toast.type === 'error' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.18"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
              )}
              {toast.type === 'info' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.18"/><path d="M12 8v4m0 4h.01" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
              )}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, marginLeft: 12, cursor: 'pointer', opacity: 0.7, position: 'absolute', top: 8, right: 12 }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          0% { transform: translateX(60px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToasterContext.Provider>
  );
}; 