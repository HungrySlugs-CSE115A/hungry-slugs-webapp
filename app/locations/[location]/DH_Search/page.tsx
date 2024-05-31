"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { fetchLocations } from "@/app/db";

import { Location, Food } from "@/interfaces/Location";
import Link from "next/link";

interface FoodWithCategory {
  food: Food;
  category: string;
}

export default function Page({ params }: { params: { location: number } }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [foods, setFoods] = useState<FoodWithCategory[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [foundFoods, setFoundFoods] = useState<FoodWithCategory[]>([]);

  useEffect(() => {
    fetchLocations().then((locations: Location[]) => {
      if (params.location < 0 || params.location >= locations.length) {
        return <h1>Location not found</h1>;
      }
      const location: Location = locations[params.location];
      setLocation(location);

      const foods_db = location.categories.flatMap((category) =>
        category.sub_categories.flatMap((sub_category) =>
          sub_category.foods.map((food) => ({
            food: food,
            category: category.name,
          }))
        )
      );
      setFoods(foods_db);
    });
  }, [params.location]);

  if (!location || !foods) {
    return <h1>Loading...</h1>;
  }

  // const filterFoods = (foods: Food[], filters: IDK (a list of restriction that will be filtered) ) => {};

  const searchForFood = (food_name: string) => {
    // search for food
    let foundFoods = foods.filter((foodWithCategory) =>
      foodWithCategory.food.name.toLowerCase().includes(food_name.toLowerCase())
    );

    // get the filters from local storage
    // const filters = localStorage.getItem("filters"); // IDK or something like that

    // apply filters
    // foundFoods = filterFoods(foundFoods, filters);

    setFoundFoods(foundFoods);
  };

  return (
    <main>
      <div className="container mx-auto">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
            {location.name}
          </h1>
        </div>

        <div className="search-bar flex justify-center items-center mb-5">
          <input
            type="text"
            placeholder="Search foods..."
            className="border border-gray-400 p-2 rounded"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            onClick={() => searchForFood(searchInput)}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        <div>
          {foundFoods.length > 0 &&
            foundFoods.map((foodWithCategory, index) => (
              <div
                key={index}
                className="flex flex-row justify-between hover:border-gray-300 hover:rounded-[2px] border-white border bg-[#F9F9F9] font-medium text-gray-700 py-1 my-1 text-sm"
              >
                <Link
                  className="flex flex-row ml-3"
                  href={`/foods/${encodeURIComponent(foodWithCategory.food.name)}`}
                >
                  <h4 className="px-2">{foodWithCategory.food.name}</h4>
                  <h5 className="font-normal text-gray-400 px-2">
                    {foodWithCategory.category}
                  </h5>
                </Link>
                <ul className="flex flex-row mr-3">
                  {foodWithCategory.food.restrictions.map(
                    (restriction, index) => (
                      <li key={index} className="px-2">
                        <Image
                          src={`/images/restrictions/${restriction}.jpg`}
                          alt={restriction}
                          width={25}
                          height={25}
                        />
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
