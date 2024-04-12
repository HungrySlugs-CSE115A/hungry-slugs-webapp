"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/hello-world/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main>
      <div>
        <h1 className="text-8xl">Welcome to Hungry Slugs!</h1>
        <p className="text-xl">{message}</p>
      </div>
    </main>
  );
}
