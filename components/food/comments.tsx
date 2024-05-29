import { useEffect, useState } from "react";
import { Food, Comment } from "@/interfaces/Food";
import axios from "axios";
import { fetchUserInfo } from "@/app/user_info";

function pythonDatetimeToJsDatetime(pythonDatetime: string): Date {
  const [date, time] = pythonDatetime.split("T");
  const [year, month, day] = date.split("-");
  const [hour, minute, second] = time.split(":");
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second),
  );
}

export default function Comments({ food }: { food: Food }) {
  const [comments, setComments] = useState<Comment[]>(food.comments);
  const [textField, setTextField] = useState("");
  const [user_id, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        const email = userInfo.email
        setUserId(email ? email : "anonymous");
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }; 
    getUserInfo(); // Call the function to fetch user info
  }, []);
  // const username = sessionStorage.getItem("username")
  // const user_id = username ? username : "anonymous";

  const postComment = (comment: {
    food_name: string;
    user_id: string | null;
    comment: string;
  }) => {
    axios
      .post("http://localhost:8000/api/comments/", comment)
      .then((response) => {
        const updatedFood: Food = response.data;
        const updatedComments = updatedFood.comments;
        setComments(updatedComments);
        setTextField(""); // Clear the textarea after submission
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>{food && food.name}</h1>
      <h2>Comments</h2>
      <div>
        {comments.map((comment, i) => (
          <div key={i} className="flex flex-row">
            <p className="px-2">{comment.user_id}</p>
            <p className="px-2">:{comment.comment}</p>
            <p className="px-2">{pythonDatetimeToJsDatetime(comment.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-row mt-4">
        {/* text field */}
        <input
          type="text"
          value={textField}
          onChange={(e) => setTextField(e.target.value)}
          className="w-full h-10 border border-gray-300 p-2 mb-2 mt-2 break-all max-w-full"
          style={{ borderColor: "rgb(107, 114, 128)" }}
        />

        {/* post button */}
        <button
          onClick={() =>
            postComment({
              food_name: food.name,
              user_id: user_id,
              comment: textField,
            })
          }
          className={`ml-2 text-white ${
            textField.length === 0 ? "bg-gray-300 cursor-default" : "bg-blue-500 hover:bg-blue-700"
          } rounded-md px-4 py-2`}
          disabled={textField.length === 0}
        >
          Post
        </button>
      </div>
    </div>
  );
}
