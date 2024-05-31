"use client";
import { useState } from "react";

import LocationFood from "@/components/location/food";

import { Location } from "@/interfaces/Location";
import { FrontEndReviews } from "@/interfaces/Review";

export default function LocationCategories({
  location,
  reviews,
}: {
  location: Location;
  reviews: FrontEndReviews;
}) {
  const currentHour = new Date().getHours();
  const [showCategories, setShowCategories] = useState<boolean[]>(
    new Array(location.categories.length).fill(false).map((_, index) => {
      switch (index) {
        case 0: // Breakfast (6 AM - 11 AM)
          return currentHour < 11;
        case 1: // Lunch (11 AM - 1 PM)
          return currentHour < 15;
        case 2: // Dinner (6 PM - 9 PM)
          return currentHour < 20;
        case 3: // Late Night (9 PM - 11 PM)
          return currentHour < 23;
        default:
          return false;
      }
    }),
  );

  interface RestrictionImageMap {
    [key: string]: string;
  }

  const restrictionImageMap: RestrictionImageMap = {
    eggs: "/Images/egg.jpg",
    vegan: "/Images/vegan.jpg",
    fish: "/Images/fish.jpg",
    veggie: "/Images/veggie.jpg",
    gluten: "/Images/gluten.jpg",
    pork: "/Images/pork.jpg",
    milk: "/Images/milk.jpg",
    beef: "/Images/beef.jpg",
    nuts: "/Images/nuts.jpg",
    halal: "/Images/halal.jpg",
    soy: "/Images/soy.jpg",
    shellfish: "/Images/shellfish.jpg",
    treenut: "/Images/treenut.jpg",
    sesame: "/Images/sesame.jpg",
    alcohol: "/Images/alcohol.jpg",
  };

  const menuArrow = (rotate180: boolean) => (
    <svg
      className={`h-6 w-6 mr-6 ${rotate180 ? "rotate-180" : ""}`}
      fill="#000000"
      height="800px"
      width="800px"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 330 330"
    >
      <path
        id="XMLID_224_"
        d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
      />
    </svg>
  );

  return (
    <div>
      {location.categories.map((category, i) => (
        <div key={i}>
          <div
            onClick={() => {
              const newShowCategories = [...showCategories];
              newShowCategories[i] = !newShowCategories[i];
              setShowCategories(newShowCategories);
            }}
            className="flex flex-row justify-between border-2 border-b-yellow-400 border-t-white border-r-white border-l-white hover:bg-[#F9F9F9] hover:rounded hover:border-t-gray-300 hover:border-r-gray-300 hover:border-l-gray-300"
          >
            <h2 className="text-2xl ml-6 text-[#003C6C] font-semibold">
              {category.name}
            </h2>
            {/* Icon for accordion that will face up on false and down on true */}
            <div className="flex justify-center items-center">
              {menuArrow(showCategories[i])}
            </div>
          </div>
          {showCategories[i] && (
            <div>
              {category.sub_categories.map((subCategory, j) => (
                <div key={j}>
                  <h3 className="ml-3 italic text-base font-semibold text-gray-700">
                    {subCategory.name}
                  </h3>
                  {subCategory.foods.map((food, k) => (
                    <LocationFood
                      key={k}
                      food_average={reviews[food.name]?.average}
                      food_name={food.name}
                      user_rating={reviews[food.name]?.user_rating}
                      restriction_images={food.restrictions.map(
                        (restriction) => restrictionImageMap[restriction],
                      )}
                      user_id={null}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
          {!showCategories[i] && (
            <div className="flex justify-center items-center">
              <h3 className="text-sm italic text-gray-700">Hidden</h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
