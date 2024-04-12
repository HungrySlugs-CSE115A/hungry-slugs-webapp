/** @jsxImportSource react */
"use client";  // This marks the component for client-side execution

import React, { useEffect, useState } from 'react';
import { db } from './config/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface BreakfastItem {
  id: string;
  name: string;
  description?: string;
}

export default function Page() {
  const [data, setData] = useState<BreakfastItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Breakfast Foods"));
      const items: BreakfastItem[] = [];
      querySnapshot.forEach((doc) => {
        const item = {
          id: doc.id,
          ...doc.data(),
        } as BreakfastItem;
        items.push(item);
      });
      setData(items);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Breakfast Menu</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.name} {item.description ? `- ${item.description}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}
