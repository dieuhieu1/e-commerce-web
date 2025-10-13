import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

const StarRating = ({
  rating = 0,
  total = 5,
  size = 20,
  color = "#facc15", // vàng
}) => {
  const stars = [];

  for (let i = 1; i <= total; i++) {
    if (rating >= i) {
      stars.push(<AiFillStar key={i} size={size} color={color} />);
    } else if (rating >= i - 0.5) {
      // If rating in range 4.5 - 4.9 it will jump into this condition
      stars.push(<BsStarHalf key={i} size={size} color={color} />);
    } else {
      // Empty Star
      stars.push(<AiOutlineStar key={i} size={size} color={color} />);
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export default StarRating;
