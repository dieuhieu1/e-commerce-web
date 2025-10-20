import { useState, useRef, useEffect } from "react";
import { voteOptions } from "@/ultils/constants";
import { AiFillStar } from "react-icons/ai";

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState("");
  const [chosenScore, setChosenScore] = useState(null);
  const [hoveredScore, setHoveredScore] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chosenScore) return alert("Please select your rating!");
    if (comment.trim()) {
      onSubmit({
        comment,
        score: chosenScore,
      });
      setComment("");
      setChosenScore(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-hidden animate-in fade-in-50 duration-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Write Your Review
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Share your experience with this product
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How do you feel about this product? Your Rating:
            </label>
            <div className="flex items-center gap-4 justify-center">
              {voteOptions.map((el) => {
                const isActive =
                  hoveredScore !== null
                    ? hoveredScore >= el.id
                    : chosenScore >= el.id;
                return (
                  <div
                    key={el.id}
                    className="w-[100px] h-[100px] flex items-center justify-center flex-col gap-2 bg-gray-200 hover:bg-gray-300 cursor-pointer p-4 rounded-md transition-all hover:scale-105"
                    onClick={() => setChosenScore(el.id)}
                    onMouseEnter={() => setHoveredScore(el.id)}
                    onMouseLeave={() => setHoveredScore(null)}
                  >
                    <AiFillStar
                      color={isActive ? "orange" : "gray"}
                      size={28}
                    />
                    <span
                      className={`font-medium ${
                        isActive ? "text-orange-600" : "text-gray-700"
                      }`}
                    >
                      {el.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              placeholder="Share your experience about this product..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
