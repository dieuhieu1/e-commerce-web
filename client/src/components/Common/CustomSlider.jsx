import Slider from "react-slick";
import Product from "../Product/Product";
import Arrow from "../Arrow";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
  nextArrow: <Arrow icon={<FaChevronRight />} position="right" />,
  prevArrow: <Arrow icon={<FaChevronLeft />} position="left" />,
};
const CustomSlider = ({ products, isNew, normal }) => {
  return (
    <>
      {products && (
        <Slider {...settings} className="!mx-[-10px]">
          {products?.map((el) => (
            <div key={el._id} className="px-3">
              <Product productData={el} isNew={isNew} normal={normal} />
            </div>
          ))}
        </Slider>
      )}
    </>
  );
};

export default CustomSlider;
