// components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";
import { apiGetNotification, apiMarkAsRead } from "@/apis/notification";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

// Helper format thời gian
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " năm trước";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " tháng trước";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " ngày trước";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " giờ trước";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " phút trước";
  return "Vừa xong";
};

const NotificationBell = () => {
  const { user } = useAuthStore();
  const { notifications, setNotifications, unreadCount, setUnreadCount } =
    useSocket();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUnreadNotifications();
  }, []);

  const loadUnreadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiGetNotification();
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    setOpen(false);
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        await apiMarkAsRead(notification._id);
      } catch (error) {
        console.error(error);
      }
    }
    if (user.role === "admin") {
      navigate(`/admin/manage-order?orderId=${notification.orderId}`);
    } else {
      navigate(`/member/buy-history?orderId=${notification.orderId}`);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger: dùng div custom thay vì Button */}
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer p-1 rounded-full hover:bg-gray-100 transition">
          <FaBell className="w-9 h-9 text-gray-800" /> {/* icon lớn */}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 z-50" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-lg">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="text-blue-600 text-sm">
              Đánh dấu tất cả đã đọc
            </span>
          )}
        </div>
        <Separator />

        {/* List */}
        <ScrollArea className="h-[300px] max-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <FaBell className="w-12 h-12 mb-2" />
              <span className="text-sm font-medium">
                Không có thông báo mới
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex gap-3 p-4 cursor-pointer transition-colors ${
                    !notification.read
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-grow overflow-hidden">
                    <p
                      className={`text-sm ${
                        !notification.read ? "font-semibold" : "font-normal"
                      } text-gray-900`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Order ID: {notification.orderId} •{" "}
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-2 bg-gray-50">
          <span
            className="text-blue-600 cursor-pointer text-sm w-full block text-center"
            onClick={() => {
              navigate("/notifications");
              setOpen(false);
            }}
          >
            Xem tất cả thông báo
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
