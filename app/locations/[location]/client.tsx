"use client";
import { useEffect, useState } from "react";
import { useCookies } from 'next-client-cookies';

export default function ClientComponent() {
  console.log("running client");
  // State to store the user token
  const [userToken, setUserToken] = useState<string>(""); 

  // Effect to retrieve the token from sessionStorage
  useEffect(() => {
    // Retrieve the token from sessionStorage
    const token = sessionStorage.getItem("email");
    // Update the state with the retrieved token or set it to "anonymous" if not found
    setUserToken(token || "anonymous");
  }, []); 

  const cookies = useCookies();
  cookies.set("username", userToken);
  
};
