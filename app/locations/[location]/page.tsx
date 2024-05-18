"use client";

import LocationFood from "@/components/location/food";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

interface Food {
  name: string;
  restrictions: string[]; // Change to string array
}

interface subCategory {
  name: string;
  foods: Food[]; // Update to use the Food interface
}

interface Category {
  name: string;
  sub_categories: subCategory[];
}

interface Location {
  name: string;
  categories: Category[];
}

interface RestrictionImageMap {
  [key: string]: string;
}

const restrictionImageMap = {
        eggs: "app/locations/Images/egg.jpg",
        vegan: "app/locations/Images/vegan.jpg",
        fish: "app/locations/Images/fish.jpg",
        veggie: "app/locations/Images/veggie.jpg",
        gluten: "app/locations/Images/gluten.jpg",
        pork: "app/locations/Images/pork.jpg",
        milk: "app/locations/Images/milk.jpg",
        beef: "app/locations/Images/beef.jpg",
        nuts: "app/locations/Images/nuts.jpg",
        halal: "app/locations/Images/halal.jpg",
        soy: "app/locations/Images/soy.jpg",
        shellfish: "app/locations/Images/shellfish.jpg",
        treenut: "app/locations/Images/treenut.jpg",
        sesame: "app/locations/Images/sesame.jpg",
        alcohol: "app/locations/Images/alcohol.jpg",
};

export default function Page({ params }: { params: { location: number } }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [showCategories, setShowCategories] = useState<boolean[]>([]);

  useEffect(() => {
    axios
      .get<Location[]>("http://localhost:8000/myapi/locations/")
      .then((response) => {
        const locations: Location[] = response.data["locations"];
        const location = locations[params.location];
        setLocation(location);
        setShowCategories(new Array(location.categories.length).fill(true));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.location]);

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
          {location && location.name}
        </h1>
        {location &&
          location.categories.map((category, i) => (
            <div key={i}>
              <div
                onClick={() => {
                  const newShowCategories = [...(showCategories || [])];
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
                  <svg
                    className={`h-6 w-6 mr-6 ${
                      showCategories && showCategories[i] ? "rotate-180" : ""
                    }`}
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
                </div>
              </div>
              {showCategories && showCategories[i] && (
                <div>
                  {category.sub_categories.map((subCategory, j) => (
                    <div key={j}>
                      <h3 className="ml-3 italic text-base font-semibold text-gray-700">
                        {subCategory.name}
                      </h3>
                      {subCategory.foods.map((food, k) => (
                        <LocationFood
                          key={k}
                          food_name={food.name}
                          restriction_images={food.restrictions.map(
                            (restriction) => restrictionImageMap[restriction]
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {showCategories && !showCategories[i] && (
                <div className="flex justify-center items-center">
                  <h3 className="text-sm italic text-gray-700">Hidden</h3>
                </div>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}
