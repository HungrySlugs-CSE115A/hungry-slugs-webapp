"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  googleLogout,
  TokenResponse,
} from "@react-oauth/google";

import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface User {
  name: string;
  email: string;
  picture: string;
}
const LoginPage = () => {
  return(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginComponent/>
    </GoogleOAuthProvider>
  );
};

const LoginComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  
  


  useEffect(() => {
    console.log("LoginPage component mounted");
  }, []);
  
  const login = useGoogleLogin({
    flow: "implicit",
    
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      // Store authentication token in the browser's local storage for navigation bar use
      localStorage.setItem("token", tokenResponse.access_token);
      // Redirect the user to main page
      window.location.href = "/";
      //handleLoginSuccess
      //client side authentication retrieve user info from access token
      //send the token to backend
      axios.post('http://localhost:8000/myapi/users', {tokenResponse: tokenResponse})
      .then(res => console.log('Backend login successful', res))
      .catch(err => console.error('Backend login failed', err))
      
    },
    onError: (errorResponse) => console.error('Login Failed', errorResponse),
  });
  return (
    <div>
      <button
        onClick={() => login()}
        className="hover:underline decoration-yellow-400 underline-offset-8 m-5 p-2 text-[#003C6C] font-medium text-xl"
      >
        Login with Google
      </button>
      {/* <button onClick={handleLogout} className="hover:underline decoration-yellow-400 underline-offset-8 top-0 right-0 m-5 p-2 text-[#003C6C] font-medium text-xl">
        Logout
      </button> */}
    </div>
  );
};

export default LoginPage;
