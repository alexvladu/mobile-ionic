import { createContext, useContext } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const WebSocketContext = createContext<any>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useWebSocket('ws://localhost:8080/notifications');
  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useAppWebSocket = () => useContext(WebSocketContext);