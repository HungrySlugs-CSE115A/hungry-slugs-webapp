"use client";
import React from "react";
import { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
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
  const fetchUserInfo = async () => {
    try {
      // Retrieve the access token from storage
      const access_token = sessionStorage.getItem("token");

      // Fetch user info from Google OAuth2 API
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => res.data);

      // Update the user state
      setUser({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    googleLogout();
    axios
      .post("http://localhost:8000/myapi/logout/")
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
