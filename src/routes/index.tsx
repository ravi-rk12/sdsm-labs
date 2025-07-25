// src/routes/index.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@pages/Dashboard';
import Kisans from '@pages/Kisans';
import Vyaparis from '@pages/Vyaparis';
import Items from '@pages/Items';
import Payments from '@pages/Payments';
import NewTransaction from '@pages/NewTransaction';
import RecycleBin from '@pages/RecycleBin';

/**
 * Defines the main route structure of the SDSM app.
 * Parent <BrowserRouter> is provided by App.tsx.
 */
const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/new" element={<NewTransaction />} />
    <Route path="/kisans" element={<Kisans />} />
    <Route path="/vyaparis" element={<Vyaparis />} />
    <Route path="/items" element={<Items />} />
    <Route path="/payments" element={<Payments />} />
    <Route path="/recycle-bin" element={<RecycleBin />} />
    {/* Fallback: if unknown path, show dashboard */}
    <Route path="*" element={<Dashboard />} />
  </Routes>
);

export default AppRoutes;
