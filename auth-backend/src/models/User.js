const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      trim: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    refreshTokens: {
      type: [
        {
          token: {
            type: String,
            required: true,
          },
          userAgent: {
            type: String,
            default: "Unknown Device",
          },
          ip: {
            type: String,
            default: "Unknown IP",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
// Runs every time before a user is saved to the database. It hashes the password only if it has been modified.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Whenever user is converted to JSON, it automatically remove sensitive fields
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;

    delete ret._id;
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.verificationToken;
    delete ret.verificationTokenExpires;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.__v;

    return ret;
  },
});

userSchema.methods.generateAccessToken = function () {
  return generateAccessToken({
    id: this._id,
    role: this.role,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return generateRefreshToken({
    id: this._id,
  });
};

module.exports = mongoose.model("User", userSchema);
