"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Food } from "@/interfaces/Food";
import { fetchUserInfo } from "@/app/requests"; // Import fetchUserInfo function
import "@/components/food/Images.css"; // Import the CSS file
import Image from "next/image";

interface ImagesProps {
  food: Food;
}

interface ImageDetails {
  imageName: string;
  uploadedBy: string;
  date: string;
  imageUrl: string;
}

const Images: React.FC<ImagesProps> = ({ food }) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<ImageDetails[]>([]);
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
      const { imageName, imageUrl } = response.data;
      const date = new Date().toISOString();

      // Remove "/public" from the imageUrl
      const cleanImageUrl = imageUrl.replace("/public", "");

      console.log("Uploaded image URL:", cleanImageUrl); // Log the cleaned image URL

      const newImageDetails: ImageDetails = {
        imageName,
        uploadedBy: userId,
        date: date,
        imageUrl: cleanImageUrl,
      };

      setUploadedImages((prevImages) => [...prevImages, newImageDetails]);
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
      <div className="uploaded-images-list">
        {uploadedImages.map((details, index) => (
          <div key={index} className="uploaded-image-details">
            <div className="image-details">
              <p>
                <strong>Name:</strong> {details.imageName}
              </p>
              <p>
                <strong>Uploaded by:</strong> {details.uploadedBy}
              </p>
              <p>
                <strong>Date:</strong> {formatDateTime(details.date)}
              </p>
            </div>
            <Image
              src={details.imageUrl}
              alt={details.imageName}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
