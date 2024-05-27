import { Location } from "@/interfaces/Location";
import { FrontEndReviews } from "@/interfaces/Review";

const backend = "http://localhost:8000";

export async function fetchLocations(): Promise<Location[]> {
  const res = await fetch("http://localhost:8000/api/locations", {
    next: {
      revalidate: 1800, // every 30 minutes
    },
  });
  const data: { locations: Location[] } = await res.json();
  return data.locations;
}

export async function fetchFoodReviewsBulk(data: {
  food_names: string[];
  user_id: string | null;
}): Promise<FrontEndReviews> {
  const res = await fetch("http://localhost:8000/api/get_ratings_bulk/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response_json = await res.json();
  return response_json;
}

export async function updateReview(data: {
  food_name: string;
  user_id: string;
  food_rating: number;
}): Promise<{ average: number | null }> {
  const res = await fetch("http://localhost:8000/api/rating_update/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response_json = await res.json();
  return response_json;
}
