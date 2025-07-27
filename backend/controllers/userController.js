import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { TPO } from "../models/tpoModel.js";
import { sendVerificationCode } from "../utils/verifyEmail/email.js";
import { sentRegisteredEmail } from "../utils/registeredUser/register.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role, enrollment, address, branch } = req.body;

  if (!name || !email || !phone || !password || !role || !address || !branch) {
    return next(new ErrorHandler("Please fill the complete form!"));
  }

  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    enrollment,
    address,
    branch,
    verificationCode,
  });
  
  sendVerificationCode(email, verificationCode);

  res.status(200).json({
    success: true,
    message: "Verification code sent to your email. Please check your inbox.",
    user,
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role, verificationCode } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }
  // const user = await User.findOne({ email }).select("+password");
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid Email.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password.", 400));
  }

  if (role === "TNP") {
    if (user.verificationCode !== verificationCode) {
      return next(new ErrorHandler("Invalid verification code.", 400));
    }
    if (user.isVerified === false) {
      sentRegisteredEmail(user);
    }
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
  }

  
  if (role === "Student" && user.isVerified === false) {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    sendVerificationCode(email, verificationCode);
    user.verificationCode = verificationCode;
    await user.save();

    res.status(200).json({
    success: true,
    message: "Verification code sent to your email. Please check your inbox.",
    user,
  });
  }

  sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// verification code controller
export const verifyUser = catchAsyncErrors(async (req, res, next) => {
  const { verificationCode, email } = req.body;
  if (!verificationCode || !email) {
    return next(new ErrorHandler("Please provide verification code."));
  }
  // console.log(verificationCode, email);

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  if (user.verificationCode !== verificationCode) {
    return next(new ErrorHandler("Invalid verification code.", 400));
  }

  user.isVerified = true;
  user.verificationCode = null;
  await user.save();

  sentRegisteredEmail(user);

  sendToken(user, 201, res, "User Registered Successfully!");
});

// generate verification code and send it to the user's email while login
export const generateVerificationCode = catchAsyncErrors(
  async (req, res, next) => {
    const { email } = req.body;

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found.", 404));
    }
    user.verificationCode = verificationCode;
    await user.save();
    sendVerificationCode(email, verificationCode);
    res.status(200).json({
      success: true,
      message: "Verification code sent to your email. Please check your inbox.",
    });
  }
);

  export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  if (!verificationCode) {
    return next(new ErrorHandler("Verification code is required.", 400));
  }
    if (user.verificationCode === verificationCode) {
      res.status(200).json({
        success: true,
        message: "Verification code is correct.",
      });
  }
    
  });

export const generateNewPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
      return next(new ErrorHandler("User not found.", 404));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 201, res, "Password updated successfully.");
  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

// update password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  // console.log(oldPassword, newPassword);
  

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Old password and new password are required.", 400));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully.");
});

// Function to get the user's profile
export const getMyProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});




// Function to get students by branch for TNP

export const getStudentsByBranch = async (req, res) => {
  try {
    const tnpId = req.user._id; // assuming req.user is the logged-in TNP

    const tnp = await User.findById(tnpId);

    if (!tnp || tnp.role !== "TNP") {
      return res.status(400).json({ message: "Invalid TNP user" });
    }

    const students = await User.find({
      role: "Student",
      branch: tnp.branch, // matching branch
    });

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updatePlacementStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { placementStatus } = req.body;

    if (!placementStatus) {
      return res.status(400).json({ message: "Placement status is required." });
    }

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    student.placementStatus = placementStatus;
    await student.save();

    res.status(200).json({ message: "Placement status updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
