"use client";
import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useCookies } from "react-cookie";

import { GOOGLE_CLIENT_ID } from "@/private/secrets";

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
  const [loggedIn, setLoggedIn] = useState(false);
  const [cookies, setCookie] = useCookies(["authToken", "userEmail"]);

  useEffect(() => {
    console.log("LoginPage component mounted");
  }, []);

  const handleLogin = useGoogleLogin({
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // Store authentication token in the browser's storage for navigation bar use
      sessionStorage.setItem("token", tokenResponse.access_token);
      const expires = new Date();
      expires.setHours(expires.getHours() + 3);
      setCookie("authToken", tokenResponse.access_token, {
        path: "/",
        expires,
      });
      // Redirect the user to main page
      window.location.href = "/";
      //handleLoginSuccess
      //client side authentication retrieve user info from access token
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);
      //console.log("userEmail:", userInfo.email);
      setCookie("userEmail", userInfo.email, { path: "/", expires });
      //send the token to backend
      axios
        .post("http://localhost:8000/api/users", {
          tokenResponse: tokenResponse,
        })
        .then((res) => console.log("Backend login successful", res))
        .catch((err) => console.error("Backend login failed", err));
    },
    onError: (errorResponse) => console.error("Login Failed", errorResponse),
  });

  return <button onClick={() => handleLogin()}>Account</button>;
};

export default LoginPage;
