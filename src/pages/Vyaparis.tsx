import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../db';

interface Vyapari {
  id?: number;
  name: string;
  address: string;
  mobile: string;
  dues: number;
}

const Vyaparis: React.FC = () => {
  const { getAll, add, update, deleteRecord } = useStore('vyaparis');
  const [vyaparis, setVyaparis] = useState<Vyapari[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVyapari, setEditingVyapari] = useState<Vyapari | null>(null);
  const [formData, setFormData] = useState<Vyapari>({
    name: '',
    address: '',
    mobile: '',
    dues: 0
  });

  useEffect(() => {
    loadVyaparis();
  }, []);

  const loadVyaparis = async () => {
    try {
      const data = await getAll();
      setVyaparis(data);
    } catch (error) {
      console.error('Error loading vyaparis:', error);
    }
  };

  const openModal = (vyapari?: Vyapari) => {
    if (vyapari) {
      setEditingVyapari(vyapari);
      setFormData(vyapari);
    } else {
      setEditingVyapari(null);
      setFormData({ name: '', address: '', mobile: '', dues: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVyapari(null);
    setFormData({ name: '', address: '', mobile: '', dues: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert('Please enter name and mobile number.');
      return;
    }

    try {
      if (editingVyapari) {
        await update({ ...editingVyapari, ...formData });
      } else {
        await add(formData);
      }
      
      await loadVyaparis();
      closeModal();
      alert(editingVyapari ? 'Vyapari updated successfully!' : 'Vyapari added successfully!');
    } catch (error) {
      alert('Error saving vyapari: ' + error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vyapari?')) return;

    try {
      await deleteRecord(id);
      await loadVyaparis();
      alert('Vyapari deleted successfully!');
    } catch (error) {
      alert('Error deleting vyapari: ' + error);
    }
  };

  const filteredVyaparis = vyaparis.filter((vyapari: Vyapari) =>
    vyapari.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vyapari.mobile.includes(searchTerm)
  );

  return (
    <motion.section
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Vyaparis (Traders)</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Add New Vyapari
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search vyaparis..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredVyaparis.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVyaparis.map((vyapari) => (
            <div key={vyapari.id} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">{vyapari.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{vyapari.address}</p>
              <p className="text-sm text-gray-600">Mobile: {vyapari.mobile}</p>
              <p className="text-sm text-gray-600">Dues: ₹{vyapari.dues}</p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => openModal(vyapari)}
                  className="flex-1 px-3 py-2 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vyapari.id!)}
                  className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vyaparis found</h3>
          <p className="text-gray-500 mb-4">Start by adding your first vyapari.</p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Add First Vyapari
          </button>
        </div>
      )}

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
              <h3 className="text-lg font-medium mb-4">
                {editingVyapari ? 'Edit Vyapari' : 'Add New Vyapari'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile *</label>
                  <input
                    type="tel"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dues (₹)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md"
                    value={formData.dues}
                    onChange={(e) => setFormData({ ...formData, dues: Number(e.target.value) })}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    {editingVyapari ? 'Update' : 'Add'} Vyapari
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
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

export default Vyaparis;