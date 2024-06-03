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
  const [userId, setUserId] = useState("anonymous");
  const [userInfoLoaded, setUserInfoLoaded] = useState(false); // Track if user info is loaded
  //const [editIndex, setEditIndex] = useState<number | null>(null);
  //const [editTextField, setEditTextField] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      setUserId(userInfo.email);
      setUserInfoLoaded(true); // Set to true
      //console.log("comments userid:", userId);
    };
    getUserInfo(); // Call the function to fetch user info
  }, [userId]);

  const postComment = async (comment: {
    food_name: string;
    user_id: string;
    comment: string;
  }) => {
    if (!userInfoLoaded) return; // Ensure user info is loaded before posting

    try {
      const response = await axios.post("http://localhost:8000/api/comments/", comment);
      const updatedFood: Food = response.data;
      const updatedComments = updatedFood.comments;
      setComments(updatedComments);
      setTextField(""); // Clear the textarea after submission
    } catch (error) {
      console.error(error);
    }
  };

/*   const editComment = (index: number) => {
    setEditIndex(index);
    setEditTextField(comments[index].comment); // Set textarea value to the comment text
  };

  const saveEditedComment = async (commentId: number) => {
    const updatedComments = [...comments];
    updatedComments[editIndex!].comment = editTextField; // Update the comment text
    setComments(updatedComments);
    setEditIndex(null);
    setEditTextField(""); // Clear the textarea

    // Make Axios call to update the comment on the backend
    const editedComment = {
      id: commentId, // Use the provided commentId
      comment: editTextField,
    };

    try {
      const response = await axios.put(`http://localhost:8000/api/comments/${commentId}/`, editedComment);
      console.log("Comment updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  }; */

  return (
    <div>
      <h1 className="text-2xl text-[#003C6C] flex items-center justify-center py-3 mr-2 mb-1">{food && food.name}</h1>
      <div>
        {comments.map((comment, i) => (
          <div className="max-w-[600px] mx-auto border border-gray-300 p-3 mb-3">
            <div className="flex-row items-center mb-1">
              <span className="text-[#003C6C] items-center justify-center py-5 font-bold mr-2">{comment.user_id}</span>
              <span className="text-gray-500 text-sm">{pythonDatetimeToJsDatetime(comment.date).toLocaleString()}</span>
              {/* {userId === comment.user_id && (
                <>
                  {editIndex !== i ? (
                    <button onClick={() => editComment(i)} className="mr-2 px-4">Edit</button>
                  ) : (
                    <>
                      <button onClick={() => saveEditedComment(comments[i].id)} className="ml-4 mr-2 px-2 py-1 bg-blue-500 text-white rounded-md">Save</button>
                      <button onClick={() => setEditIndex(null)}>Cancel</button>
                    </>
                  )}
                </>
              )} */}
            </div>
            <p className="px-2 break-words">
              {comment.comment}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-row mt-4">
        <input
          type="text"
          value={textField}
          onChange={(e) => setTextField(e.target.value)}
          className="w-full h-10 border border-gray-300 p-2 mb-2 mt-2 break-all max-w-full"
          style={{ borderColor: "rgb(107, 114, 128)" }}
        />
        <button
          onClick={() =>
            postComment({
              food_name: food.name,
              user_id: userId,
              comment: textField,
            })
          }
          className={`ml-2 text-white ${
            textField.length === 0 || !userInfoLoaded ? "bg-gray-300 cursor-default" : "bg-blue-500 hover:bg-blue-700"
          } rounded-md px-4 py-2`}
          disabled={textField.length === 0 || !userInfoLoaded}
        >
          Post
        </button>
      </div>
    </div>
  );
}
