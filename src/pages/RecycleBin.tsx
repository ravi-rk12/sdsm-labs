import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../db';
import { useHotkeys } from 'react-hotkeys-hook';

interface RecycledItem {
  id?: number;
  originalId: number;
  originalStore: 'kisans' | 'vyaparis' | 'items' | 'transactions' | 'payments';
  data: any;
  deletedAt: string;
  deletedBy?: string;
  reason?: string;
}

const RecycleBin: React.FC = () => {
  const { getAll, add, deleteRecord } = useStore('recycle_bin');
  const { add: addKisan } = useStore('kisans');
  const { add: addVyapari } = useStore('vyaparis');
  const { add: addItem } = useStore('items');
  const { add: addTransaction } = useStore('transactions');
  const { add: addPayment } = useStore('payments');

  const [recycledItems, setRecycledItems] = useState<RecycledItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadRecycledItems();
  }, []);

  // Keyboard shortcuts
  useHotkeys('ctrl+a', (e) => {
    e.preventDefault();
    if (selectedItems.size === recycledItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(recycledItems.map(item => item.id!)));
    }
  });

  useHotkeys('delete', () => {
    if (selectedItems.size > 0) {
      handlePermanentDelete();
    }
  });

  const loadRecycledItems = async () => {
    const data = await getAll();
    setRecycledItems(data.sort((a: any, b: any) => 
      new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
    ));
  };

  const handleRestore = async (item: RecycledItem) => {
    if (!confirm(`Restore this ${item.originalStore.slice(0, -1)}?`)) return;

    try {
      // Restore to original store
      const { originalId, ...dataToRestore } = item.data;
      
      switch (item.originalStore) {
        case 'kisans':
          await addKisan(dataToRestore);
          break;
        case 'vyaparis':
          await addVyapari(dataToRestore);
          break;
        case 'items':
          await addItem(dataToRestore);
          break;
        case 'transactions':
          await addTransaction(dataToRestore);
          break;
        case 'payments':
          await addPayment(dataToRestore);
          break;
      }

      // Remove from recycle bin
      await deleteRecord(item.id!);
      await loadRecycledItems();
      
      alert(`${item.originalStore.slice(0, -1)} restored successfully!`);
    } catch (error) {
      alert('Error restoring item: ' + error);
    }
  };

  const handlePermanentDelete = async (itemId?: number) => {
    const itemsToDelete = itemId ? [itemId] : Array.from(selectedItems);
    
    if (!confirm(`Permanently delete ${itemsToDelete.length} item(s)? This cannot be undone.`)) return;

    try {
      for (const id of itemsToDelete) {
        await deleteRecord(id);
      }
      await loadRecycledItems();
      setSelectedItems(new Set());
      alert('Items permanently deleted.');
    } catch (error) {
      alert('Error deleting items: ' + error);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedItems.size === 0) return;
    
    if (!confirm(`Restore ${selectedItems.size} selected item(s)?`)) return;

    try {
      for (const itemId of selectedItems) {
        const item = recycledItems.find(r => r.id === itemId);
        if (item) {
          const { originalId, ...dataToRestore } = item.data;
          
          switch (item.originalStore) {
            case 'kisans':
              await addKisan(dataToRestore);
              break;
            case 'vyaparis':
              await addVyapari(dataToRestore);
              break;
            case 'items':
              await addItem(dataToRestore);
              break;
            case 'transactions':
              await addTransaction(dataToRestore);
              break;
            case 'payments':
              await addPayment(dataToRestore);
              break;
          }
          await deleteRecord(item.id!);
        }
      }
      
      await loadRecycledItems();
      setSelectedItems(new Set());
      alert('Selected items restored successfully!');
    } catch (error) {
      alert('Error restoring items: ' + error);
    }
  };

  const handleEmptyBin = async () => {
    if (recycledItems.length === 0) return;
    
    if (!confirm('Empty the entire recycle bin? This will permanently delete all items and cannot be undone.')) return;

    try {
      for (const item of recycledItems) {
        await deleteRecord(item.id!);
      }
      await loadRecycledItems();
      setSelectedItems(new Set());
      alert('Recycle bin emptied successfully.');
    } catch (error) {
      alert('Error emptying recycle bin: ' + error);
    }
  };

  const toggleSelection = (itemId: number) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const getItemDisplayName = (item: RecycledItem) => {
    const data = item.data;
    switch (item.originalStore) {
      case 'kisans':
      case 'vyaparis':
        return data.name || 'Unnamed';
      case 'items':
        return data.name || 'Unnamed Item';
      case 'transactions':
        return `Transaction - ${data.kisanName || 'Unknown'} → ${data.vyapariName || 'Unknown'}`;
      case 'payments':
        return `Payment - ₹${data.amount} (${data.paymentType})`;
      default:
        return 'Unknown Item';
    }
  };

  const getItemDetails = (item: RecycledItem) => {
    const data = item.data;
    switch (item.originalStore) {
      case 'kisans':
      case 'vyaparis':
        return `Mobile: ${data.mobile || 'N/A'}, Dues: ₹${data.dues || 0}`;
      case 'items':
        return `Avg Price: ₹${data.averagePrice || 0}/${data.unit || 'unit'}`;
      case 'transactions':
        return `${data.quantity || 0} ${data.unit || 'kg'} @ ₹${data.rate || 0}`;
      case 'payments':
        return `${data.paymentMethod || 'Unknown method'} - ${new Date(data.date).toLocaleDateString()}`;
      default:
        return '';
    }
  };

  const filteredItems = recycledItems.filter(item => {
    const matchesSearch = getItemDisplayName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getItemDetails(item).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = filterStore === 'all' || item.originalStore === filterStore;
    return matchesSearch && matchesStore;
  });

  const storeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'kisans', label: 'Kisans' },
    { value: 'vyaparis', label: 'Vyaparis' },
    { value: 'items', label: 'Items' },
    { value: 'transactions', label: 'Transactions' },
    { value: 'payments', label: 'Payments' },
  ];

  return (
    <motion.section
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Recycle Bin</h2>
        <div className="flex gap-2">
          {selectedItems.size > 0 && (
            <>
              <button
                onClick={handleBulkRestore}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Restore Selected ({selectedItems.size})
              </button>
              <button
                onClick={() => handlePermanentDelete()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Selected (Del)
              </button>
            </>
          )}
          {recycledItems.length > 0 && (
            <button
              onClick={handleEmptyBin}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Empty Bin
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search deleted items..."
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          value={filterStore}
          onChange={(e) => setFilterStore(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600"
        >
          {storeOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <div className="flex items-center">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
              onChange={() => {
                if (selectedItems.size === filteredItems.length) {
                  setSelectedItems(new Set());
                } else {
                  setSelectedItems(new Set(filteredItems.map(item => item.id!)));
                }
              }}
              className="mr-2"
            />
            Select All (Ctrl+A)
          </label>
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className={`p-4 border-l-4 hover:bg-gray-50 cursor-pointer ${
                  selectedItems.has(item.id!) 
                    ? 'bg-blue-50 border-l-blue-500' 
                    : 'border-l-gray-300'
                }`}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.1 }}
                onClick={() => toggleSelection(item.id!)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id!)}
                      onChange={() => toggleSelection(item.id!)}
                      className="h-4 w-4 text-emerald-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          {getItemDisplayName(item)}
                        </h3>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
                          {item.originalStore.slice(0, -1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getItemDetails(item)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Deleted {new Date(item.deletedAt).toLocaleString()}
                        {item.reason && ` • Reason: ${item.reason}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleRestore(item)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(item.id!)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          {recycledItems.length === 0 ? (
            <div>
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Recycle bin is empty</h3>
              <p className="text-gray-500">Deleted items will appear here and can be restored.</p>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items match your search</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Info Panel */}
      {recycledItems.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="text-yellow-600 text-lg mr-3">⚠️</div>
            <div>
              <h4 className="font-medium text-yellow-800">About Recycle Bin</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Items in the recycle bin can be restored to their original location. 
                Use "Delete Forever" or "Empty Bin" for permanent deletion.
                Keyboard shortcuts: Ctrl+A (select all), Delete key (delete selected).
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default RecycleBin;