import axios from "axios";

import { Location } from "@/interfaces/Location";
import { FrontEndReviews } from "@/interfaces/Review";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export async function fetchLocations(): Promise<Location[]> {
  const res = await api.get(`/locations/`).catch((err) => {
    console.error(err);
  });

  if (!res) {
    return [];
  }

  return res.data.locations;
}

export async function fetchFoodReviewsBulk(data: {
  food_names: string[];
  user_id: string;
}): Promise<FrontEndReviews> {
  const res = await api.post(`/get_ratings_bulk/`, data).catch((err) => {
    console.error(err);
  });

  if (!res) {
    return {};
  }

  return res.data;
}

export async function updateReview(data: {
  food_name: string;
  user_id: string;
  food_rating: number;
}): Promise<{ average: number | null }> {
  const res = await api.post(`/rating_update/`, data).catch((err) => {
    console.error(err);
  });

  if (!res) {
    return { average: null };
  }

  return res.data;
}

export async function fetchUserInfo() {
  try {
    const access_token = sessionStorage.getItem("token");

    if (!access_token) {
      throw new Error("No access token found in session storage.");
    }

    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

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
}
