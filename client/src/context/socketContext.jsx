// context/SocketContext.js
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();

  // Sử dụng ref để tránh tạo socket nhiều lần
  const socketRef = useRef(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    // Nếu không có user hoặc đang connecting thì return
    if (!user || isConnectingRef.current) return;

    // Nếu socket đã tồn tại và connected thì không tạo mới
    if (socketRef.current?.connected) {
      console.log("Socket already connected, skipping...");
      return;
    }

    // Đánh dấu đang connecting
    isConnectingRef.current = true;

    console.log("Initializing socket connection for user:", user._id);

    // Khởi tạo socket connection
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection handlers
    newSocket.on("connect", () => {
      console.log("✅ Connected to socket server:", newSocket.id);
      setIsConnected(true);
      isConnectingRef.current = false;

      // Gửi userId để server biết user này đang online
      newSocket.emit("user_connected", user._id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from socket server:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      isConnectingRef.current = false;
    });

    // Lắng nghe notification mới
    newSocket.on("new_notification", (notification) => {
      console.log("🔔 New notification received:", notification);

      setNotifications((prev) => {
        // Kiểm tra duplicate
        const exists = prev.some((n) => n._id === notification._id);
        if (exists) {
          console.log("Duplicate notification, skipping...");
          return prev;
        }
        return [notification, ...prev];
      });

      setUnreadCount((prev) => prev + 1);

      // Hiển thị popup notification
      showNotificationPopup(notification);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.off("new_notification");
        socketRef.current.close();
        socketRef.current = null;
      }

      isConnectingRef.current = false;
      setIsConnected(false);
    };
  }, [user?._id]); // Chỉ depend vào user._id

  const showNotificationPopup = (notification) => {
    window.alert("Thong bao moi!");
    // Sử dụng browser notification API
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Thông báo mới", {
        body: notification.message,
        icon: "/logo.png",
        tag: notification._id, // Prevent duplicate notifications
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission;
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
        isConnected,
        requestNotificationPermission,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
