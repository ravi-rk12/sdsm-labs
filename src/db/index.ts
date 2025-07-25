interface DatabaseStore {
  [key: string]: any[];
}

// In-memory storage (will reset on page refresh)
const memoryDB: DatabaseStore = {
  kisans: [],
  vyaparis: [],
  items: [],
  transactions: [],
  payments: [],
  users: [],
  recycle_bin: [],
  daily_summary: []
};

// Simple ID counter for auto-increment
let idCounters: { [key: string]: number } = {
  kisans: 1,
  vyaparis: 1,
  items: 1,
  transactions: 1,
  payments: 1,
  users: 1,
  recycle_bin: 1,
  daily_summary: 1
};

export const init = async () => {
  console.log('SDSM Database initialized (in-memory mode)');
  return Promise.resolve();
};

export const useStore = (storeName: string) => {
  const getAll = async (): Promise<any[]> => {
    return Promise.resolve([...memoryDB[storeName] || []]);
  };

  const add = async (data: any): Promise<any> => {
    const newItem = {
      ...data,
      id: idCounters[storeName]++,
      createdAt: new Date().toISOString()
    };
    
    if (!memoryDB[storeName]) {
      memoryDB[storeName] = [];
    }
    
    memoryDB[storeName].push(newItem);
    return Promise.resolve(newItem);
  };

  const update = async (data: any): Promise<any> => {
    if (!memoryDB[storeName]) {
      memoryDB[storeName] = [];
    }
    
    const index = memoryDB[storeName].findIndex(item => item.id === data.id);
    if (index !== -1) {
      memoryDB[storeName][index] = { ...data, updatedAt: new Date().toISOString() };
      return Promise.resolve(memoryDB[storeName][index]);
    }
    
    throw new Error(`Item with id ${data.id} not found`);
  };

  const deleteRecord = async (id: number): Promise<void> => {
    if (!memoryDB[storeName]) {
      memoryDB[storeName] = [];
    }
    
    const index = memoryDB[storeName].findIndex(item => item.id === id);
    if (index !== -1) {
      memoryDB[storeName].splice(index, 1);
    }
    
    return Promise.resolve();
  };

  const getByKey = async (id: number): Promise<any> => {
    if (!memoryDB[storeName]) {
      memoryDB[storeName] = [];
    }
    
    const item = memoryDB[storeName].find(item => item.id === id);
    return Promise.resolve(item || null);
  };

  const clear = async (): Promise<void> => {
    memoryDB[storeName] = [];
    idCounters[storeName] = 1;
    return Promise.resolve();
  };

  return { getAll, add, update, deleteRecord, getByKey, clear };
};

export const DB_NAME = 'sdsm-app';