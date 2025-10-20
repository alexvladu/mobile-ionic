import { useEffect, useRef, useState, useCallback } from 'react';
import { v4 as uuidv4, v4 } from 'uuid';

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!url) return;
    if (ws.current)
      return;

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      setLastMessage(v4()+event.data);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = (event) => {
      setIsConnected(false);
      console.log('WebSocket disconnected', event);
      reconnectTimeout.current = setTimeout(() => connect(), 2000);
    };
  }, [url]);

  useEffect(() => {
    connect();
  }, [connect]);

  const sendMessage = useCallback((message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.warn('WebSocket not open. Unable to send:', message);
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}