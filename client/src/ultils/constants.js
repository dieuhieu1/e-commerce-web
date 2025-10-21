import { BsReplyFill, BsShieldShaded } from "react-icons/bs";
import path from "./path";
import { FaTty } from "react-icons/fa6";
import { AiFillGift } from "react-icons/ai";
import { RiTruckFill } from "react-icons/ri";

export const navigation = [
  { id: 101, value: "HOME", path: `/${path.HOME}` },
  { id: 102, value: "PRODUCTS", path: `/${path.PRODUCTS}` },
  { id: 103, value: "BLOGS", path: `/${path.BLOGS}` },
  { id: 104, value: "OUR SERVICES", path: `/${path.OUTSERVICES}` },
  { id: 105, value: "FAQ", path: `/${path.FAQ}` },
];

export const ProductExtraInformation = [
  { id: 201, title: "Guarantee", sub: "Quality checked", icon: BsShieldShaded },
  {
    id: 202,
    title: "Free Shipping",
    sub: "Free on all products",
    icon: RiTruckFill,
  },
  {
    id: 203,
    title: "Special gift cards",
    sub: "Special gift cards",
    icon: AiFillGift,
  },
  { id: 204, title: "Free return", sub: "Within 7 days", icon: BsReplyFill },
  { id: 205, title: "Consultancy", sub: "Lifetime 24/7/365", icon: FaTty },
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
  { id: 300, value: "", text: "Choose" },
  { id: 301, value: "-sold", text: "Best selling" },
  { id: 302, value: "title", text: "Alphabetically (A - Z)" },
  { id: 303, value: "-title", text: "Alphabetically (Z - A)" },
  { id: 304, value: "price", text: "Price (Low to High)" },
  { id: 305, value: "-price", text: "Price (High to Low)" },
  { id: 306, value: "-createdAt", text: "Date (New to Old)" },
  { id: 307, value: "createdAt", text: "Date (Old to New)" },
];

export const voteOptions = [
  { id: 1, text: "Terrible" },
  { id: 2, text: "Bad" },
  { id: 3, text: "Neutral" },
  { id: 4, text: "Good" },
  { id: 5, text: "Perfect" },
];
