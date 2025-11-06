// components/NotificationBell.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "@/context/socketContext";

const NotificationBell = () => {
  const { notifications, setNotifications, unreadCount, setUnreadCount } =
    useSocket();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load notifications chưa đọc khi component mount
  // useEffect(() => {
  //   loadUnreadNotifications();
  // }, []);

  // const loadUnreadNotifications = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get("/api/notifications/unread", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     if (response.data.success) {
  //       setNotifications(response.data.data);
  //       setUnreadCount(response.data.count);
  //     }
  //   } catch (error) {
  //     console.error("Error loading notifications:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleNotificationClick = async (notification) => {
  //   try {
  //     // Đánh dấu đã đọc
  //     await axios.patch(
  //       `/api/notifications/${notification._id}/read`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     // Update local state
  //     setNotifications((prev) =>
  //       prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
  //     );
  //     setUnreadCount((prev) => Math.max(0, prev - 1));

  //     // Navigate đến order detail
  //     window.location.href = `/orders/${notification.orderId}`;
  //   } catch (error) {
  //     console.error("Error marking notification as read:", error);
  //   }
  // };

  // const handleMarkAllRead = async () => {
  //   try {
  //     await axios.patch(
  //       "/api/notifications/mark-all-read",
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  //     setUnreadCount(0);
  //   } catch (error) {
  //     console.error("Error marking all as read:", error);
  //   }
  // };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                // onClick={handleMarkAllRead}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Đang tải...
              </div>
            ) : notifications?.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Không có thông báo mới
              </div>
            ) : (
              notifications?.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  // onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        notification.read
                          ? "text-gray-700"
                          : "text-gray-900 font-medium"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 text-center py-2">
            <a
              href="/notifications"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Xem tất cả thông báo
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
