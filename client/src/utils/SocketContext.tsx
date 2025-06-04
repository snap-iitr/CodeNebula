import React, { createContext, useState, useEffect, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connectSocket: () => {},
    disconnectSocket: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = () => {
    console.log("Connecting to socket...");
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'], // or ['websocket', 'polling']
    });
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
      if (socket) {
          socket.disconnect();
          setSocket(null);
      }
  };

    useEffect(() => {
        connectSocket();
      return () => {
        disconnectSocket();
      };
    }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};


export const useSocket = () => {
    return useContext(SocketContext);
};