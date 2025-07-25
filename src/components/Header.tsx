// src/components/Header.tsx  ← keep this file

import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

/* ──────────────── simple, inline full-screen hook ──────────────── */
const useFullScreen = () => {
  const [isFull, setIsFull] = React.useState(false);

  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFull(true));
    } else {
      document.exitFullscreen().then(() => setIsFull(false));
    }
  };

  React.useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  return { isFull, toggle };
};
/* ──────────────────────────────────────────────────────────────── */

const Header: React.FC = () => {
  const { isFull, toggle } = useFullScreen();

  // F11 → toggle full-screen
  useHotkeys('f11', e => {
    e.preventDefault();
    toggle();
  });

  return (
    <header className="bg-emerald-600 text-white flex items-center px-4 py-3 shadow">
      {/* logo */}
      <div className="h-10 w-10 mr-3 rounded-md bg-emerald-700 flex items-center justify-center text-2xl">
        🥬
      </div>

      {/* mandi name + address */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold">Sanche Darbar Sabji Mandi</h1>
        <p className="text-sm">By-Pass Road, Lalganj, Vaishali, Bihar – 844121</p>
      </div>

      {/* full-screen button */}
      <button
        onClick={toggle}
        className="ml-auto px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-800 transition-colors"
      >
        {isFull ? 'Exit Full Screen' : 'Full Screen'}
      </button>

      {/* operator avatar placeholder */}
      <div className="h-8 w-8 ml-4 rounded-full bg-emerald-700 flex items-center justify-center text-sm">
        👤
      </div>
    </header>
  );
};

export default Header;
