"use client";
import axios from "axios";

export const fetchUserInfo = async () => {
  try {
    const access_token = sessionStorage.getItem("token");

    if (!access_token) {
      throw new Error("No access token found in session storage.");
    }

    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = response.data;

    return {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error; // Re-throw the error so it can be handled by the calling code
  }
};