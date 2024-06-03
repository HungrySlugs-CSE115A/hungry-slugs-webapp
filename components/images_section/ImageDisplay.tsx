import React from "react";

interface ImageDisplayProps {
  imageName: string;
  userId: string;
  date: string;
  imageUrl: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageName,
  userId,
  date,
  imageUrl,
}) => {
  return (
    <div className="image-display">
      <div className="image-details">
        <p>
          <strong>Name:</strong> {imageName}
        </p>
        <p>
          <strong>Uploaded by:</strong> {userId}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
      </div>
      <img src={imageUrl} alt={imageName} className="uploaded-image" />
    </div>
  );
};

export default ImageDisplay;
