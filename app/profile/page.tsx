"use client";
import React from "react";
import { googleLogout } from "@react-oauth/google";

const Page = () => {
  const handleLogout = () => {
    googleLogout();
    // Remove the token from local storage
    localStorage.removeItem("token");
    // Redirect the user to the login page after logging out
    window.location.href = "/loginPage";
    console.log("Logged out successfully");
  };

  return (
    <div>
      <h1>Profile</h1>
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
