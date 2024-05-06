"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface Food {
  name: string;
  extra_data: Array<string>
}

interface subCategory {
  name: string;
  foods: Array<Food>;
}

interface Category {
  name: string;
  sub_categories: Array<subCategory>;
}
import DhBar from "@/components/dh_bar_main";

interface DiningHall {
  name: string;
  categories: Category;
}
interface User {
  name: string;
  picture: string;
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

function Home() {
  const [dhs_names, set_dhs_names] = useState([""]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        // get the data from the response
        const dhs: Array<DiningHall> = response.data["locations"];

        // print the data to the console
        console.log(dhs);

        // extract the names of the dining halls
        const dhs_names: string[] = [];
        dhs.forEach((dh: DiningHall) => {
          dhs_names.push(dh["name"]);
        });

        // set the state of the dining hall names
        set_dhs_names(dhs_names);
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
          <ul className="flex flex-col  md:p-0  md:flex-row md:border-0 ">
            <li className="">
              <button className="px-10 hover:underline decoration-yellow-400 underline-offset-8 decoration-4" >Dining Halls</button>
            </li>
            <li>
              <a href="#" className="px-10 hover:underline decoration-yellow-400 underline-offset-8 decoration-4" >Markets</a>
            </li>
            <li>
              <a href="#" className="px-10 hover:underline decoration-yellow-400 underline-offset-8 decoration-4" >Cafes & Other</a>{/* pr-X dicates how far off right we want.  */}
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

export default function Page() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("Page component loaded and GoogleOAuthProvider should be active");
  }, []);

  const handleLogout = () => {
    googleLogout();
    setUser(null); // Clear user state on logout
    console.log('Logout Successful');
  };

  const handleLoginSuccess = (credentialResponse: any) => {
    console.log('Login Successful', credentialResponse);
    const decoded: User = jwtDecode(credentialResponse.credential);
    setUser({
      name: decoded.name,
      picture: decoded.picture
    });
  };

  return (
    <GoogleOAuthProvider clientId="1040494859138-vji3ddfil5jancg23ifaginvmn71hktf.apps.googleusercontent.com">
      <Home />
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      {user && (
        <div>
          <img src={user.picture} alt="User profile" />
          <h2>{user.name}</h2>
        </div>
      )}
      <button onClick={handleLogout} className="p-2 mt-2 text-white bg-red-600 rounded">Logout</button>
    </GoogleOAuthProvider>
  );
}