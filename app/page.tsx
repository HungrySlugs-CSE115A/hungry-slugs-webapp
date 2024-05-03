"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import DhBar from "@/components/dh_bar_main";

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
        <h1 className="font-semibold py-5 text-4xl text-[#003C6C] flex items-center justify-center">
          Locations
        </h1>

        <h2 className="font-medium text-2xl text-[#003C6C]  flex items-center justify-center pb-5">
          <ul className="flex flex-col  md:p-0  md:flex-row md:border-0  ">
            <li>
              <a href="#" className="px-10" >Dining Halls</a>
            </li>
            <li>
              <a href="#" className="px-10" >Markets</a>
            </li>
            <li>
              <a href="#" className="px-10" >Cafes & Other</a>{/* pr-X dicates how far off right we want.  */}
            </li>

            <li>
              <p className="relative group">
                <span>Test</span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-2 dark:bg-yellow-400 group-hover:w-1/2 group-hover:transition-all"></span>
                <span className="absolute -bottom-1 right-1/2 w-0 h-2 dark:bg-yellow-400 group-hover:w-1/2 group-hover:transition-all"></span>
              </p>

            </li>
          </ul>
        </h2>

        <h3 className="w-full">
          
          <ul className="">
            {dhs_names.map((dh, i) => (
              <li key={i}>
                <DhBar name={dh} />
              </li>
            ))}
          </ul>
        </h3>

        <ul className="">
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
