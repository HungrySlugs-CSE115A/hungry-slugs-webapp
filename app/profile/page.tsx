"use client";
import React from "react";
import { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { fetchUserInfo } from "@/app/user_info";

interface User {
  name: string;
  email: string;
  picture: string;
}
import Image from "next/image";
const imageWidth = 100;
const imageHeight = 100;

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const getUserInfo = async () => {
    try {
      const userInfo = await fetchUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const handleLogout = () => {
    googleLogout();
    axios
      .post("http://localhost:8000/api/logout/")
      .then((res) => console.log("Backend logout successful", res))
      .catch((err) => console.error("Backend logout failed", err));

    // Remove the token from local storage
    sessionStorage.removeItem("token");
    // Redirect the user to the main page after logging out
    window.location.href = "/";
    console.log("Logged out successfully");
  };

  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <Image
            src={user.picture}
            alt="User profile"
            width={imageWidth}
            height={imageHeight}
          />
          <h2>
            Welcome, {user.name} - {user.email}
          </h2>
        </div>
      )}
      <button
        onClick={() => handleLogout()}
        className="hover:underline decoration-yellow-400 underline-offset-8 top-0 right-0 m-5 p-2 text-[#003C6C] font-medium text-xl"
      >
        Logout
      </button>
    </div>
  );
};

export default Page;
