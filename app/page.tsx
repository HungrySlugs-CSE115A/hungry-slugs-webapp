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
  const [dhs, setDhs] = useState<DiningHall[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<{ food: Food; dhName: string; categoryName: string }[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [noFoodsFound, setNoFoodsFound] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        const dhs: DiningHall[] = response.data["locations"];
        setDhs(dhs);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    const allFoods: { food: Food; dhName: string; categoryName: string }[] = [];
    dhs.forEach((dh) => {
      dh.categories.forEach((category) => {
        category.sub_categories.forEach((subCategory) => {
          subCategory.foods.forEach((food) => {
            allFoods.push({ food, dhName: dh.name, categoryName: category.name });
          });
        });
      });
    });

    const filtered = allFoods
      .filter(({ food }) => food.name.toLowerCase().includes(searchInput.toLowerCase()))
      // .filter(({ food }, index, self) => self.findIndex(({ food }) => food.name === food.name) === index);

    setNoFoodsFound(filtered.length === 0);
    setFilteredFoods(filtered);
    setShowSearchResults(true);
  };

  return (
    <main>
      <div>
        {/* Title */}
        <h1 className="text-8xl">Welcome to Hungry Slugs!</h1>
        {/* Search bar */}
        {/* <div className="search-bar">
          <input
            type="text"
            placeholder="Search foods..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div> */}
        {/* Display search results if button clicked */}
        {showSearchResults && (
          <div>
            <h3>Search Results:</h3>
            <ul>
              {filteredFoods.map(({ food, dhName, categoryName }, index) => (
                <li key={index}>
                  {food.name} - {categoryName} ({dhName})
                </li>
              ))}
            </ul>
          </div>
        )}
      
      {noFoodsFound && (
          <div>
            <h3>No foods found at this dining hall.</h3>
          </div>
        )}
        {/* Display all dining halls */}
        <div>
          <h2>Dining Halls:</h2>
          <ul>
            {dhs.map((dh, i) => (
              <li key={i}>
                <ButtonLink button_name={dh.name} name={dh.name} />
              </li>
            ))}
          </ul>
        </div>
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