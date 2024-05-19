"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import LocationFood from "@/components/location/food";

interface Food {
  name: string;
  restrictions: Array<string>;
}

interface SubCategory {
  name: string;
  foods: Array<Food>;
}

interface Category {
  name: string;
  sub_categories: Array<SubCategory>;
}

interface Location {
  name: string;
  categories: Category[];
}

export default function Page({ params }: { params: { location: number } }) {
  const [location, setLocation] = useState<Location>();
  const [showCategories, setShowCategories] = useState<boolean[]>();

  // fetch location data
  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/locations/")
      .then((response) => {
        // Fetch the locations data
        const locations: Location[] = response.data["locations"];

        // get the location data
        const location = locations[params.location];

        // Set the location
        setLocation(location);

        // Set the show categories to array of booleans
        setShowCategories(new Array(location.categories.length).fill(true));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.location]); // params.location is a dependency

  const handleDiningHallSearch = () => {
    
    const searchResultPageUrl = `/locations/${params}/DH_Search`;
    // Navigate to the search result page
    window.location.href = searchResultPageUrl;
    localStorage.setItem('diningHall', location.name);
  };

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
          {location && location.name}
        </h1>
        <button
          onClick={handleDiningHallSearch}
          className="mb-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Dining Hall Search
        </button>
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
                    className={`h-6 w-6 mr-6 ${showCategories && showCategories[i] ? "rotate-180" : ""}`}
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
                          restrictions={food.restrictions}
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
