const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    // Save Array of Ids from Address
    address: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
    // Save Array of Ids from Product
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    // Is this account user locked ?
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    // Token send to email when user forgot or change password
    passwordToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // Hashed Password Before Create a User
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//Export the model
module.exports = mongoose.model("User", userSchema);
