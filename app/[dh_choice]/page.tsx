"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface DiningHall {
  name: string;
  meals: any;
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
  const [meal_times, set_meal_times] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        // fetch the data from the response
        const dhs = response.data["dining_halls"];

        // find the dining hall with the name
        const dh_index = name_to_dh_index(searchParams.name, dhs);
        // if the dining hall is not found, alert the user
        if (dh_index == -1) {
          alert("Dh not found");
          return;
        }

        // get the dining hall with the name
        const a_dh = dhs[dh_index];

        // get the meals from the dining hall
        set_meal_times(a_dh["meals"]);

        // if the dining hall does not have any values in the meals object, alert the user
        if (Object.keys(a_dh["meals"]).length == 0) {
          alert("No meals found");
          return;
        }
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
        {
          // create an array of arrays of the meal times and their foods
          meal_times &&
            Object.entries(meal_times).map(
              ([meal_time, foods]: Array<string | Array<string> | any>, i) => (
                <div key={i}>
                  <h3 className="text-lg py-5">{meal_time}</h3>
                  <ul>
                    {foods.map((food: string, j: number) => (
                      <li key={j}>{food}</li>
                    ))}
                  </ul>
                </div>
              )
            )
        }
      </div>
    </main>
  );
}
