"use client";

import { useState, useEffect } from "react";
import axios from "axios";


interface DiningHall {
  name: string;
}

function name_to_dh_number(dhName: string, dhArray: Array<DiningHall>){
  let n = dhArray.map(e => e.name).indexOf(dhName)
  return  n; //returns the index of the dining hall passed in
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
        const a_dh = dhs[name_to_dh_number(searchParams.name, dhs)]; //getting meals from dh that doesnt have meals will throw error
        //alert(a_dh);
        console.log (a_dh);
        
        const meal_time = a_dh["meals"]; //meal time keys?
        const breakfast = meal_time[Object.keys(meal_time)[0]]; //Object.keys(meal_time)[0] gets the first mealtime
        set_meals(breakfast);
        //console.log(meals)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  

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