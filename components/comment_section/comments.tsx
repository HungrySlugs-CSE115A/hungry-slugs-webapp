"use client"
import React, { useState, useEffect } from 'react';
import { getComments as getCommentsApi, 
  createComment as createCommentApi, 
  deleteComment as deleteCommentApi, 
  updateComment as updateCommentApi} from './example';
import Comment, { CommentData } from './comment';
import CommentForm from './comment_form';

interface CommentsProps {
  currentUserId: string;
}

const Comments: React.FC<CommentsProps> = ({ currentUserId }) => {
  const [backendComments, setBackendComments] = useState<CommentData[]>();
  const [activeComment, setActiveComment] = useState<{ id: string, type: string } | null>(null);
  const rootComments = backendComments ? backendComments.filter((backendComment) => backendComment.parent_id === null) : [];
  
  const getReplies = (comment_id: string): CommentData[] => {
    return backendComments?.filter(backendComment => backendComment.parent_id === comment_id)?.sort(
      (a, b) =>
        new Date(a.time_posted).getTime() - new Date(b.time_posted).getTime()
    ) || [];
  };

  const addComment = (text: string, parent_id: string | null) => {
    console.log("addComment", text, parent_id);
    createCommentApi(text, parent_id).then((comment) => {
      // Add the new comment to backendComments
      setBackendComments([comment, ...(backendComments || [])]);
      // Closes the textbox after posting comment
      setActiveComment(null);
    });
  };

  const deleteComment = (comment_id: string): void => {
    if (window.confirm("Confirm: Delete comment?")) {
      deleteCommentApi(comment_id).then(() => {
        const updatedBackendComments = backendComments?.filter(
          (backendComment) => backendComment.id !== comment_id
        );
        // Update backendComments after deleting the comment
        setBackendComments(updatedBackendComments);
      });
    }
  };  

  const updateComment = (text: string, comment_id: string) => {
    updateCommentApi(text).then(() => {
      const updatedBackendComments = backendComments?.map(backendComment => {
        if (backendComment.id === comment_id) {
          // Update the body of the comment with the new text
          return {...backendComment, body: text};
        }
        return backendComment;
      });
      setBackendComments(updatedBackendComments);
      // Closes the textbox after editing comment
      setActiveComment(null);
    });
  };


  useEffect(() => {
    getCommentsApi().then((data) => {
      setBackendComments(data);
    });
  }, []);

  return (
    <div className="comments mt-5 p-4">
      {/* <h3 className="comments_title text-3xl mb-5">Comments</h3> */}
      <CommentForm submitLabel="Post" handleSubmit={addComment}/>
      <div className="comments_container mt-10">
        {/* Map through root comments and render each Comment component */}
        {rootComments.map((rootComment) => (
          <Comment 
          key={rootComment.id} 
          comment={rootComment} 
          replies={getReplies(rootComment.id)}
          currentUserId={currentUserId}
          deleteComment={deleteComment}
          addComment={addComment}
          updateComment={updateComment}
          activeComment={activeComment}
          setActiveComment={setActiveComment}
          parentId={rootComment.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
