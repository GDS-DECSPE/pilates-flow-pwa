import React, { useState, useEffect } from 'react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowBanner(false);
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-800 border border-teal-500 p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between">
      <div>
        <h4 className="font-bold text-sm text-white">Instalar Pilates Flow</h4>
        <p className="text-xs text-slate-300">Añádela a tu pantalla de inicio para usarla sin conexión.</p>
      </div>
      <button
        onClick={handleInstall}
        className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
      >
        📥 Instalar
      </button>
    </div>
  );
};