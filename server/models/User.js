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
    avatar: {
      type: String,
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
    cart: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
      },
    ],
    // Save Array of Ids from Address
    address: { type: Array, default: [] },
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
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
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
// TTL index to auto delete unverified users after 24 hours
userSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { isVerified: false },
  }
);
// Add method to instance of model
userSchema.methods = {
  isCorrectPassword: async function (userPassword) {
    const hashedPassword = this.password;
    return await bcrypt.compare(userPassword, hashedPassword);
  },

  generateToken: function (tokenField, expiresField) {
    // 1. Create token reset
    const token = crypto.randomBytes(32).toString("hex");
    // 2. Hash token reset and save to DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // 3. Set time expire
    this[tokenField] = hashedToken;
    this[expiresField] = Date.now() + 15 * 60 * 1000;

    return token;
  },
  createEmailVerificationToken: function () {
    return this.generateToken(
      "emailVerificationToken",
      "emailVerificationExpires"
    );
  },
  createPasswordResetToken: function () {
    return this.generateToken("passwordResetToken", "passwordResetExpires");
  },
};

//Export the model
module.exports = mongoose.model("User", userSchema);
