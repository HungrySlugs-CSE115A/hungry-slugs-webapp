"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Food {
  name: string;
  extra_data:Array<string>
}

interface subCategory {
  name: string;
  foods: Array<Food>;
}

interface Category {
  name: string;
  sub_categories: Array<subCategory>;
}

interface DiningHall {
  name: string;
  categories: Category;
}

function name_to_dh_index(dhName: string, dhArray: Array<DiningHall>) {
  for (let i = 0; i < dhArray.length; i++) {
    if (dhArray[i].name === dhName) {
      return i;
    }
  }
  return -1;
}

export default function Page({
  searchParams,
}: {
  searchParams: {
    name: string;
  };
}) {
  const [categories, set_categories]: [Array<Category>, any] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        // fetch the data from the response
        const dhs = response.data["locations"];

        // find the dining hall with the name
        const dh_index = name_to_dh_index(searchParams.name, dhs);
        // if the dining hall is not found, alert the user
        if (dh_index == -1) {
          alert("Dh not found");
          return;
        }

        // get the dining hall with the name
        const a_dh = dhs[dh_index];

        // get the categories from the dining hall
        set_categories(a_dh["categories"]);

        // if the dining hall does not have any values in the categories object, alert the user
        if (Object.keys(a_dh["categories"]).length == 0) {
          alert("No food categories found");
          return;
        }

        console.log(a_dh);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main>
      <div className="container mx-auto">
        {/* Dining Hall Name */}
        <h2 className="text-xl">{searchParams.name}</h2>

        {/* List all the meal times and their foods */}
        {categories &&
          categories.map((category: Category, i: number) => (
            <div key={i}>
              <h3 className="text-lg">{category.name}</h3>
              <ul>
                {category.sub_categories.map(
                  (sub_category: subCategory, j: number) => (
                    <li key={j}>
                      <h4 className="text-md">{sub_category.name}</h4>
                      <ul>
                        {sub_category.foods.map((food: Food, k: number) => (
                          <li key={k}>{food.name}</li>
                        ))}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
      </div>
    </main>
  );
}
