const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
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
    passwordResetToken: {
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

// Add method to instance of model
userSchema.methods = {
  isCorrectPassword: async function (userPassword) {
    const hashedPassword = this.password;
    return await bcrypt.compare(userPassword, hashedPassword);
  },
  createPasswordChangedToken: function () {
    // Create token reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetToken = resetTokenHash;
    // Assign time expire to 15m change to miliseconds
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

//Export the model
module.exports = mongoose.model("User", userSchema);
