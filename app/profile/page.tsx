"use client";
import React, { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  fetchLocations,
  fetchFoodReviewsBulk,
  fetchUserInfo,
} from "@/app/requests";
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
  const [cookies, setCookie, removeCookie] = useCookies([
    "authToken",
    "userEmail",
  ]);
  const [reviews, setReviews] = useState<FrontEndReviews>({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notificationsEnabled") === "true",
  );
  const [foodNames, setFoodNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
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
        setCookie("userEmail", userInfo.email, { path: "/" });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    const getLocationsAndFoodNames = async () => {
      try {
        const locations = await fetchLocations();
        const allFoodNames = locations.flatMap((location) =>
          location.categories.flatMap((category) =>
            category.sub_categories.flatMap((sub_category) =>
              sub_category.foods.map((food) => food.name),
            ),
          ),
        );
        setFoodNames(allFoodNames);
        console.log("Food Names:", allFoodNames);
      } catch (error) {
        console.error("Error fetching locations and food names:", error);
      }
    };
    getUserInfo();

    getLocationsAndFoodNames();
  }, [cookies.authToken, setCookie]);

  const handleLogout = () => {
    googleLogout();
    removeCookie("authToken", { path: "/" });
    removeCookie("userEmail", { path: "/" });
    window.location.href = "/";
    console.log("Logged out successfully");
  };
  useEffect(() => {
    if (user && user.email) {
      fetchReviews(user.email);
    }
  }, [user, foodNames]);

  const fetchReviews = async (userEmail: string) => {
    try {
      const reviews = await fetchFoodReviewsBulk({
        food_names: foodNames,
        user_id: userEmail,
      });
      const filteredReviews = Object.fromEntries(
        Object.entries(reviews).filter(
          ([_, review]) => review.user_rating != null,
        ),
      );
      setReviews(filteredReviews);
      setLoading(false);
      console.log("Fetched Reviews:", filteredReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem("notificationsEnabled", newState.toString());

    console.log(`Notifications are now ${newState ? "enabled" : "disabled"}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[#003C6C] font-medium text-xl">Profile</h1>
      {user && (
        <div className="flex flex-col items-center">
          <Image
            src={user.picture}
            alt="User profile"
            width={imageWidth}
            height={imageHeight}
            className="rounded-full border-4 border-[#003C6C]"
          />
          <h2 className="mt-2 text-center">
            Welcome, {user.name} - {user.email}
          </h2>
        </div>
      )}
      <div className="w-full mt-5">
        <h2 className="text-[#003C6C] font-medium text-xl text-center">
          Your Food Reviews:
        </h2>
        {loading ? (
          <h1 className="text-center">Loading...</h1>
        ) : (
          <ul className="text-center bg-gray-100 p-4 rounded-lg">
            {Object.entries(reviews).map(([food_name, review]) => (
              <li key={food_name} className="mb-2 text-[#003C6C]">
                <h3 className="font-bold">{food_name}</h3>
                <p>Rating: {review.user_rating}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={toggleNotifications}
        className="hover:underline decoration-yellow-400 underline-offset-8 m-5 p-2 text-[#003C6C] font-medium text-xl"
      >
        {notificationsEnabled
          ? "Disable Notifications"
          : "Enable Notifications"}
      </button>
      <button
        onClick={handleLogout}
        className="hover:underline decoration-yellow-400 underline-offset-8 m-5 p-2 text-[#003C6C] font-medium text-xl"
      >
        Logout
      </button>
    </div>
  );
};
export default Page;
