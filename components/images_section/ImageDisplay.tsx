import React from "react";

interface ImageDisplayProps {
  userId: string;
  date: string;
  imageUrl: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ userId, date, imageUrl }) => {
  return (
    <div className="image-display">
      <h2>Uploaded Image Details</h2>
      <div>
        {/* Display uploaded image */}
        <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
      </div>
      <div>
        <p>User ID: {userId}</p>
        <p>Date: {date}</p>
      </div>
    </div>
  );
};

export default ImageDisplay;
