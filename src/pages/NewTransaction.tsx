import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../db';
import { useHotkeys } from 'react-hotkeys-hook';

interface TransactionFormState {
  kisaanId: number | null;
  vyapariId: number | null;
  itemId: number | null;
  quantity: number;
  rate: number;
  total: number;
}

const NewTransaction: React.FC = () => {
  const { add } = useStore('transactions');
  const [form, setForm] = useState<TransactionFormState>({
    kisaanId: null,
    vyapariId: null,
    itemId: null,
    quantity: 0,
    rate: 0,
    total: 0,
  });

  /* Handy keyboard shortcut: Ctrl+S to save */
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    handleSubmit();
  });

  const handleChange = (field: keyof TransactionFormState, value: any) => {
    const newForm = { ...form, [field]: value };
    /* Calculate total whenever quantity or rate changes */
    if (field === 'quantity' || field === 'rate') {
      newForm.total = +newForm.quantity * +newForm.rate;
    }
    setForm(newForm);
  };

  const handleSubmit = async () => {
    // Very basic validation
    if (!form.kisaanId || !form.vyapariId || !form.itemId) {
      alert('Please select Kisaan, Vyapari, and Item.');
      return;
    }
    await add({ ...form, createdAt: new Date().toISOString() });
    alert('Transaction saved!');
    // Reset form
    setForm({
      kisaanId: null,
      vyapariId: null,
      itemId: null,
      quantity: 0,
      rate: 0,
      total: 0,
    });
  };

  return (
    <motion.section
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-6">Record New Transaction</h2>

      <form
        className="space-y-4 bg-white p-6 rounded-lg shadow"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Kisaan Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kisaan (Farmer)
          </label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={form.kisaanId ?? ''}
            onChange={(e) =>
              handleChange('kisaanId', e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Select Kisaan</option>
            {/* TODO: Map real kisaan options from store */}
          </select>
        </div>

        {/* Vyapari Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vyapari (Trader)
          </label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={form.vyapariId ?? ''}
            onChange={(e) =>
              handleChange('vyapariId', e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Select Vyapari</option>
            {/* TODO: Map real vyapari options from store */}
          </select>
        </div>

        {/* Item Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Item</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={form.itemId ?? ''}
            onChange={(e) =>
              handleChange('itemId', e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Select Item</option>
            {/* TODO: Map real item options from store */}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={form.quantity}
            onChange={(e) => handleChange('quantity', Number(e.target.value))}
            min={0}
          />
        </div>

        {/* Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rate (₹ per kg)
          </label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={form.rate}
            onChange={(e) => handleChange('rate', Number(e.target.value))}
            min={0}
          />
        </div>

        {/* Total */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Total (₹)</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
            value={form.total}
            readOnly
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Save Transaction (Ctrl+S)
        </button>
      </form>
    </motion.section>
  );
};

export default NewTransaction;