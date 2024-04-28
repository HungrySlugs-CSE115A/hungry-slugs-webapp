"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Meals {
  Breakfast: Array<string>;
  Lunch: Array<string>;
  Dinner: Array<string>;
  "Late Night": Array<string>;
}

export default function Page({
  searchParams,
}: {
  searchParams: {
    name: string;
    //meals: Meals;
  };
}) {
  const [meals, set_meals] = useState([]);
  const [mealTime, set_meal_time] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        const dhs = response.data["dining_halls"];
        const a_dh = dhs[name_to_dh_number(searchParams.name, dhs)]; //getting meals from dh that doesnt have meals will throw error
        //alert(a_dh);
        console.log(a_dh);
        if (Object.keys(a_dh).length == 1) {
          //trying to check if the dining hall even serves anything, I dont know if this works yet, will debug when I get the chance
          alert("Dh does not have meals I think");
          return;
        }

        const meal_time = a_dh["meals"]; //meal time keys?
        const breakfast = meal_time[Object.keys(meal_time)[0]]; //Object.keys(meal_time)[0] gets the first mealtime
        set_meals(breakfast);
        set_meal_time(Object.keys(meal_time)[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const test = ["test", "fuck"];
  //const foods = searchParams.meals;

  return (
    <main>
      <div>
        <h2 className="text-xl">Welcome to dining hall: {searchParams.name}</h2>
        <p>{mealTime}:</p>
        <ul>
          {meals.map((meal, i) => (
            <li key={i}>{meal}</li>
          ))}
        </ul>
      </div>
    </main> //create button to go to each dning hall hvac to pass data through button
  );
}
