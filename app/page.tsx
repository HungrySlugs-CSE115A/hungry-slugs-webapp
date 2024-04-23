"use client";
import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import Link from "next/link"

interface DiningHall {
  name: string;
  meals: any;

}


function ButtonLink(props: any) {
  return (
    <div className="underline text-blue-600">
      <Link href={{
        pathname: `/${encodeURIComponent(props.number)}`,
        query: {
          name: props.name
        }
      }}>{props.button_name}</Link>
    </div>
  );
}


export default function Home() {
  const [dhs_names, set_dhs] = useState([]);
  const [dh_name, set_dh_name] = useState("");
  const [meals, set_meals] = useState([]);


  <button id="myButton" className="float-left submit-button" >Home</button>


  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        const dhs: Array<DiningHall> = response.data["dining_halls"];

        console.log(dhs);

        const result: string[] = [];
        dhs.forEach((value: DiningHall, index: number) => {
          result.push(dhs[index].name);
        })
        set_dhs(result);
        const a_dh = dhs[0];
        set_dh_name(a_dh["name"]);
        const meal_time = a_dh["meals"];
        const breakfast = meal_time["Breakfast"];

        set_meals(breakfast);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <main>
      <div>
        {/* Title */}
        <h1 className="text-8xl">Welcome to Hungry Slugs!</h1>
        {/* Display All of the dinning hall names as links */}
        <ul>

          {dhs_names.map((dh, i) => (
            <li key={i}>
              <ButtonLink button_name={dh} name={dh} />
            </li>
          ))}

        </ul>
      </div>
    </main>
  );
}
