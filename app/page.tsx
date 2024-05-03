"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Food {
  name: string;
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

function ButtonLink(props: any) {
  return (
    <div className="underline text-blue-600">
      <Link
        href={{
          pathname: `/${encodeURIComponent(props.number)}`,
          query: {
            name: props.name,
          },
        }}
      >
        {props.button_name}
      </Link>
    </div>
  );
}

export default function Home() {
  const [dhs_names, set_dhs_names] = useState([""]);

  <button id="myButton" className="float-left submit-button">
    Home
  </button>;

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        // get the data from the response
        const dhs: Array<DiningHall> = response.data["locations"];

        // print the data to the console
        console.log(dhs);

        // extract the names of the dining halls
        const dhs_names: string[] = [];
        dhs.forEach((dh: DiningHall) => {
          dhs_names.push(dh["name"]);
        });

        // set the state of the dining hall names
        set_dhs_names(dhs_names);
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
