"use client";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";


export default function Rating_bar({
    food_name,
    user_id
}: {
    food_name: string;
    user_id: string;
}) {


    return (
        <div className="flex items-center justify-center pb-4 ">
            rating  -  -
        </div>
    );
}
