"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  googleLogout,
  TokenResponse,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface User {
  name: string;
  email: string;
  picture: string;
}
const LoginPage = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginComponent />
    </GoogleOAuthProvider>
  );
};

const LoginComponent = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("LoginPage component mounted");
  }, []);

  const handleLogin = useGoogleLogin({
    flow: "implicit",

    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      // Store authentication token in the browser's local storage for navigation bar use
      localStorage.setItem("token", tokenResponse.access_token);
      // Redirect the user to main page
      window.location.href = "/";
      //handleLoginSuccess
      //client side authentication retrieve user info from access token
      //send the token to backend
      axios
        .post("http://localhost:8000/myapi/users", {
          tokenResponse: tokenResponse,
        })
        .then((res) => console.log("Backend login successful", res))
        .catch((err) => console.error("Backend login failed", err));
    },
    onError: (errorResponse) => console.error("Login Failed", errorResponse),
  });

  // const handleLogout = () => {
  //   googleLogout();
  //   setUser(null);  // Clears the user state, effectively logging out the user
  //   // Remove the token from local storage
  //   localStorage.removeItem('token');
  //   // Redirect the user to the login page
  //   window.location.href = '/loginPage';
  //   console.log('Logged out successfully');
  // };

  return (
    <div>
      <button
        onClick={() => handleLogin()}
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
