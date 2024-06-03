"use client";
import { useState, useEffect } from "react";
import LoginPage from "./login"; // Used if not logged in
import Link from "next/link";

export default function Navbar({ height }: { height: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if sessionStorage is available and if token exists
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="bg-white fixed w-full  top-0 start-0 ">
      <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-2.5">
        <Link href="/" className="flex items-center">
          <h1 className="pl-5 self-left font-bold text-4xl text-[#003C6C]">
            Hungry Slugs
          </h1>
        </Link>

        <div className="" id="navbar-sticky">
          <ul className="flex flex-col  md:p-0  md:flex-row md:border-0 font-medium text-2xl  pl-10  text-[#003C6C]">
            <li>
              <Link href="/" className="px-4">
                Home
              </Link>
            </li>
            <li>
              <Link href="/global_search" className="px-4">
                Search
              </Link>
            </li>
            <li>
              {!isLoggedIn ? (
                <div className="pl-4 pr-5">
                  <LoginPage />
                </div>
              ) : (
                <Link href="/profile" className="pl-4 pr-5">
                  Account
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
      <hr className={`h-px border-0 pt-[0.15%] dark:bg-yellow-400`}></hr>
    </nav>
  );
}
