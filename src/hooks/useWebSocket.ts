import { useEffect, useRef, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!url) return;

    // Avoid opening multiple sockets
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      ws.current = new WebSocket(url);
    } catch (error) {
      console.error('WebSocket connection failed immediately:', error);
      scheduleReconnect();
      return;
    }

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('✅ WebSocket connected:', url);
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };

    ws.current.onmessage = (event) => {
      setLastMessage(`${uuidv4()}:${event.data}`);
    };

    ws.current.onerror = (error) => {
      console.error('⚠️ WebSocket error:', error);
      // Sometimes error occurs before onclose is called
      if (ws.current?.readyState !== WebSocket.OPEN) {
        scheduleReconnect();
      }
    };

    ws.current.onclose = (event) => {
      setIsConnected(false);
      console.log('🔌 WebSocket disconnected:', event.reason || event.code);
      scheduleReconnect();
    };
  }, [url]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeout.current) return;
    reconnectTimeout.current = setTimeout(() => {
      console.log('♻️ Attempting to reconnect...');
      reconnectTimeout.current = null;
      connect();
    }, 2000);
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) ws.current.close();
      ws.current = null;
    };
  }, [connect]);

  const sendMessage = useCallback((message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.warn('⚠️ WebSocket not open. Unable to send:', message);
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}
