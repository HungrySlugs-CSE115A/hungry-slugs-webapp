"use client";
import React, { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useCookies } from "react-cookie";
import { fetchFoodReviewsBulk } from "../db";
import { fetchUserInfo } from "@/app/user_info";
import Image from "next/image";
import { FrontEndReviews } from "@/interfaces/Review";

interface User {
  name: string;
  email: string;
  picture: string;
}

const imageWidth = 100;
const imageHeight = 100;

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['authToken', 'userEmail', 'notificationsEnabled']);
  const [reviews, setReviews] = useState<FrontEndReviews>({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(cookies.notificationsEnabled === 'true');

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const access_token = cookies.authToken;

        if (!access_token) {
          console.error("No access token found");
          return;
        }

        const userInfo = await axios
          .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
          })
          .then((res) => res.data);

        setUser({
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        });
        setCookie("userEmail", userInfo.email, { path: '/' });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
    setNotificationsEnabled(cookies.notificationsEnabled === 'true');
  }, [cookies.authToken, cookies.notificationsEnabled, setCookie]);

  const handleLogout = () => {
    googleLogout();
    removeCookie("authToken", { path: '/' });
    removeCookie("userEmail", { path: '/' });
    window.location.href = "/";
    console.log("Logged out successfully");
  };

  const fetchReviews = async (userEmail: string) => {
    try {
      const reviews = await fetchFoodReviewsBulk({
        food_names: [],
        user_id: userEmail,
      });
      setReviews(reviews);
      console.log("Fetched Reviews:", reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    setCookie('notificationsEnabled', newState.toString(), { path: '/' });
    
    console.log(`Notifications are now ${newState ? 'enabled' : 'disabled'}`);
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
        onClick={toggleNotifications}
        className="hover:underline decoration-yellow-400 underline-offset-8 top-0 right-0 m-5 p-2 text-[#003C6C] font-medium text-xl"
      >
        {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
      </button>
      <button
        onClick={handleLogout}
        className="hover:underline decoration-yellow-400 underline-offset-8 top-0 right-0 m-5 p-2 text-[#003C6C] font-medium text-xl"
      >
        Logout
      </button>
    </div>
  );
};

export default Page;
