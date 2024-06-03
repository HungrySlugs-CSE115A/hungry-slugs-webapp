"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Food } from "@/interfaces/Food";
import { fetchUserInfo } from "@/app/requests"; // Import fetchUserInfo function
import "@/components/food/Images.css"; // Import the CSS file

interface ImagesProps {
  food: Food;
}

const Images: React.FC<ImagesProps> = ({ food }) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImageDetails, setUploadedImageDetails] = useState<{
    imageName: string;
    uploadedBy: string; // Rename to avoid conflict
    date: string;
    imageUrl: string;
  } | null>(null);
  const [userId, setUserId] = useState("anonymous");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        const email = userInfo.email;
        setUserId(email ? email : "anonymous");
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    getUserInfo(); // Call the function to fetch user info
  }, []);

  const handleImageUpload = async () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("user_id", userId); // Use the state userId

      // Send image data to backend
      const response = await axios.post(
        "http://localhost:8000/api/upload_image/",
        formData
      );

      // Log the response to debug
      console.log("API response:", response.data);

      // Handle success and set uploaded image details
      const { imageName, user_id, date, imageUrl } = response.data;
      setUploadedImageDetails({
        imageName,
        uploadedBy: user_id,
        date,
        imageUrl,
      });
    } catch (error) {
      // Handle error
      console.error("Failed to upload image:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    setImage(selectedImage);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="images-container">
      <h1 className="food-name">{food && food.name}</h1>
      <h2 className="section-title">Images</h2>
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
        <button onClick={handleImageUpload} className="upload-button">
          Upload Image
        </button>
      </div>
      {uploadedImageDetails && (
        <div className="uploaded-image-details">
          <div className="image-details">
            <p>
              <strong>Name:</strong> {uploadedImageDetails.imageName}
            </p>
            <p>
              <strong>Uploaded by:</strong> {uploadedImageDetails.uploadedBy}
            </p>
            <p>
              <strong>Date:</strong> {formatDateTime(uploadedImageDetails.date)}
            </p>
          </div>
          <img
            src={uploadedImageDetails.imageUrl}
            alt={uploadedImageDetails.imageName}
            className="uploaded-image"
          />
        </div>
      )}
    </div>
  );
};

export default Images;
