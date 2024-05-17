"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Page({ params }: { params: { food: string } }) {
  const [tabSelected, setTabSelected] = useState(0);
  const tabs = [
    [
      "Comments",
      () => {
        setTabSelected(0);
      },
    ],
    [
      "Ratings",
      () => {
        setTabSelected(1);
      },
    ],
    [
      "Images",
      () => {
        setTabSelected(2);
      },
    ],
  ];

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/myapi/foods/${encodeURIComponent(params.food)}/`
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
        } else {
          console.error(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.food]);

  return (
    <main className="flex flex-col items-center">
      <ul className="flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5">
        {tabs.map(([category, funct]: Array<string | (() => void)>, i) => (
          <li key={i} className="">
            <button
              onClick={funct as () => void}
              className="px-10 hover:underline decoration-yellow-400 underline-offset-8 decoration-4"
            >
              {category as string}
            </button>
          </li>
        ))}
      </ul>
      <h1 className="text-2xl">{decodeURIComponent(params.food)}</h1>
      {[<div>test 0</div>, <div>test 1</div>, <div>test 2</div>].map(
        (pageContent, i) => (
          <div key={i} className="flex flex-col items-center">
            {tabSelected === i && (
              <div>
                <h2>{tabs[i][0] as string}</h2>
                {pageContent}
              </div>
            )}
          </div>
        )
      )}
    </main>
  );
}
