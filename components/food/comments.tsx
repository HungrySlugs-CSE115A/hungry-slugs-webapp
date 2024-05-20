import { useEffect, useState } from "react";
import { Food, Comment } from "@/interfaces/Food";
import axios from "axios";

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

  // Dummy account data
  const user_id = "1234567890";

  const postComment = (comment: {
    food_name: string;
    user_id: string;
    comment: string;
  }) => {
    axios
      .post("http://localhost:8000/myapi/comments/", comment)
      .then((response) => {
        const updatedFood: Food = response.data;
        const updatedComments = updatedFood.comments;
        setComments(updatedComments);
        console.log(updatedComments[0]["date"]);
        console.log(pythonDatetimeToJsDatetime(updatedComments[0]["date"]));
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
            <p className="px-2">body: {comment.comment}</p>
            <p className="px-2">
              date: {pythonDatetimeToJsDatetime(comment.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-row">
        {/* text field */}
        <input
          type="text"
          value={textField}
          onChange={(e) => setTextField(e.target.value)}
          className="border border-gray-400"
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
        >
          Post
        </button>
      </div>
    </div>
  );
}
