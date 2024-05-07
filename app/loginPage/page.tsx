"use client"
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import axios from "axios";

interface User {
    name: string;
    email: string;
    picture: string;
}


const LoginPage = () => {
    const [user, setUser] = useState<User | null>(null);
    console.log("Page linked");

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
          email: decoded.email,
          picture: decoded.picture
        });

        // Send user data to backend
        axios.post('http://localhost:8000/myapi/users/', {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture
        })
        .then(response => console.log('User saved in backend', response))
        .catch(error => console.error('Failed to save user', error));
      };

    return (
      <GoogleOAuthProvider clientId="1040494859138-vji3ddfil5jancg23ifaginvmn71hktf.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        {user && (
          <div>
            <img src={user.picture} alt="User profile" />
            <h2>{user.name} - {user.email}</h2>
          </div>
        )}
        <button onClick={handleLogout} className="p-2 mt-2 text-white bg-red-600 rounded">Logout</button>
      </GoogleOAuthProvider>
    );
}
export default LoginPage;