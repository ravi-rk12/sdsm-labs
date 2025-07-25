import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Kisans from './pages/Kisans';
import Vyaparis from './pages/Vyaparis';
import Items from './pages/Items';
import Payments from './pages/Payments';
import NewTransaction from './pages/NewTransaction';

// Navigation menu items
const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/new', label: 'New Transaction', icon: '➕' },
  { path: '/kisans', label: 'Kisans', icon: '🧑‍🌾' },
  { path: '/vyaparis', label: 'Vyaparis', icon: '🏪' },
  { path: '/items', label: 'Items', icon: '📦' },
  { path: '/payments', label: 'Payments', icon: '💰' },
];

// Sidebar navigation
const Sidebar: React.FC = () => (
  <div className="w-64 bg-white shadow-lg h-screen">
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-emerald-700">SDSM Menu</h2>
    </div>
    <nav className="p-2">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  </div>
);

// Header component
const Header: React.FC = () => (
  <header className="bg-emerald-600 text-white px-6 py-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">🥬 Sanche Darbar Sabji Mandi</h1>
        <p className="text-sm opacity-90">By-Pass Road, Lalganj, Vaishali, Bihar - 844121</p>
      </div>
      <div className="text-right text-sm">
        <div>{new Date().toLocaleDateString('en-IN')}</div>
        <div className="text-xs opacity-75">
          {new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  </header>
);

// Main App component
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewTransaction />} />
              <Route path="/kisans" element={<Kisans />} />
              <Route path="/vyaparis" element={<Vyaparis />} />
              <Route path="/items" element={<Items />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;