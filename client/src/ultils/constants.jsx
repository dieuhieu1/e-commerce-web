import { BsReplyFill, BsShieldShaded } from "react-icons/bs";
import path from "./path";
import { RiTruckFill } from "react-icons/ri";
import { AiFillGift } from "react-icons/ai";
import { FaTty } from "react-icons/fa6";
export const navigation = [
  {
    id: 1,
    value: "HOME",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "PRODUCTS",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "BLOGS",
    path: `/${path.BLOGS}`,
  },
  {
    id: 4,
    value: "OUR SERVICES",
    path: `/${path.OUTSERVICES}`,
  },
  {
    id: 5,
    value: "FAQ",
    path: `/${path.FAQ}`,
  },
];

export const productInformation = [
  {
    id: 1,
    title: "guarantee",
    sub: "Quality checked",
    icon: <BsShieldShaded />,
  },
  {
    id: 2,
    title: "Free Shipping",
    sub: "Free on all products",
    icon: <RiTruckFill />,
  },
  {
    id: 3,
    title: "Special gift cards",
    sub: "Special gift cards",
    icon: <AiFillGift />,
  },
  {
    id: 4,
    title: "Free return",
    sub: "Within 7 days",
    icon: <BsReplyFill />,
  },
  {
    id: 5,
    title: "Consultancy",
    sub: "Lifetime 24/7/356",
    icon: <FaTty />,
  },
];
