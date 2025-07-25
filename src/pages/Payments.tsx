import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../db';

interface Payment {
  id?: number;
  amount: number;
  paymentType: 'received' | 'paid';
  paymentMethod: string;
  description: string;
  date: string;
}

const Payments: React.FC = () => {
  const { getAll, add } = useStore('payments');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [formData, setFormData] = useState<Payment>({
    amount: 0,
    paymentType: 'received',
    paymentMethod: 'cash',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await getAll();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      await add(formData);
      await loadPayments();
      setFormData({
        amount: 0,
        paymentType: 'received',
        paymentMethod: 'cash',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      alert('Payment recorded successfully!');
    } catch (error) {
      alert('Error saving payment: ' + error);
    }
  };

  const totalReceived = payments
    .filter(p => p.paymentType === 'received')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = payments
    .filter(p => p.paymentType === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <motion.section
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-6">Payments</h2>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Total Received</h3>
          <p className="text-3xl font-bold text-green-600">₹{totalReceived.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Total Paid</h3>
          <p className="text-3xl font-bold text-red-600">₹{totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Net Balance</h3>
          <p className="text-3xl font-bold text-blue-600">₹{(totalReceived - totalPaid).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Add Payment Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Record New Payment</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Type *</label>
              <select
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as 'received' | 'paid' })}
              >
                <option value="received">Received</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Payment details..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Record Payment
            </button>
          </form>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Recent Payments</h3>
          
          {payments.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {payments
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((payment) => (
                  <div key={payment.id} className="border-l-4 border-gray-200 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-medium ${payment.paymentType === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{payment.amount.toFixed(2)} ({payment.paymentType})
                        </p>
                        <p className="text-sm text-gray-600">{payment.paymentMethod}</p>
                        {payment.description && (
                          <p className="text-sm text-gray-500">{payment.description}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No payments recorded yet.</p>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Payments;