import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import Button from "../Common/Button";
import ReusableSelect from "../Common/ReusableSelect";

const EditUserDialog = ({ user, open, onClose, onSave }) => {
  const [form, setForm] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    role: "",
    isBlocked: false, // 👈 Dùng isBlocked thay vì status
  });

  useEffect(() => {
    if (user) {
      setForm({
        _id: user._id || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile: user.mobile || "",
        role: user.role || "",
        isBlocked: user.isBlocked ?? false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and click Save when done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input name="mobile" value={form.mobile} onChange={handleChange} />
          </div>

          {/* Role */}
          <div>
            <ReusableSelect
              label="Role"
              value={form.role}
              onChange={(value) => setForm({ ...form, role: value })}
              options={[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
              ]}
            />
          </div>

          {/* isBlocked */}
          <div>
            <ReusableSelect
              label="Status"
              value={form.isBlocked ? "blocked" : "active"}
              onChange={(value) =>
                setForm({ ...form, isBlocked: value === "blocked" })
              }
              options={[
                {
                  value: "active",
                  label: "Active",
                  color: "text-green-600 font-medium",
                },
                {
                  value: "blocked",
                  label: "Blocked",
                  color: "text-red-600 font-medium",
                },
              ]}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
