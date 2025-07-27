import express from "express";
import { login, register, logout, getUser, getMyProfile, verifyUser, generateVerificationCode, forgotPassword, generateNewPassword, updatePassword, getStudentsByBranch, updatePlacementStatus } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyUser);
router.post("/generate-code", generateVerificationCode);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.post("/forgot-password", forgotPassword);
router.post("/generate-new-password", generateNewPassword);
router.post("/update-password", isAuthenticated, updatePassword);
router.get("/myprofile", isAuthenticated, getMyProfile);
router.get("/getstudents", isAuthenticated, getStudentsByBranch);
router.put("/updatestatus/:studentId", updatePlacementStatus);

export default router;