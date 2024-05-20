import React from "react";
import Comments from "@/components/comment_section/comments";

// Just for testing comments component on own page
const Page = () => {
  return (
    <div>
      <h1></h1>
      <Comments currentUserId="1" />
    </div>
  );
};

export default Page;
