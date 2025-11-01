import { apiGetProducts } from "@/apis/product";
import { formatMoney } from "@/ultils/helpers";
import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineMenu } from "react-icons/ai";
import StarRating from "../StarRating";
import CountDown from "./CountDown";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CountDownTimer";

const DealDaily = () => {
  const navigate = useNavigate();

  const [dealDaily, setDealDaily] = useState(null);
  const [expired, setExpired] = useState(false);

  const fetchDaily = async () => {
    const response = await apiGetProducts({
      limit: 1,
      page: Math.round(Math.random() * 6),
      sort: "totalRatings",
    });

    if (response.success) {
      setDealDaily(response.products[0]);
      setExpired(false); // Reset state when have a new deal
    }
  };

  useEffect(() => {
    fetchDaily();
  }, []);

  const handleExpire = () => {
    setExpired(true);
    fetchDaily(); // Tự động gọi deal mới
  };

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

      {!dealDaily ? (
        <div className="flex justify-center items-center py-8">
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col items-center px-4 gap-2 pt-8">
            <img
              src={
                dealDaily?.thumb?.image_url || "https://via.placeholder.com/200"
              }
              alt="dealDaily"
              className="w-full object-contain"
            />
            <span className="line-clamp-1">{dealDaily.title}</span>
            <StarRating rating={dealDaily.totalRatings} />
            <span>{formatMoney(Number(dealDaily.price))} VND</span>
          </div>

          <div className="px-4 mt-8">
            <CountdownTimer duration={24 * 60 * 60} onExpire={handleExpire} />
            <button
              type="button"
              className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2"
              onClick={handleNavigate}
            >
              <AiOutlineMenu />
              <span>Options</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DealDaily;
