import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../main";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TPOProfile = () => {
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthorized, setIsAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/v1/tpo/me", {
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
        "http://localhost:4000/api/v1/tpo/logout",
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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const userInfo = [
    { label: "Name", value: profileUser.firstname + " " + profileUser.lastname },
    { label: "Email", value: profileUser.email },
    { label: "Phone", value: profileUser.phone },
    { label: "Role", value: "TPO" }, // As TPO role is fixed
    
  ];

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-green-100 via-blue-100 to-indigo-100 py-24 px-6 md:px-12 flex items-center justify-center">

  <div className="bg-white shadow-2xl rounded-3xl w-full max-w-3xl p-10 flex flex-col items-center transition-all duration-300 hover:shadow-3xl hover:scale-105 transform ease-in-out">
    
    <div className="flex flex-col items-center space-y-4 mb-10">
      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-500 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white">
        {profileUser?.name ? profileUser.name[0] : "?"}
      </div>
      <h1 className="text-1xl font-extrabold text-green-900">TPO Profile</h1>
      <p className="text-gray-600 text-sm text-center">Manage and view placement activities.</p>
    </div>

    {/* Profile Info Section */}
    <div className="w-full max-w-2xl flex flex-col gap-1 mb-8">
      {userInfo.map((info, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-50 border border-gray-300 border-opacity-20 rounded-md shadow-md hover:shadow-lg transition-all px-6 py-8 mx-1" 
        >
          <div className="w-40 text-base font-medium text-gray-600 text-center pl-2">
            {info.label}:
          </div>
          <div className="flex-1 text-base font-semibold text-gray-800 truncate pl-4">
            {info.value || "N/A"}
          </div>
        </div>
      ))}
    </div>

    {/* Logout Button */}
    <div className="mt-6 w-full flex justify-center">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 transform ease-in-out"
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

export default TPOProfile;
