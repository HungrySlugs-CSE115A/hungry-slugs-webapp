"use client";
import React, { useContext, useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin, googleLogout, TokenResponse} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";




interface User {
  name: string;
  email: string;
  picture: string;
}
const LoginPage = () => {
  return(
    <GoogleOAuthProvider clientId={'1040494859138-vji3ddfil5jancg23ifaginvmn71hktf.apps.googleusercontent.com'}>
      <LoginComponent/>
    </GoogleOAuthProvider>
  )
}


const LoginComponent = () => {
  const [user, setUser] = useState<User | null>(null);




  useEffect(() => {
    console.log("LoginPage component mounted");
  }, []);


  const handleLoginSuccess = (tokenResponse: any) => {
    if ('code' in tokenResponse) {
      // Handle authorization code flow
      console.log('Authorization Code:', tokenResponse.code);
      // Exchange code for tokens here

      // Store authentication token in the browser's local storage for navigation bar use
      localStorage.setItem('token', tokenResponse.code)
      // Redirect the user to main page
      window.location.href = '/'; 
    } else {
      // Handle implicit flow
      console.log('Token Received:', tokenResponse.access_token);
      const decoded: User = jwtDecode(tokenResponse.id_token);
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
      // Send token to backend if necessary
      axios.post('http://localhost:8000/myapi/users/google-oauth2/', { token: tokenResponse.access_token })
        .then(res => console.log('Backend login successful', res))
        .catch(err => console.error('Backend login failed', err));
    }


  };
  const handleLogin = useGoogleLogin({
    flow: "auth-code",
   
    onSuccess: (tokenResponse) => {
      handleLoginSuccess(tokenResponse);
      console.log('Logged in successfully');
    },
    onError: (errorResponse) => console.error('Login Failed', errorResponse),
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
      <button onClick={() => handleLogin()} className="hover:underline decoration-yellow-400 underline-offset-8 m-5 p-2 text-[#003C6C] font-medium text-xl">
        Login with Google
      </button>
      {/* <button onClick={handleLogout} className="hover:underline decoration-yellow-400 underline-offset-8 top-0 right-0 m-5 p-2 text-[#003C6C] font-medium text-xl">
        Logout
      </button> */}
      {user && (
        <div>
          <img src={user.picture} alt="User profile" />
          <h2>Welcome, {user.name} - {user.email}</h2>
        </div>
      )}
    </div>
   
  );
};


export default LoginPage;