"use client";
import { useEffect } from "react";

export default function Page({ params }: { params: { food: string } }) {
  useEffect;

  return (
    <div>
      <h1>{decodeURIComponent(params.food)}</h1>
    </div>
  );
}
