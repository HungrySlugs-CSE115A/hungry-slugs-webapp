import { useState, useEffect } from "react";
import axios from "axios";

function Feed() {
  const [feedData, setFeedData] = useState([]);

  useEffect(() => {
    // Fetch feed data from backend when component mounts
    const fetchFeedData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/feed");
        setFeedData(response.data);
      } catch (error) {
        console.error("Failed to fetch feed data:", error);
      }
    };

    fetchFeedData();
  }, []);

  return (
    <div className="feed">
      {feedData.map((item) => (
        <div key={item.id} className="feed-item">
          <h3>{item.user}</h3>
          <p>{item.caption}</p>
          <img src={item.imageUrl} alt="Uploaded" />
          {/* Additional metadata or actions */}
        </div>
      ))}
    </div>
  );
}

export default Feed;
