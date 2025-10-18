import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../../components/Navigation";
import TopHeader from "@/components/UI/TopHeader";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";

const Public = () => {
  return (
    <div className="w-full flex flex-col items-center ">
      <TopHeader />
      <Header />
      <Navigation />
      <div className="w-full flex items-center flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Public;
