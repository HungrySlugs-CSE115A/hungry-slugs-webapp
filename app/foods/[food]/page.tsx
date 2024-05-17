"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Page({ params }: { params: { food: string }}) {
  useEffect(() => {
    axios
      .get(`http://localhost:8000/myapi/foods/${encodeURIComponent(params.food)}/`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
        }
        else {
          console.error(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.food]);

  return (
    <div>
      <h1>{decodeURIComponent(params.food)}</h1>
    </div>
  );
}
