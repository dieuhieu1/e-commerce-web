import React, { useState, useRef, useEffect, useCallback } from "react";
import VoteBar from "./VoteBar";
import StarRating from "../StarRating";
import CommentModal from "./CommentModal";
import { MessageCircle } from "lucide-react";
import { apiRatingProduct } from "@/apis/product";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { CustomDialog } from "../Dialog/CustomDialog";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

import path from "@/ultils/path";
import Review from "./Review";
import toast from "react-hot-toast";

function Tabs({ data, averageRatings, reviews, productId, onReload }) {
  const location = useLocation();

  // Global state isAuthenticated
  const { isAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  const tabsRef = useRef([]);

  const [activeTab, setActiveTab] = useState(data[0].id);
  const [sliderStyle, setSliderStyle] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Control the tab
  useEffect(() => {
    const activeTabIndex = data.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabsRef.current[activeTabIndex];

    if (activeTabElement) {
      setSliderStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab, data]);

  // Handle submite Reviews
  const handleSubmitVote = useCallback(
    async ({ comment, score }) => {
      console.log({ comment, score });

      const response = await apiRatingProduct(productId, {
        star: score,
        comment,
        updatedAt: Date.now(),
      });
      if (response.success) {
        toast.success(
          "Thank for your review! We appreciate your exprience and improve our service in the future!"
        );
      }
      onReload();
    },
    [onReload, productId]
  );
  // Handle Click Vote Button
  const handleClickVote = useCallback(() => {
    // If not autheticated navigate to login
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    // If yes, let user Reviews
    setIsModalOpen(true);
  }, [isAuthenticated]);

  // Handle confirm Login Modal
  const handleConfirmLoginModal = () => {
    navigate({
      pathname: `/${path.LOGIN}`,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    });
    setIsLoginModalOpen(false);
  };

  if (!data || data.length === 0) return null;
  // Find the active content
  const activeContent = data.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="relative bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative border-b border-gray-200">
            <div className="flex space-x-1 px-6">
              {data.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => (tabsRef.current[index] = el)}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-4 text-base font-semibold transition-all duration-300 ease-in-out focus:outline-none relative
                    ${
                      activeTab === tab.id
                        ? "text-red-600"
                        : "text-gray-500 hover:text-gray-900"
                    }
                  `}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            <div
              className="absolute bottom-0 h-0.5 bg-red-600 transition-all duration-300 ease-in-out"
              style={sliderStyle}
            />
          </div>
          <div className="p-6">{activeContent}</div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 p-8">
            <div className="md:col-span-1 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRatings}
                <span className="text-gray-400 text-4xl mb-3"> /5</span>
              </div>
              <StarRating
                rating={Math.round(parseFloat(averageRatings))}
                size={40}
              />
              <div className="text-sm text-gray-600 mt-4">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                {reviews?.length} reviews
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col justify-center space-y-2">
              {[5, 4, 3, 2, 1].map((el) => (
                <VoteBar
                  key={el}
                  number={el}
                  ratingCounts={
                    reviews?.filter((i) => i.star === el)?.length || 0
                  }
                  ratingTotal={reviews?.length}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-gray-700 mb-4 font-medium">
              Have you review this product yet?
            </p>
            <button
              onClick={handleClickVote}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 cursor-pointer"
            >
              Write your review now
            </button>
          </div>
        </div>

        {reviews?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Review from customers
            </h3>
            {reviews?.map((el) => (
              <Review
                key={el._id}
                star={el.star}
                updatedAt={el.updatedAt}
                comment={el.comment}
                name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
              />
            ))}
          </div>
        )}
      </div>
      <CustomDialog
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Login Required!"
        confirmText="Login"
        cancelText="Not now!"
        onConfirm={handleConfirmLoginModal}
      >
        <p className="text-gray-700 text-md">
          Please login your account Digital World to write your own review.
        </p>
      </CustomDialog>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitVote}
      />
    </div>
  );
}

export default Tabs;
