"use client";
import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

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

  useEffect(() => {
    console.log("LoginPage component mounted");
  }, []);

  const handleLogin = useGoogleLogin({
    flow: "implicit",

    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      // Store authentication token in the browser's storage for navigation bar use
      sessionStorage.setItem("token", tokenResponse.access_token);
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

  return <button onClick={() => handleLogin()}>Account</button>;
};

export default LoginPage;
