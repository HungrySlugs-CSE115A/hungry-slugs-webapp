"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin, googleLogout} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface DiningHall {
  name: string;
  meals: any;
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
        const dhs: Array<DiningHall> = response.data["dining_halls"];

        // print the data to the console
        console.log(dhs);

        // extract the names of the dining halls
        const dhs_names_temp: string[] = [];
        dhs.forEach((value: DiningHall) => {
          dhs_names_temp.push(value.name);
        });

        // set the state of the dining hall names
        set_dhs_names(dhs_names_temp);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main>
      <div>
        {/* Title */}
        <h1 className="text-8xl">Welcome to Hungry Slugs!</h1>
        {/* Display All of the dinning hall names as links */}
        <ul>
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