import { Food, Image } from "@/interfaces/Food";
import { useState } from "react";



// export interface Image {
//   user_id: string;
//   url: string;
//   date: string;
// }

// export interface Food {
//   name: string;
//   restrictions: Array<string> | never[];
//   comments: Array<Comment> | never[];
//   ratings: Ratings | never[];
//   images: Array<Image> | never[];
// }

export default function Images({ food }: { food: Food }) {
  const [images, setImages] = useState();
  const [url, setUrl] = useState(null);


  const addImage = (event: any) => {
    event.preventDefault();
    if (event.target.files.length !== 0) {
      const img_temp = event.target.files[0];
      setImages(img_temp);
      alert(event.target.files[0].name);
    }

  }

  const submitImage = (event: any) => {
    event.preventDefault();
    if (!images) {
      return;
    }
    alert('An image was submitted: ');
  }

  return (
    <div>
      <h1>{food && food.name}</h1>
      <h2>Images</h2>


      <div>
        Upload image
        <form onSubmit={submitImage}>
          <label form="img">Select image:</label>
          <input type="file"
            accept="image/*"
            onChange={(event) => addImage(event)}
          />
          <button type="submit" className="px-3"> Submit</button>
        </form>

      </div>

      <div>Image 1
        {food.images.map((image, index) => (
          <img key={index} src={image.url} alt="Uh oh - 404" />

        ))}
      </div>
    </div>
  );
}
