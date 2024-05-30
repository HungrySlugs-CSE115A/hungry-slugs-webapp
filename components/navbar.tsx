"use client";
import { useState, useEffect } from "react";
import LoginPage from "./login"; // Used if not logged in
import { useCookies } from "react-cookie";

export default function Navbar({ height }: { height: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies] = useCookies(['authToken']);
  /*useEffect(() => {
    // Check if sessionStorage is available and if token exists
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);*/
  
    useEffect(() => {
      // Check if the authToken exists in cookies
      const token = cookies.authToken;
      setIsLoggedIn(!!token);
    }, [cookies]);

  return (
    <nav className="bg-white fixed w-full  top-0 start-0 ">
      <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-2.5">
        <a href="/" className="flex items-center">
          <span className="pl-5 self-left font-bold text-4xl text-[#003C6C]">
            Hungry Slugs
          </span>
        </a>

        <div className="" id="navbar-sticky">
          <ul className="flex flex-col  md:p-0  md:flex-row md:border-0 font-medium text-2xl  pl-10  text-[#003C6C]">
            <li>
              {" "}
              {/* replace the pound sign with actual link */}
              <a href="/" className="px-4">
                Home
              </a>
            </li>
            <li>
              <a href="/global_search" className="px-4">
                Search
              </a>
            </li>
            <li>
              {!isLoggedIn ? (
                <a className="pl-4 pr-5">
                  <LoginPage />
                </a>
              ) : (
                <a href="/profile" className="pl-4 pr-5">
                  Account
                </a>
              )}
            </li>
            <li>
              <a href="/search" className="pl-4 pr-5"></a>
              {/* pr-X dicates how far off right we want.  */}
            </li>
          </ul>
        </div>
      </div>
      <hr className={`h-px border-0 pt-[0.15%] dark:bg-yellow-400`}></hr>
    </nav>
  );
}
