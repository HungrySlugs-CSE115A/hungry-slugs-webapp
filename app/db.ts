import axios from "axios";

import { Location } from "@/interfaces/Location";
import { FrontEndReviews } from "@/interfaces/Review";

const backend = "http://localhost:8000";

export async function fetchLocations(): Promise<Location[]> {
  const res = await axios.get(`${backend}/api/locations`);
  return res.data.locations;
}

export async function fetchFoodReviewsBulk(data: {
  food_names: string[];
  user_id: string | null;
}): Promise<FrontEndReviews> {
  const res = await axios.post(`${backend}/api/get_ratings_bulk/`, data);
  return res.data;
}

export async function updateReview(data: {
  food_name: string;
  user_id: string;
  food_rating: number;
}): Promise<{ average: number | null }> {
  const res = await axios.post(`${backend}/api/rating_update/`, data);
  return res.data;
}
