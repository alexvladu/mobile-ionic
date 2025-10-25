import { useState, useCallback, useEffect } from 'react';
import { Developer } from '../types/developer';
import { DeveloperService } from '../api/developers';
import { useAppWebSocket } from '../context/WebSocketContext';
import { save, search } from 'ionicons/icons';
import { getOfflineDevelopers, saveOfflineDeveloper } from '../utils/offlineQueue';
import { loadDevelopersFromLocal, loadDevelopersOnlineSize, saveDevelopersOnlineSize, saveDevelopersToLocal } from '../utils/saveLocalStorageDevelopers';

export const useDevelopers = () => {
  const devService = new DeveloperService();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState<number | null>(null);

  const [searchName, setSearchName] = useState<string | null>(null);
  const [filterFullStack, setFilterFullStack] = useState<string>("all");


  useEffect(() => {
    currentPage!==0 && setCurrentPage(0);
  }, [filterFullStack]);


  const { isConnected, sendMessage } = useAppWebSocket();

  const filterDevelopers = (developers: Developer[]): Developer[] => {
    switch (filterFullStack) {
      case 'true':
        return developers.filter(dev => dev.fullStack === true);
      case 'false':
        return developers.filter(dev => dev.fullStack === false);
      case 'all':
      default:
        return developers;
    }
  };

  const loadDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await devService.fetchDevelopers(currentPage, pageSize, searchName, filterFullStack);
      saveDevelopersToLocal(res.data);
      saveDevelopersOnlineSize(res.total);
      const list=loadDevelopersFromLocal();
      const total=loadDevelopersOnlineSize();
      setTotal(total);
      setDevelopers(list ?? []);
    } catch (err: any) {
      const list=loadDevelopersFromLocal();
      const offlineList=getOfflineDevelopers();
      let combined: Developer[] = [
          ...(list ?? []),
          ...(offlineList as Developer[] ?? []),
      ];
      combined = filterDevelopers(combined);
      setTotal(combined.length);
      setDevelopers(combined);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterFullStack, searchName]);

  const addDeveloper = async (dev: Omit<Developer, 'id'>) => {
    try {
      const createdDev = await devService.createDeveloper(dev);
      setDevelopers(prev => [...prev, createdDev]);
      sendMessage('Created dev');
    } catch (err: any) {
      saveOfflineDeveloper(dev);
      setDevelopers(prev => [...prev, dev as Developer]);
    }
  };

  const updateDeveloper = async (updated: Developer) => {
    try {
      await devService.updateDeveloper(updated.id, updated);
      setDevelopers(prev =>
        prev.map(dev => (dev.id === updated.id ? updated : dev))
      );
      sendMessage('Update dev' + updated.id);
    } catch (err: any) {
      setError(err);
    }
  };

  const deleteDeveloper = async (id: number) => {
    try {
      await devService.deleteDeveloper(id);
      setDevelopers(prev => prev.filter(dev => dev.id !== id));
      sendMessage('Delete dev' + id);
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    developers,
    loading,
    error,
    isConnected,
    currentPage,
    setCurrentPage,
    pageSize,
    total,
    filterFullStack,
    setFilterFullStack,
    loadDevelopers,
    addDeveloper,
    updateDeveloper,
    deleteDeveloper,
  };
};
