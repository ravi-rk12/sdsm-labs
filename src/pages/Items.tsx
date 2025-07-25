import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../db';
import { useHotkeys } from 'react-hotkeys-hook';

interface Item {
  id?: number;
  name: string;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  createdAt?: string;
}

const Items: React.FC = () => {
  const { getAll, add, update, deleteRecord } = useStore('items');
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'averagePrice'>('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Item>({
    name: '',
    averagePrice: 0,
    minPrice: 0,
    maxPrice: 0,
    unit: 'kg'
  });

  useEffect(() => {
    loadItems();
  }, []);

  // Keyboard shortcuts
  useHotkeys('ctrl+n', (e) => {
    e.preventDefault();
    openModal();
  });

  useHotkeys('escape', () => {
    setIsModalOpen(false);
  });

  const loadItems = async () => {
    try {
      const data = await getAll();
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const openModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        unit: 'kg'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      averagePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      unit: 'kg'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter item name.');
      return;
    }

    try {
      if (editingItem) {
        await update({ ...editingItem, ...formData });
      } else {
        await add(formData);
      }
      
      await loadItems();
      closeModal();
      alert(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (error) {
      alert('Error saving item: ' + error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteRecord(id);
      await loadItems();
      alert('Item deleted successfully!');
    } catch (error) {
      alert('Error deleting item: ' + error);
    }
  };

  const filteredItems = items
    .filter((item: Item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: Item, b: Item) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return (a.averagePrice || 0) - (b.averagePrice || 0);
      }
    });

  return (
    <motion.section
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Items Catalog</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Add New Item (Ctrl+N)
        </button>
      </div>

      {/* Search and Sort */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search items..."
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'averagePrice')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600"
        >
          <option value="name">Sort by Name</option>
          <option value="averagePrice">Sort by Price</option>
        </select>

        <div className="text-sm text-gray-600 flex items-center">
          Total Items: {filteredItems.length}
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    className="hover:bg-gray-50"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.averagePrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{item.minPrice?.toFixed(2) || '0.00'} - ₹{item.maxPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first item.'}
          </p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Add First Item
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingItem ? 'Edit Item' : 'Add New Item'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Item Name</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Tomato, Potato, Onion"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Unit</label>
                      <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="quintal">Quintal</option>
                        <option value="piece">Per Piece</option>
                        <option value="dozen">Dozen</option>
                        <option value="liter">Liter</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Min Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                          value={formData.minPrice}
                          onChange={(e) => setFormData({ ...formData, minPrice: Number(e.target.value) })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Avg Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                          value={formData.averagePrice}
                          onChange={(e) => setFormData({ ...formData, averagePrice: Number(e.target.value) })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                          value={formData.maxPrice}
                          onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingItem ? 'Update' : 'Add'} Item
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel (ESC)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default Items;