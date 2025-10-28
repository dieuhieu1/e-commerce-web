import { apiCreateOrder } from "@/apis/order";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import toast from "react-hot-toast";

// This value is from the props in the UI
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({
  showSpinner,
  currency,
  amount,
  payload,
  setIsSuccess,
}) => {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
  const { setCheckOut } = useAuthStore();
  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: { ...options, currency: currency },
    });
  }, [currency, showSpinner]);

  const handlePaymentSuccess = async () => {
    const response = await apiCreateOrder({ ...payload, status: "Succeed" });
    if (response.success) {
      setIsSuccess(true);
      setCheckOut();
      toast.success("Order placed successfully! Thank you for your purchase.", {
        duration: 4000, // Thời gian hiển thị (4 giây)
        icon: "🎉", // Icon tùy chỉnh
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          padding: "12px 18px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
        // Bạn cũng có thể thêm position: 'top-right', 'bottom-center', etc.
      });
    }
  };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        createOrder={(data, actions) =>
          actions.order
            .create({
              purchase_units: [
                { amount: { currency_code: currency, value: amount } },
              ],
            })
            .then((orderId) => orderId)
        }
        onApprove={(data, actions) =>
          actions.order.capture().then(async (response) => {
            console.log(response);
            console.log(payload);

            if (response.status === "COMPLETED") {
              handlePaymentSuccess();
            }
          })
        }
      />
    </>
  );
};

export default function Paypal({ amount, payload, setIsSuccess }) {
  return (
    <div>
      <PayPalScriptProvider
        options={{
          clientId: "test",
          components: "buttons",
          currency: "USD",
        }}
      >
        <ButtonWrapper
          currency={"USD"}
          amount={amount}
          showSpinner={false}
          payload={payload}
          setIsSuccess={setIsSuccess}
        />
      </PayPalScriptProvider>
    </div>
  );
}
