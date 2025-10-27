import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import logo from "@/assets/logo.png";
import Button from "../Common/Button";

export function CustomDialog({
  open, // optional: dùng khi controlled
  onOpenChange, // optional
  trigger, // optional: JSX để mở dialog (uncontrolled)
  title, // optional: string
  description, // optional: string
  children, // nội dung chính
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  showFooter = true,
  className = "",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Dùng trigger nếu có */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={`max-w-lg rounded-2xl shadow-2xl space-y-6 bg-white transition-all ${className}`}
      >
        {(title || description) && (
          <DialogHeader className="flex text-center space-y-2">
            <img src={logo} alt="logo" className="w-50 object-contain mb-2 " />
            {title && (
              <DialogTitle className="text-2xl font-bold text-gray-900 mt-8 text-center">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-gray-600 text-sm">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="px-1">{children}</div>

        {showFooter && (
          <DialogFooter className="flex gap-3 pt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={onCancel}
              >
                {cancelText}
              </Button>
            </DialogClose>

            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
            >
              {confirmText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
