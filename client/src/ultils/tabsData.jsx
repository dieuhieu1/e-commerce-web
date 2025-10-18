import React from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaShippingFast,
  FaCcVisa,
  FaCcMastercard,
  FaPaypal,
  FaExclamationTriangle,
  FaCheckCircle,
  FaComments,
  FaTimesCircle,
  FaWarehouse,
} from "react-icons/fa";
import {
  BsCpuFill,
  BsDeviceSsdFill,
  BsUsbPlug,
  BsMemory,
  BsDisplay,
} from "react-icons/bs";
import { IoCameraOutline } from "react-icons/io5";

// ✨ Shared animation
const fadeSlide = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

// --- DESCRIPTION ---
const ElectronicDescription = () => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="visible"
    className="text-sm text-gray-700 leading-relaxed space-y-8"
  >
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Technical Specifications
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <li className="flex items-center gap-3">
          <BsCpuFill className="text-blue-500" size={20} />
          <span>
            <strong>Processor:</strong> Apple A18 Bionic Pro – lightning-fast
            performance for every task.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <BsMemory className="text-blue-500" size={20} />
          <span>
            <strong>RAM:</strong> 12 GB LPDDR5 – seamless multitasking and
            faster app switching.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <BsDeviceSsdFill className="text-blue-500" size={20} />
          <span>
            <strong>Storage Options:</strong> 256 GB / 512 GB / 1 TB – plenty of
            space for everything you love.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <BsDisplay className="text-blue-500" size={20} />
          <span>
            <strong>Display:</strong> 6.7” Super Retina XDR OLED, 120Hz adaptive
            refresh rate.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <IoCameraOutline className="text-blue-500" size={20} />
          <span>
            <strong>Rear Cameras:</strong> 48MP Main, 12MP Ultra-Wide, 12MP
            Telephoto with 5x Optical Zoom.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <BsUsbPlug className="text-blue-500" size={20} />
          <span>
            <strong>Charging Port:</strong> USB-C 4.0 – faster charging and
            universal connectivity.
          </span>
        </li>
      </ul>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <FaCheckCircle className="text-green-500 mt-1" />
          <span>
            <strong>Titanium Design:</strong> Aerospace-grade titanium frame –
            lighter, stronger, and more durable than ever.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <FaCheckCircle className="text-green-500 mt-1" />
          <span>
            <strong>Professional Camera System:</strong> Shoot 4K HDR videos,
            cinematic portraits, and ultra-clear night shots.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <FaCheckCircle className="text-green-500 mt-1" />
          <span>
            <strong>Battery Life:</strong> All-day battery with smart
            optimization to keep you powered longer.
          </span>
        </li>
      </ul>
    </div>
  </motion.div>
);

// --- WARRANTY ---
const ElectronicWarranty = () => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="visible"
    className="text-sm text-gray-700 leading-relaxed space-y-6"
  >
    <h3 className="text-lg font-semibold text-gray-800 mb-3">
      Warranty Information
    </h3>
    <p>
      This product comes with a <strong>12-month warranty</strong> for the
      device and a <strong>6-month warranty</strong> for accessories. Warranty
      covers manufacturing defects only.
    </p>
    <ul className="space-y-2">
      <li className="flex items-start gap-3">
        <FaCheckCircle className="text-green-500 mt-1" />
        <span>The warranty seal must be intact and unaltered.</span>
      </li>
      <li className="flex items-start gap-3">
        <FaTimesCircle className="text-red-500 mt-1" />
        <span>
          Physical damage, water exposure, or unauthorized repairs will void the
          warranty.
        </span>
      </li>
    </ul>
  </motion.div>
);

// --- DELIVERY ---
const ElectronicDelivery = () => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="visible"
    className="text-sm text-gray-700 leading-relaxed space-y-6"
  >
    <h3 className="text-lg font-semibold text-gray-800 mb-3">
      Delivery & Shipping
    </h3>
    <p>
      Enjoy <strong>fast and reliable delivery</strong> to your doorstep. Orders
      within the city are typically delivered within <strong>2–4 hours</strong>,
      while other regions may take <strong>2–4 business days</strong>.
    </p>
    <p className="flex items-center gap-2 text-green-600 font-medium">
      <FaShippingFast /> Free shipping on orders over $100.
    </p>
  </motion.div>
);

// --- PAYMENT ---
const ElectronicPayment = () => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="visible"
    className="text-sm text-gray-700 leading-relaxed space-y-6"
  >
    <h3 className="text-lg font-semibold text-gray-800 mb-3">
      Payment Methods
    </h3>
    <p>We support multiple secure payment options for your convenience:</p>
    <ul className="space-y-2">
      <li className="flex items-center gap-3">
        <FaWarehouse /> Cash on Delivery (COD)
      </li>
      <li className="flex items-center gap-3">
        <FaCcVisa /> Visa / MasterCard / Credit & Debit Cards
      </li>
      <li className="flex items-center gap-3">
        <FaPaypal /> PayPal and Bank Transfer via QR Code
      </li>
    </ul>
    <p className="text-gray-600">
      All transactions are encrypted and secured by advanced SSL technology.
    </p>
  </motion.div>
);

// --- REVIEW ---
const CustomerReviewContent = () => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="visible"
    className="text-sm text-center text-gray-700 py-8 flex flex-col items-center justify-center ml-[20%]"
  >
    <FaComments className="text-gray-300 text-5xl mb-4" />
    <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
    <p className="max-w-md mb-6">
      Be the first to share your experience with this product and help others
      make the right choice.
    </p>
    <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition">
      Write a Review
    </button>
  </motion.div>
);

// --- EXPORT TAB DATA ---
export const tabsData = [
  {
    id: "description",
    title: "Description & Specifications",
    content: <ElectronicDescription />,
  },
  { id: "warranty", title: "Warranty", content: <ElectronicWarranty /> },
  { id: "delivery", title: "Delivery", content: <ElectronicDelivery /> },
  { id: "payment", title: "Payment", content: <ElectronicPayment /> },
  {
    id: "customer-review",
    title: "Customer Reviews",
    content: <CustomerReviewContent />,
  },
];
