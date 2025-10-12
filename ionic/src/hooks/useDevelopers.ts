import { useState, useCallback, useEffect } from 'react';
import { Developer } from '../types/developer';
import { DeveloperService } from '../api/developers';
import { useAppWebSocket } from '../context/WebSocketContext';

export const useDevelopers = () => {
  const devService = new DeveloperService();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const { isConnected, sendMessage } = useAppWebSocket();

  const loadDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await devService.fetchDevelopers();
      setDevelopers(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDeveloper = async (dev: Omit<Developer, 'id'>) => {
    try {
      const createdDev = await devService.createDeveloper(dev);
      setDevelopers(prev => [...prev, createdDev]);
      sendMessage('Created dev');
    } catch (err: any) {
      setError(err);
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
    loadDevelopers,
    addDeveloper,
    updateDeveloper,
    deleteDeveloper,
  };
};
