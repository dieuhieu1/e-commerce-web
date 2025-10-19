import { BsReplyFill, BsShieldShaded } from "react-icons/bs";
import path from "./path";
import { FaTty } from "react-icons/fa6";
import { AiFillGift } from "react-icons/ai";
import { RiTruckFill } from "react-icons/ri";

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

export const ProductExtraInformation = [
  {
    id: 1,
    title: "guarantee",
    sub: "Quality checked",
    icon: BsShieldShaded,
  },
  {
    id: 2,
    title: "Free Shipping",
    sub: "Free on all products",
    icon: RiTruckFill,
  },
  {
    id: 3,
    title: "Special gift cards",
    sub: "Special gift cards",
    icon: AiFillGift,
  },
  {
    id: 4,
    title: "Free return",
    sub: "Within 7 days",
    icon: BsReplyFill,
  },
  {
    id: 5,
    title: "Consultancy",
    sub: "Lifetime 24/7/356",
    icon: FaTty,
  },
];

export const colors = [
  "black",
  "brown",
  "gray",
  "white",
  "pink",
  "yellow",
  "orange",
  "purple",
  "green",
  "blue",
];
export const sorts = [
  { id: 1, value: "-sold", text: "Best selling" }, // sold desc
  { id: 2, value: "title", text: "Alphabetically (A - Z)" }, // title asc
  { id: 3, value: "-title", text: "Alphabetically (Z - A)" }, // title desc
  { id: 4, value: "price", text: "Price (Low to High)" }, // price asc
  { id: 5, value: "-price", text: "Price (High to Low)" }, // price desc
  { id: 6, value: "-createdAt", text: "Date (New to Old)" }, // newest first
  { id: 7, value: "createdAt", text: "Date (Old to New)" }, // oldest first
];
