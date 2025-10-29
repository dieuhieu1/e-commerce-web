import { apiGetProducts } from "@/apis/product";
import { formatMoney } from "@/ultils/helpers";
import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineMenu } from "react-icons/ai";
import StarRating from "../StarRating";
import CountDown from "./CountDown";
import { useNavigate } from "react-router-dom";

const DealDaily = () => {
  const navigate = useNavigate();

  const [dealDaily, setDealDaily] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [expired, setExpired] = useState(false);

  const fetchDaily = async () => {
    const response = await apiGetProducts({
      limit: 1,
      page: Math.round(Math.random() * 6),
      totalRatings: 5,
    });

    if (response.success) {
      setDealDaily(response.products[0]);
      setExpired(false); // Reset state when have a new deal
    }
  };

  useEffect(() => {
    fetchDaily();
  }, []);

  useEffect(() => {
    const targetTime = new Date().setHours(new Date().getHours() + 24); // 24h sau
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setHour(0);
        setMinute(0);
        setSecond(0);
        setExpired(true);
      } else {
        const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const m = Math.floor((distance / (1000 * 60)) % 60);
        const s = Math.floor((distance / 1000) % 60);
        setHour(h);
        setMinute(m);
        setSecond(s);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (expired) {
      fetchDaily();
    }
  }, [expired]);
  // Handle navigation to product detail page
  const handleNavigate = () => {
    // Make sure dealDaily and necessary properties exist before navigating
    if (
      dealDaily &&
      dealDaily?._id &&
      dealDaily?.title &&
      dealDaily?.category
    ) {
      // Construct the path, assuming category is needed as well
      // Replace spaces in title for URL safety, e.g., using '-'
      const slugTitle = dealDaily.title.toLowerCase().replace(/\s+/g, "-");
      const categorySlug = dealDaily.category
        .toLowerCase()
        .replace(/\s+/g, "-");

      navigate(`/${categorySlug}/${dealDaily._id}/${slugTitle}`);
    } else {
      console.error("Cannot navigate: dealDaily data is missing.");
      // Optionally show a toast message to the user
    }
  };
  return (
    <div className="border border-stone-400 w-full flex-auto ">
      <div className="flex items-center justify-between p-4 w-full">
        <span className="flex justify-center">
          <AiFillStar size={20} color="red" />
        </span>
        <span className="flex-12 font-semibold text-[20px] flex justify-center uppercase">
          daily deals
        </span>
        <span className="flex-2"> </span>
      </div>

      <div className="w-full flex flex-col items-center px-4 gap-2 pt-8">
        <img
          src={
            dealDaily?.thumb?.image_url ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKnKnw0MtmVH5_-A-wrEh5OiTSL3lu_5MZZA&s"
          }
          alt="dealDaily.jpg"
          className="w-full object-contain"
        />
        <span className="line-clamp-1">{dealDaily?.title}</span>
        <span className="flex h-4">
          <StarRating rating={dealDaily?.totalRatings} />
        </span>
        <span>{formatMoney(Number(dealDaily?.price))} VND</span>
      </div>

      <div className="px-4 mt-8 ">
        <div className="flex justify-center gap-2 items-center my-4">
          <CountDown unit={"Hours"} number={hour} />
          <CountDown unit={"Minutes"} number={minute} />
          <CountDown unit={"Seconds"} number={second} />
        </div>
        <button
          type="button"
          className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2 cursor-pointer"
          onClick={handleNavigate}
        >
          <AiOutlineMenu />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
};

export default DealDaily;
