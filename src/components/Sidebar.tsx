// src/components/Sidebar.tsx

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiFilePlus,
  FiUsers,
  FiShoppingBag,
  FiCreditCard,
  FiTrash2,
} from "react-icons/fi";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: FiHome },
  { to: "/new", label: "New Transaction", icon: FiFilePlus },
  { to: "/kisans", label: "Kisans", icon: FiUsers },
  { to: "/vyaparis", label: "Vyaparis", icon: FiUsers },
  { to: "/items", label: "Items", icon: FiShoppingBag },
  { to: "/payments", label: "Payments", icon: FiCreditCard },
  { to: "/recycle-bin", label: "Recycle Bin", icon: FiTrash2 },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="h-full w-56 bg-white shadow-lg flex flex-col">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-emerald-700">Navigation</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
                    isActive
                      ? "bg-emerald-100 text-emerald-700 font-medium border-r-2 border-emerald-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-gray-400"}`}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="px-4 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">SDSM v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
