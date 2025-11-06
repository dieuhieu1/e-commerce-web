import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketContext = createContext();

export const useSocket = () => {
  return useContext(socketContext);
};

const SocketProvider = () => {
  const [notifications, setNotifications] = useState(null);
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.SOCKET_URL);
      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        newSocket.emit("user_connected", user._id);
      });

      newSocket.on("new_notification", (notification) => {
        console.log(notification);

        setNotifications(notification);
      });
    }
  }, [user]);
};
