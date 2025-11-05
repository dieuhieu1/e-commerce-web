import {
  BsListColumnsReverse,
  BsReplyFill,
  BsShieldShaded,
} from "react-icons/bs";
import path from "./path";
import { FaTruckFast, FaTty } from "react-icons/fa6";
import { AiFillGift, AiOutlineShoppingCart } from "react-icons/ai";
import { RiLockPasswordLine, RiTruckFill } from "react-icons/ri";
import { MdGroups } from "react-icons/md";
import { PiPackageBold } from "react-icons/pi";
import { BiSolidDashboard } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { TbHistoryToggle } from "react-icons/tb";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Truck,
} from "lucide-react";

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
  { name: "BLACK", value: "BLACK" },
  { name: "BLACK LEATHER", value: "BLACK LEATHER" },
  { name: "QUITE BLACK", value: "QUITE BLACK" },
  { name: "MINERAL BLACK", value: "MINERAL BLACK" },
  { name: "DAZZLING WHITE", value: "DAZZLING WHITE" },
  { name: "WHITE", value: "WHITE" },
  { name: "PINK", value: "PINK" },
  { name: "CARBON GRAY", value: "CARBON GRAY" },
  { name: "SPACE GRAY", value: "SPACE GRAY" },
  { name: "SILVER", value: "SILVER" },
  { name: "GOLD", value: "GOLD" },
  { name: "RED", value: "RED" },
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

export const adminSidebar = [
  {
    id: 1,
    type: "single",
    text: "Dasboard",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: BiSolidDashboard,
  },
  {
    id: 2,
    type: "single",
    text: "Manage users",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: MdGroups,
  },
  {
    id: 3,
    type: "parent",
    text: "Manage Products",
    icon: PiPackageBold,
    submenu: [
      {
        id: "create-product",
        text: "Create Product",
        path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
      },
      {
        id: "manage-product",
        text: "Manage Product",
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
      },
    ],
  },
  {
    id: 4,
    type: "single",
    text: "Manage orders",
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: FaTruckFast,
  },
];

export const memberSidebar = [
  {
    id: 1,
    type: "single",
    text: "Personal",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: FaRegUserCircle,
  },
  {
    id: 2,
    type: "single",
    text: "Change Password",
    path: `/${path.MEMBER}/${path.CHANGE_PASSWORD}`,
    icon: RiLockPasswordLine,
  },

  {
    id: 3,
    type: "single",
    text: "Buy History",
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: TbHistoryToggle,
  },
  {
    id: 4,
    type: "single",
    text: "Wishlist",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: BsListColumnsReverse,
  },
];
export const cardConfig = [
  {
    dataKey: "totalRevenue",
    title: "Total Revenue",
    change: "+12.5%", // (Cái này bạn cũng nên lấy từ API nếu có)
    trend: "up",
    icon: DollarSign,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    dataKey: "totalOrders",
    title: "Orders",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    dataKey: "totalCustomers",
    title: "Customers",
    change: "+5.7%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    dataKey: "totalSoldProducts",
    title: "Products Sold",
    change: "-2.3%",
    trend: "down",
    icon: Package,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
];
export const orderStats = [
  {
    dataKey: "totalOrders",
    title: "Total Orders",
    change: "+12.5%",
    trend: "up",
    icon: Package,
    color: "blue",
  },
  {
    dataKey: "totalPending",
    title: "Pending",
    change: "+8.2%",
    trend: "up",
    icon: Clock,
    color: "yellow",
  },
  {
    dataKey: "totalSucceed",
    title: "Completed",
    change: "+15.3%",
    trend: "up",
    icon: CheckCircle,
    color: "green",
  },
  {
    dataKey: "totalCancelled",
    title: "Cancelled",
    change: "-3.2%",
    trend: "down",
    icon: XCircle,
    color: "red",
  },
];
