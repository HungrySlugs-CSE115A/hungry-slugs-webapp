"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface DiningHall {
  name: string;
  meals: any;
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
        const dhs: Array<DiningHall> = response.data["dining_halls"];

        // print the data to the console
        console.log(dhs);

        // extract the names of the dining halls
        const dhs_names_temp: string[] = [];
        dhs.forEach((value: DiningHall) => {
          dhs_names_temp.push(value.name);
        });

        // set the state of the dining hall names
        set_dhs_names(dhs_names_temp);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main>
      <div>
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
