import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../main";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



// this profile is for student and tnp only

const StudentProfile = () => {
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/v1/user/myprofile", {
        withCredentials: true,
      });
      setProfileUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  const checkResumeScore = () => {
    const resumeScoreLink =
      "https://devyadav-00-resume-analyzer-appuistreamlit-app-zdmbk4.streamlit.app/";
    window.open(resumeScoreLink, "_blank");
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const userInfo = [
    { label: "Name", value: profileUser.name },
    { label: "Email", value: profileUser.email },
    { label: "Phone", value: profileUser.phone },
    { label: "Role", value: profileUser.role },
    ...(profileUser.role === "Student"
      ? [{ label: "Branch", value: profileUser.branch }]
      : []),
    { label: "Enrollment", value: profileUser.enrollment },
    { label: "Address", value: profileUser.address },
    ...(profileUser.role !== "tnp"
      ? [{ label: "Placement Status", value: profileUser.placementStatus }]
      : []),
  ];

  return (
      <div className="min-h-[85vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center py-1 px-4">
        <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl p-5 flex flex-col items-center transition-all duration-300 hover:shadow-3xl">
    
          {/* Profile and Heading */}
          <div className="flex flex-col items-center space-y-3 mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-md border-4 border-white">
              {profileUser?.name ? profileUser.name[0] : "?"}
            </div>
            <h1 className="text-3xl font-extrabold text-[#1C3C5B]">My Profile</h1>
            <p className="text-gray-600 text-sm text-center">Welcome to your dashboard.</p>
          </div>
    
          {/* Profile Info */}
          <div className="w-full max-w-md flex flex-col gap-1 mb-2">
            {userInfo.map((info, index) => {
              if (info.label === "Placement Status" && profileUser.role.toLowerCase() === "tnp") {
                return null;
              }
              return (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 border border-gray-300 border-opacity-20 rounded-md shadow-md hover:shadow-lg transition-all px-8 py-6 mx-2"
                >
                  <div className="w-40 text-base font-medium text-gray-600 text-left pl-4">
                    {info.label}:
                  </div>
                  <div className="flex-1 text-base font-semibold text-gray-800 truncate">
                    {info.value || "N/A"}
                  </div>
                </div>
              );
            })}
          </div>
    
          {/* Check Resume Score Button */}
          {profileUser.role !== "TNP" && (
            <div className="w-full flex justify-center mt-1"> 
              <button
                onClick={checkResumeScore}
                className="flex items-center gap-2 px-8 py-3 rounded-md bg-[#00b5ad] text-white text-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l3 3m0 0l-3 3m3-3H6m6 4v1a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v1"
                  />
                </svg>
                Check Resume Score
              </button>
            </div>
          )}
    
          {/* Logout Button */}
          <div className="mt-1 w-full flex justify-center"> 
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-8 py-3 rounded-md bg-[#1C3C5B] text-white text-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v1"
                />
              </svg>
              Logout
            </button>
          </div>
    
        </div>
      </div>
    );
    
};

export default StudentProfile;
