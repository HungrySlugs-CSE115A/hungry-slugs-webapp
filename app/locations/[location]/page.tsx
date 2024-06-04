"use client";
import {
  fetchLocations,
  fetchFoodReviewsBulk,
  fetchUserInfo,
} from "@/app/requests";
import { Location } from "@/interfaces/Location";
import { FrontEndReviews } from "@/interfaces/Review";

import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";

import LocationCategories from "@/components/location/categories";
import Link from "next/link";

export default function Page({ params }: { params: { location: number } }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [foodReviews, setFoodReviews] = useState<FrontEndReviews | null>(null);
  const [cookies] = useCookies(["userEmail"]);
  const alertShown = useRef(false);

  //const notificationsEnabled = cookies.notificationsEnabled === "true";
  const notificationsEnabled =
    localStorage.getItem("notificationsEnabled") === "true";

  const user_email = cookies.userEmail || 'anonymous';
  console.log(user_email);

  useEffect(() => {
    fetchLocations().then(async (locations: Location[]) => {
      if (params.location < 0 || params.location >= locations.length) {
        return <h1>Location not found</h1>;
      }
      const location: Location = locations[params.location];

      const food_names = location.categories.flatMap((category) =>
        category.sub_categories.flatMap((sub_category) =>
          sub_category.foods.map((food) => food.name),
        ),
      );

      //get username and set it
      let username = "";
      const userInfo = await fetchUserInfo();
      username = userInfo.email;
      console.log(username);

      fetchFoodReviewsBulk({
        food_names: food_names,
        user_id: user_email,
      }).then((reviews: FrontEndReviews) => {
        setLocation(location);
        setFoodReviews(reviews);
      });
    });
  }, [params.location]);
  useEffect(() => {
    if (
      location &&
      foodReviews &&
      notificationsEnabled &&
      !alertShown.current
    ) {
      Object.keys(foodReviews).forEach((foodName) => {
        const review = foodReviews[foodName];
        if (user_email !== "anonymous" && review.user_rating === 5) {
          alert(
            `One of your favorite foods is being served! Food: ${foodName}`,
          );
          alertShown.current = true;
        }
      });
    }
  }, [location, foodReviews, notificationsEnabled, user_email]);

  if (!location || !foodReviews) {
    return <h1>Loading...</h1>;
  }

  return (
    <main>
      <div className="container mx-auto">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
            {location.name}
          </h1>
          <Link
            href={`/locations/${params.location}/DH_Search`}
            className="bg-blue-500 text-white rounded hover:bg-blue-600 px-3 py-2"
          >
            Location Search
          </Link>
        </div>
        <LocationCategories location={location} reviews={foodReviews} />
      </div>
    </main>
  );
}
