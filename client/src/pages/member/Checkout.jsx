import React, { useState } from "react";

import {
  Package,
  MapPin,
  CreditCard,
  Check,
  AlertCircle,
  Truck,
  ShoppingBag,
} from "lucide-react";
import payment from "../../assets/payment.png";

import paypal from "../../assets/paypal.png";

import { useAuthStore } from "@/lib/zustand/useAuthStore";
import Paypal from "@/components/Common/PayPal";
import { formatCurrencyVND, formatUSD } from "@/ultils/helpers";
import { Congrat } from "@/components/Common/Congrat";

const Checkout = () => {
  const { user } = useAuthStore();

  const [shippingAddress, setShippingAddress] = useState({
    _id: user?.id || "",
    fullName: (user?.firstname || "") + " " + (user?.lastname || ""),
    phone: user?.mobile || "",
    email: user?.email || "",
    address: user?.address[0]?.value || "",
  });
  const [isSucess, setIsSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const channel = new BroadcastChannel("cart_sync");

  const subtotal =
    user?.cart?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;
  const shipping = 50000;
  const total = subtotal + shipping;
  const totalUSD = formatUSD(total);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  const handlePaymentSuccess = () => {
    scrollToTop();
    channel.postMessage({ type: "CART_CLEARED" });
  };

  if (isSucess) {
    // handleSuccess
    handlePaymentSuccess();

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
        <Congrat />
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order is being processed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Total</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrencyVND(total)}
            </p>
          </div>
          <button
            onClick={() => window.close()}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Congrat Effect */}
      {isSucess && <Congrat />}
      {/* LEFT: Payment Illustration */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-300/30 to-red-400/30 blur-3xl rounded-full scale-125"></div>

        {/* Ảnh minh họa */}
        <div className="relative z-10 mb-20">
          <img
            src={paypal}
            alt="Payment Illustration"
            className="w-[80%] mx-auto drop-shadow-2xl"
          />
        </div>
        {/* Secure Checkout Box */}
        <div className="relative z-10 my-20 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl text-center max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto text-orange-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Secure Checkout
          </h3>
          <p className="text-gray-600 mb-6">
            Your payment information is safe and encrypted
          </p>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Check className="text-green-600" size={20} />
              <span>SSL Encrypted Payment</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="text-blue-600" size={20} />
              <span>Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="text-purple-600" size={20} />
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 mb-20">
          <img
            src={payment}
            alt="Payment Illustration"
            className="w-[80%] mx-auto drop-shadow-2xl"
          />
        </div>
      </div>

      {/* RIGHT: Checkout Form */}
      <div className="w-full lg:w-1/2 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">
              Complete your order in a few simple steps
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-orange-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {user?.cart?.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.thumb}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600">Color: {item.color}</p>
                    <p className="text-xs text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">
                      {formatCurrencyVND(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">
                  {formatCurrencyVND(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="flex items-center gap-2">
                  <Truck size={16} />
                  Shipping
                </span>
                <span className="font-medium">
                  {formatCurrencyVND(shipping)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrencyVND(total)}
                  </p>
                  <p className="text-sm text-gray-500">(≈ ${totalUSD} USD)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-orange-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">
                Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    shippingAddress.fullName
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={shippingAddress.fullName}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    shippingAddress.phone
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={shippingAddress.phone}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    shippingAddress.email
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={shippingAddress.email}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  placeholder="Street address, house number"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    shippingAddress.address
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={shippingAddress.address}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Note (Optional)
                </label>
                <textarea
                  name="note"
                  value={shippingAddress.note}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special instructions for delivery"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-orange-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">
                Payment Method
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-orange-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">PayPal</p>
                  <p className="text-sm text-gray-600">
                    Pay securely with PayPal
                  </p>
                </div>
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg"
                  alt="PayPal"
                  className="h-8"
                />
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-orange-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-gray-600">
                    Pay when you receive the order
                  </p>
                </div>
                <Package size={32} className="text-orange-600" />
              </label>
            </div>

            {/* PayPal Buttons */}
            {paymentMethod === "paypal" && (
              <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                <Paypal
                  amount={totalUSD}
                  payload={{
                    products: user.cart,
                    total: totalUSD,
                    address: shippingAddress.address,
                  }}
                  setIsSuccess={setIsSuccess}
                />
              </div>
            )}

            {/* COD Button */}
            {paymentMethod === "cod" && (
              <button
                onClick={() => setIsSuccess(true)}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Place Order - Cash on Delivery
              </button>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
              <AlertCircle
                className="text-blue-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-sm text-blue-900">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy. Your payment information is encrypted and
                secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
