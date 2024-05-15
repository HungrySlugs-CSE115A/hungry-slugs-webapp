"use client"
import React, { useState, useEffect } from 'react';
import { getComments as getCommentsApi, 
  createComment as createCommentApi, 
  deleteComment as deleteCommentApi } from './example';
import Comment, { CommentData } from './comment';
import CommentForm from './comment_form';
import './index.css';

interface CommentsProps {
  currentUserId: string;
}

const Comments: React.FC<CommentsProps> = ({ currentUserId }) => {
  const [backendComments, setBackendComments] = useState<CommentData[]>();

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
      setBackendComments([comment, ...(backendComments || [])]);
    });
  };

  const deleteComment = (comment_id: string): void => {
    if (window.confirm("Confirm: Delete comment?")) {
      deleteCommentApi(comment_id).then(() => {
        const updatedBackendComments = backendComments?.filter(
          (backendComment) => backendComment.id !== comment_id
        );
        setBackendComments(updatedBackendComments);
      });
    }
  };  

  useEffect(() => {
    getCommentsApi().then((data) => {
      setBackendComments(data);
    });
  }, []);

  return (
    <div className="comments">
      <h3 className="comments_title">Comments</h3>
      <div className="comment_form_title">Write Comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment}/>
      <div className="comments_container">
        {rootComments.map((rootComment) => (
          <Comment key={rootComment.id} 
          comment={rootComment} 
          replies={getReplies(rootComment.id)}
          currentUserId={currentUserId}
          deleteComment={deleteComment}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
