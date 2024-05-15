import React from 'react';
import { deleteComment } from './example';

export interface CommentData {
  id: string;
  body: string;
  username: string;
  user_id: string;
  parent_id: string | null;
  time_posted: string;
}

interface CommentProps {
  comment: {
    body: string;
    username: string;
    user_id: string;
    time_posted: string; 
  };
  replies: CommentData[];
  currentUserId: string;
  deleteComment: (comment_id: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, replies, currentUserId, deleteComment }) => {
  // Don't allow editing or deleting comment after 5 minutes passed since posting
  const fiveMinutes: number = 300000; // 5 minutes in milliseconds
  const currentTime = new Date().getTime();
  const commentTime = new Date(comment.time_posted).getTime();
  const timePassed: boolean = (currentTime - commentTime) > fiveMinutes;
  const canReply = Boolean(currentUserId)
  const canEdit = currentUserId === comment.user_id && !timePassed;
  const canDelete = currentUserId === comment.user_id && !timePassed;
  const time_posted = new Date(comment.time_posted).toLocaleDateString();
  
  return (
    <div className="comment">
      <div className="comment_image_container">
        <img src="/user-icon.png"/>
      </div>
      <div className="comment_right_part">
        <div className="comment_content">
          <div className="comment_author">{comment.username}</div>
          <div>{time_posted}</div>
        </div>
        <div className="comment_text">{comment.body}</div>
        <div className="comment_actions">
          {canReply && <div className="comment_action">Reply</div>}
          {canEdit && <div className="comment_action">Edit</div>}
          {canDelete && (
            <div className="comment_action" onClick={() => deleteComment(comment.id)}>
              Delete</div>)}
        </div>
        {replies.length > 0 && (
          <div className="replies"> 
            {replies.map((reply) => (
              <Comment comment={reply} 
                key={reply.id} 
                replies={[]} 
                currentUserId={currentUserId} 
                deleteComment={deleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;