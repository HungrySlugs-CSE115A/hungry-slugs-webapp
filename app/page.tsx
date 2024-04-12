// page.tsx

// This line marks this component as a Client Component
/** @jsxImportSource react */
"use client"; // This pragma is crucial for using useEffect and other client-side features

import React, { useEffect, useState } from 'react';
import { db } from './config/firebase';  // Adjust the path as necessary
import { doc, getDoc } from 'firebase/firestore';

export default function Page() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "Breakfast Foods", "1");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!"); }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to the Page!</h1>
      {userData && <p>User Name: {userData.name}</p>}
    </div>
  );
}
