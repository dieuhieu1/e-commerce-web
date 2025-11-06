// file: Root.jsx (Đã đơn giản hơn)

import React from "react";
import { Outlet } from "react-router-dom";
import SocketProvider from "./context/socketContext";

const Root = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};

export default Root;
