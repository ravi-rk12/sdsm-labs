import React from 'react';
import { useFullScreen } from '../hooks/useFullScreen';
import { useHotkeys } fromreact-hotkeys-hook';

const Header: React.FC = () => {
  const { isFull, toggle } = useFullScreen();

  /*  F11 keyboard shortcut for full-screen toggle  */
  useHotkeys('f11', (e) => {
    e.preventDefault();
    toggle();
  });

  return (
    <header className="bg-emerald-600 text-white flex items-center px-4 py-3 shadow">
      {/* Mandi logo */}
      <img
        src="/logo.png"
        alt="Mandi Logo"
        className="h-10 w-10 mr-3 rounded-md object-cover"
      />

      {/* Mandi name + address */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold">Sanche Darbar Sabji Mandi</h1>
        <p className="text-sm">
          By-Pass Road, Lalganj, Vaishali, Bihar - 844121
        </p>
      </div>

      {/* Full-screen toggle button */}
      <button
        onClick={toggle}
        aria-label="Toggle Full Screen"
        className="ml-auto px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-800 transition-colors"
      >
        {isFull ? 'Exit Full Screen' : 'Full Screen'}
      </button>

      {/* Placeholder for operator avatar */}
      {/* <img src={operatorPhotoUrl} alt="Operator" className="h-8 w-8 ml-4 rounded-full" /> */}
    </header>
  );
};

export default Header;
