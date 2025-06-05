// utils/SocketContext.tsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

// Create context with default values
const SocketContext = createContext<SocketContextType>({
  socket: null,
  connectSocket: () => {},
  disconnectSocket: () => {},
});

// Provider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = useCallback(() => {
    if (!socket) {
      console.log("Connecting to socket...");
      const newSocket = io('http://localhost:3000', {
        withCredentials: true,
        transports: ['websocket'],
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('⚠️ Socket disconnected');
      });
    }
  }, [socket]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      console.log("Disconnecting socket...");
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  // Connect socket on mount, disconnect on unmount
  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook
export const useSocket = () => useContext(SocketContext);
