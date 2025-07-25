import React, { useState, useEffect } from 'react';
import { useStore } from '../db';

const Dashboard: React.FC = () => {
  const { getAll: getKisans } = useStore('kisans');
  const { getAll: getVyaparis } = useStore('vyaparis');
  const { getAll: getTransactions } = useStore('transactions');
  const { getAll: getPayments } = useStore('payments');

  const [stats, setStats] = useState({
    kisans: 0,
    vyaparis: 0,
    transactions: 0,
    payments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [kisans, vyaparis, transactions, payments] = await Promise.all([
        getKisans(),
        getVyaparis(),
        getTransactions(),
        getPayments()
      ]);

      const totalRevenue = payments
        .filter((p: any) => p.paymentType === 'received')
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      setStats({
        kisans: kisans.length,
        vyaparis: vyaparis.length,
        transactions: transactions.length,
        payments: payments.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = 
    ({ title, value, icon, color }) => (
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
          <div className="text-4xl opacity-80">{icon}</div>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Sanche Darbar Sabji Mandi
        </h1>
        <p className="text-gray-600">
          Manage your mandi operations efficiently with our digital platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Kisans"
          value={stats.kisans}
          icon="🧑‍🌾"
          color="text-emerald-600"
        />
        <StatCard
          title="Total Vyaparis"
          value={stats.vyaparis}
          icon="🏪"
          color="text-blue-600"
        />
        <StatCard
          title="Transactions"
          value={stats.transactions}
          icon="📊"
          color="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          icon="💰"
          color="text-green-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl">➕</span>
            <div className="text-left">
              <div className="font-medium">New Transaction</div>
              <div className="text-sm text-gray-600">Record a sale</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl">🧑‍🌾</span>
            <div className="text-left">
              <div className="font-medium">Add Kisan</div>
              <div className="text-sm text-gray-600">Register farmer</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl">🏪</span>
            <div className="text-left">
              <div className="font-medium">Add Vyapari</div>
              <div className="text-sm text-gray-600">Register trader</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl">💰</span>
            <div className="text-left">
              <div className="font-medium">Record Payment</div>
              <div className="text-sm text-gray-600">Add payment</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {/* Placeholder for recent transactions */}
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>No recent transactions</p>
              <p className="text-sm">Start by recording your first transaction</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {/* Placeholder for recent payments */}
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💳</div>
              <p>No recent payments</p>
              <p className="text-sm">Payments will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 text-emerald-700">
          <span className="text-lg">ℹ️</span>
          <div>
            <p className="font-medium">Digital Mandi Management System</p>
            <p className="text-sm">Efficiently manage farmers, traders, items, and transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;