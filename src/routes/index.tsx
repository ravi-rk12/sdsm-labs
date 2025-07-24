import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pagesashboard';
import NewTransaction from '../pages/NewTransaction';
import Kisans from '../pages/Kisans';
import Vyaparis from '../pages/Vyaparis';
import Items from '../pages/Items';
import Payments from '../pages/Payments';
import RecycleBin from '../pages/RecycleBin';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Core workflow */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/new" element={<NewTransaction />} />

      {/* Master data */}
      <Route path="/kisans" element={<Kisans />} />
      <Route path="/vyaparis" element={<Vyaparis />} />
      <Route path="/items" element={<Items />} />

      {/* Financials */}
      <Route path="/payments" element={<Payments />} />

      {/* Utilities */}
      <Route path="/recycle-bin" element={<RecycleBin />} />

      {/* Fallback */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
