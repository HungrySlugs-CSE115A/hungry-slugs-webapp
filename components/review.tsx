"use client";
import Link from "next/link";



export default function Rating_bar({
    name,
}: {
    name: string;

}) {
    return (
        <div className="flex items-center justify-center pb-4 ">
            rating
        </div>
    );
}

export function Review_bar({
    name,
}: {
    name: string;
}) {


    return (
        <div className="flex items-center justify-center pb-4 ">
            review
        </div>
    );
}

