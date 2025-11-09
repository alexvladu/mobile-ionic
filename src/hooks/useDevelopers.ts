import { useState, useCallback, useEffect } from 'react';
import { Developer } from '../types/developer';
import { DeveloperService } from '../api/developers';
import { useAppWebSocket } from '../context/WebSocketContext';
import { save, search } from 'ionicons/icons';
import { clearOfflineDevelopers, getOfflineDevelopers, saveOfflineDeveloper } from '../utils/offlineQueue';
import { loadDevelopersFromLocal, loadDevelopersOnlineSize, removeDeveloperFromLocal, saveDevelopersOnlineSize, saveDevelopersToLocal, updateDeveloperInLocal } from '../utils/saveLocalStorageDevelopers';

export const useDevelopers = () => {
  const devService = new DeveloperService();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [searchName, setSearchName] = useState<string | null>(null);
  const [filterFullStack, setFilterFullStack] = useState<string>("all");


  useEffect(() => {
    currentPage!==0 && setCurrentPage(0);
    setDevelopers(filterDevelopers(developers));
  }, [filterFullStack]);

  const { isConnected, sendMessage } = useAppWebSocket();

  useEffect(() => {
    const syncOfflineDevelopers = async () => {
      if(getOfflineDevelopers().length===0) return;
      try {
        const offlineList = getOfflineDevelopers();
        for (const dev of offlineList) {
          await addDeveloper(dev);
        }
      } catch (error) {
        console.error('Failed to sync offline developers:', error);
      }
      finally{
        clearOfflineDevelopers();
        alert('Offline added developers synchronized successfully.');
      }
    };
    if (isConnected) {
      syncOfflineDevelopers();
    }
  }, [isConnected]);

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

  const searchDevelopersByName = (developers: Developer[], searchTerm: string | null): Developer[] => {
    if (!searchTerm) return developers;
    
    return developers.filter(dev => 
      dev.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filter = (developers: Developer[]) : Developer[] =>{
    let filteredDevelopers=filterDevelopers(developers);
    let searchDevelopers=searchDevelopersByName(filteredDevelopers, searchName);
    let processedDevelopers=searchDevelopers.map(dev=>{
      const apiUrl = import.meta.env.VITE_DATA_SERVICE_URL;
      return{
        ...dev,
        photoURL: dev.photoURL ? ` ${apiUrl}/public/${dev.photoURL}` : `https://ui-avatars.com/api/?name=${dev.name}&background=random&size=200`
      }
    });
    return processedDevelopers;
  }


  const loadDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await devService.fetchDevelopers(currentPage, pageSize, searchName, filterFullStack);
      saveDevelopersToLocal(res.data);
      saveDevelopersOnlineSize(res.total);
      const list=loadDevelopersFromLocal();
      const total=loadDevelopersOnlineSize();
      setTotal(total);
      setDevelopers(filter(list));
    } catch (err: any) {
      const list=loadDevelopersFromLocal();
      const offlineList=getOfflineDevelopers();
      let combined: Developer[] = [
          ...(list ?? []),
          ...(offlineList as Developer[] ?? []),
      ];
      combined = filter(combined);
      setTotal(combined.length);
      setDevelopers(combined);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterFullStack, searchName]);

  const addDeveloper = async (dev: any) => {
    try {
      const createdDev = await devService.createDeveloper(dev);
      setDevelopers(prev => [...prev, createdDev]);
      sendMessage('Created dev');
    } catch (err: any) {
      saveOfflineDeveloper(dev);
      setDevelopers(prev => [...prev, dev as Developer]);
      if(isConnected===false)
        alert('You are offline. The developer will be saved locally and synchronized when back online.');
    }
  };

  const updateDeveloper = async (updated: Developer) => {
    try {
      await devService.updateDeveloper(updated.id, updated);
      updateDeveloperInLocal(updated);
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
      const savedDevs = loadDevelopersFromLocal();
      removeDeveloperFromLocal(id);
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
    searchName,
    setSearchName,
    loadDevelopers,
    addDeveloper,
    updateDeveloper,
    deleteDeveloper,
  };
};
