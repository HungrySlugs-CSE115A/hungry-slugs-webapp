"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Food {
  name: string;
  extra_data: Array<string>;
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

import DhBar from "@/components/dh_bar_main";

export default function Home() {
  const [dhs, setDhs] = useState<DiningHall[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/locations/")
      .then((response) => {
        const dhs: DiningHall[] = response.data["locations"];
        setDhs(dhs);
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

        <ul className="flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5">
          {[
            ["Dining Halls", "#"],
            ["Markets", "#"],
            ["Cafes & Other", "#"],
          ].map(([category, href]: Array<string>, i) => (
            <li key={i} className="">
              <a
                href={href}
                className="px-10 hover:underline decoration-yellow-400 underline-offset-8 decoration-4"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>

        <h3 className="w-full">
          <ul className="">
            {dhs.map((dh, i) => (
              <li key={i}>
                <DhBar name={dh.name} />
              </li>
            ))}
          </ul>
        </h3>
      </div>
    </main>
  );
}
