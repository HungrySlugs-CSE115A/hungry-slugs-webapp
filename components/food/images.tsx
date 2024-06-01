import React, { useState } from "react";
import axios from "axios";
import { Food } from "@/interfaces/Food";
import ImageDisplay from "@/components/images_section/ImageDisplay"; // Import ImageDisplay component

interface ImagesProps {
  food: Food;
}

const Images: React.FC<ImagesProps> = ({ food }) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImageDetails, setUploadedImageDetails] = useState<{
    imageName: string;
    userId: string;
    date: string;
    imageUrl: string;
  } | null>(null);

  const handleImageUpload = async () => {
    if (!image) return; // No image selected

    try {
      const formData = new FormData();
      formData.append("image", image);

      // Send image data to backend
      const response = await axios.post("http://localhost:8000/api/upload_image/", formData);

      // Handle success and set uploaded image details
      const { imageName, userId, date, imageUrl } = response.data;
      setUploadedImageDetails({ imageName, userId, date, imageUrl });
    } catch (error) {
      // Handle error
      console.error("Failed to upload image:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    setImage(selectedImage);
  };

  return (
    <div>
      <h1>{food && food.name}</h1>
      <h2>Images</h2>
      <div>
        {/* Input field for selecting an image */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {/* Button to trigger image upload */}
        <button onClick={handleImageUpload}>Upload Image</button>
      </div>
      {/* Display uploaded image details */}
      {uploadedImageDetails && (
        <ImageDisplay
          imageName={uploadedImageDetails.imageName}
          userId={uploadedImageDetails.userId}
          date={uploadedImageDetails.date}
          imageUrl={uploadedImageDetails.imageUrl}
        />
      )}
    </div>
  );
};

export default Images;
