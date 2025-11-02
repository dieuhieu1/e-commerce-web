import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/ultils/helpers";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { apiRemoveProductFromCart, apiUpdateUserCart } from "@/apis/user";
import toast from "react-hot-toast";
// import { useDebounce } from "@/hooks/useDebounce"; // 1. 'useDebounce' is no longer needed

export function DetailCartItem({ item }) {
  const { checkAuth } = useAuthStore();
  const [quantity, setQuantity] = useState(item.quantity);

  // --- Debounce Delta (Change) Logic ---
  // 2. Use a ref to store the "change" (delta) waiting to be sent
  const quantityDeltaRef = useRef(0);
  // 3. Use a ref to store the timer ID
  const debounceTimerRef = useRef(null);
  // ------------------------------------

  // 4. Synchronize state with prop when 'item' from parent changes
  useEffect(() => {
    setQuantity(item.quantity);
    window.scrollTo(0, 0);
  }, [item.quantity]);

  // 5. This function will be called in the 'setTimeout'
  const updateCartOnServer = async (delta) => {
    // If nothing changed (e.g., clicked +1 then -1), do nothing
    if (delta === 0) return;

    const productId = item.product._id;
    const data = {
      color: item.color,
      title: item.title,
      price: item.price,
      thumb: item.thumb,
      quantity: delta, // 6. Send the "delta" (+1, -2, etc.)
    };

    const response = await apiUpdateUserCart(productId, data);

    if (response.success) {
      toast.success("Cart updated.");
      checkAuth(); // Update global state
    } else {
      toast.error("Failed to update cart.");
      // Rollback UI to the original state from 'item' prop
      setQuantity(item.quantity);
    }
  };

  // 7. Function to handle UI AND debounce logic
  const handleUpdateQuantity = (changeAmount) => {
    // changeAmount is +1 or -1

    // Calculate the new quantity for the UI
    const newQuantity = quantity + changeAmount;

    // Don't allow quantity to go below 1
    if (newQuantity < 1) return;

    // Update UI immediately
    setQuantity(newQuantity);

    // Accumulate the change (delta)
    quantityDeltaRef.current += changeAmount;

    // Clear the old timer (if it exists)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      // Send the accumulated delta
      updateCartOnServer(quantityDeltaRef.current);
      // Reset delta after sending
      quantityDeltaRef.current = 0;
    }, 800); // 800ms delay
  };

  // Handle item removal (unchanged)
  const handleRemoveItem = async () => {
    // ... (Your handleRemoveItem code remains the same) ...
    const toastId = toast.loading("Removing item...");
    const productId = item.product._id;
    const data = {
      color: item.color,
      title: item.title,
    };

    const response = await apiRemoveProductFromCart(productId, data);
    if (response.success) {
      toast.success("Item removed!", { id: toastId });
      checkAuth();
    } else {
      toast.error("Failed to remove item.", { id: toastId });
    }
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-10 gap-2 py-4 items-center">
      {/* Column 1 & 2: Product (Image + Name) */}
      <div className="col-span-4 md:col-span-3 flex items-center gap-4">
        <img
          src={item?.thumb}
          alt={item?.title}
          className="w-20 h-20 object-cover rounded-md border"
        />
        <div className="flex-1">
          <h4 className="font-medium truncate">{item?.title}</h4>
          <p className="text-sm text-gray-500 capitalize">
            Color: {item.color.toLowerCase()}
          </p>
          <button
            onClick={handleRemoveItem}
            className="md:hidden text-xs text-red-500 hover:underline mt-1"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Column 3: Price (Mobile hidden) */}
      <div className="hidden md:flex justify-center col-span-2">
        <span className="text-gray-700">{formatCurrency(item?.price)}</span>
      </div>

      {/* Column 4: Quantity */}
      <div className="col-span-2 md:col-span-1 flex justify-center items-center">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            // 8. Send delta -1
            onClick={() => handleUpdateQuantity(-1)}
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </Button>
          <span className="px-3 text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            // 9. Send delta +1
            onClick={() => handleUpdateQuantity(1)}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Column 5: Total (Mobile displays differently) */}
      <div className="col-span-2 md:col-span-2 text-right">
        <span className="font-semibold">
          {/* Still use UI 'quantity' state to calculate total */}
          {formatCurrency(item?.price * item?.quantity)}
        </span>
      </div>

      {/* Column 6: Remove Button (Mobile hidden) */}
      <div className="hidden md:flex justify-end col-span-2">
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-red-500 hover:text-white"
          onClick={handleRemoveItem}
        >
          <Trash2 size={18} /> Remove
        </Button>
      </div>
    </div>
  );
}
