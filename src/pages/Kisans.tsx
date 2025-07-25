import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../db';
import { useHotkeys } from 'react-hotkeys-hook';

interface Kisan {
  id?: number;
  name: string;
  address: string;
  mobile: string;
  dues: number;
  photo?: string;
  createdAt?: string;
}

const Kisans: React.FC = () => {
  const { getAll, add, update, deleteRecord } = useStore('kisans');
  const [kisans, setKisans] = useState<Kisan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKisan, setEditingKisan] = useState<Kisan | null>(null);
  const [formData, setFormData] = useState<Kisan>({
    name: '',
    address: '',
    mobile: '',
    dues: 0
  });

  useEffect(() => {
    loadKisans();
  }, []);

  // Keyboard shortcuts
  useHotkeys('ctrl+n', (e) => {
    e.preventDefault();
    openModal();
  });

  useHotkeys('escape', () => {
    setIsModalOpen(false);
  });

  const loadKisans = async () => {
    try {
      const data = await getAll();
      setKisans(data);
    } catch (error) {
      console.error('Error loading kisans:', error);
    }
  };

  const openModal = (kisan?: Kisan) => {
    if (kisan) {
      setEditingKisan(kisan);
      setFormData(kisan);
    } else {
      setEditingKisan(null);
      setFormData({
        name: '',
        address: '',
        mobile: '',
        dues: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingKisan(null);
    setFormData({
      name: '',
      address: '',
      mobile: '',
      dues: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert('Please enter name and mobile number.');
      return;
    }

    try {
      if (editingKisan) {
        await update({ ...editingKisan, ...formData });
      } else {
        await add(formData);
      }
      
      await loadKisans();
      closeModal();
      alert(editingKisan ? 'Kisan updated successfully!' : 'Kisan added successfully!');
    } catch (error) {
      alert('Error saving kisan: ' + error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this kisan?')) return;

    try {
      await deleteRecord(id);
      await loadKisans();
      alert('Kisan deleted successfully!');
    } catch (error) {
      alert('Error deleting kisan: ' + error);
    }
  };

  const filteredKisans = kisans.filter((kisan: Kisan) =>
    kisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kisan.mobile.includes(searchTerm)
  );

  return (
    <motion.section
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Kisans (Farmers)</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Add New Kisan (Ctrl+N)
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search kisans by name or mobile..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Kisans Grid */}
      {filteredKisans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredKisans.map((kisan) => (
            <motion.div
              key={kisan.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{kisan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{kisan.address}</p>
                </div>
                {kisan.photo && (
                  <img
                    src={kisan.photo}
                    alt={kisan.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mobile:</span>
                  <span className="font-medium">{kisan.mobile}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Outstanding Dues:</span>
                  <span className={`font-medium ${kisan.dues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{kisan.dues?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(kisan)}
                  className="flex-1 px-3 py-2 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(kisan.id!)}
                  className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🧑‍🌾</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No kisans found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first kisan.'}
          </p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Add First Kisan
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
                    {editingKisan ? 'Edit Kisan' : 'Add New Kisan'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name *</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Kisan's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Village/City, District, State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="10-digit mobile number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Outstanding Dues (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
                        value={formData.dues}
                        onChange={(e) => setFormData({ ...formData, dues: Number(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingKisan ? 'Update' : 'Add'} Kisan
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

export default Kisans;