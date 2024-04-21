"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Meals{
  "Breakfast": Array<string>;
  "Lunch": Array<string>;
  "Dinner": Array<string>;
  "Late Night": Array<string>;
}

export default function Page({searchParams, }:{searchParams:{
  name: string;
  //meals: Meals;
};
}) {
  const [meals, set_meals] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        const dhs = response.data["Dining Halls"];
        const a_dh = dhs[0]; 
        const meal_time = a_dh["meals"];
        const breakfast = meal_time["Dinner"];

        set_meals(breakfast);
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
 
        <p>Breakfast Meals:</p>
        <ul>
          {meals.map((meal, i) => (
            <li key={meal[i]}>{meal}</li>
          ))}
        </ul>
      </div>
    </main> //create button to go to each dning hall hvac to pass data through button
    );
}