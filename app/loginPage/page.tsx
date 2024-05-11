"use client";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin, googleLogout, TokenResponse} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
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
  )
}

const LoginComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  
  


  useEffect(() => {
    console.log("LoginPage component mounted");
  }, []);

  /*const handleLoginSuccess = async (tokenResponse: any) => {
   if ('code' in tokenResponse) {
      // Handle authorization code flow
      console.log('Authorization Code:', tokenResponse.code);
      // Exchange code for tokens here
    } else {
      // Handle implicit flow
      console.log('Token Received:', tokenResponse.access_token);
      const decoded: User = jwtDecode(tokenResponse.id_token);
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });

     console.log(tokenResponse);
      axios.post('http://localhost:8000/myapi/users/google-oauth2/', { token: tokenResponse.access_token })
        .then(res => console.log('Backend login successful', res))
        .catch(err => console.error('Backend login failed', err));
    }*/
    /*console.log(tokenResponse);
    const decoded: User = jwtDecode(tokenResponse.id_token);

    setUser({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    })*/
          // fetching userinfo can be done on the client or the server
    

  
  
  const login = useGoogleLogin({
    flow: "implicit",
    
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      //handleLoginSuccess
      //client side authentication retrieve user info from access token
      const userInfo = await axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.}` },
      })
      
      .then(res => res.data);
      //frontend user info
      setUser({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
      })
      //send the token to backend
      axios.post('http://localhost:8000/myapi/users/', {tokenResponse: tokenResponse})
      .then(res => console.log('Backend login successful', res))
      .catch(err => console.error('Backend login failed', err))
  
      
    
      
    },
    onError: (errorResponse) => console.error('Login Failed', errorResponse),
  });

  const handleLogout = () => {
    googleLogout();
    setUser(null);  // Clears the user state, effectively logging out the user
    console.log('Logged out successfully');
  };
  return (
    <div>
      <button onClick={() => login()} className="hover:underline decoration-yellow-400 underline-offset-8 m-5 p-2 text-[#003C6C] font-medium text-xl">
        Login with Google
      </button>
      {user && (
        <div>
            <div className="center">
              <img src={user.picture} alt="User profile" />
            </div>
          <h2 className="m-5 p-2 text-[#003C6C] font-medium text-xl">Welcome, {user.name}</h2>
          <h3 className="m-5 p-2 text-[#003C6C] font-medium text-xl">Email: {user.email}</h3>
        </div>
      )}
      <button onClick={handleLogout} className="hover:underline decoration-yellow-400 underline-offset-8 top-0 right-0 m-5 p-2 text-[#003C6C] font-medium text-xl">
            Logout
      </button>
    </div>
    

  );
};

export default LoginPage;

