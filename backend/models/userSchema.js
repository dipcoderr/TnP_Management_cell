import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  enrollment: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please enter your Address!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    // maxLength: [32, "Password cannot exceed 32 characters!"],
    // select: false,
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Student", "TNP"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined"],
    default: function () {
      return this.role === "TNP" ? "Pending" : undefined;
    },
    required: function () {
      return this.role === "TNP";
    },
  },
  branch: {
    type: String,
    required: [true, "Please enter your Branch!"],
  },
  placementStatus: {
    type: String,
    enum: ["None", "Normal", "Standard", "Dream"],
    default: "None",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};  



export const User = mongoose.model("User", userSchema);