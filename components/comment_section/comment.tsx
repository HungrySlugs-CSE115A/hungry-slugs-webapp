import React from 'react';

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
    username: string;
    time_posted: string; 
    body: string;
  };
  replies: CommentData[];
}

const Comment: React.FC<CommentProps> = ({ comment, replies }) => {
  return (
    <div className="comment">
      <div className="comment_image_container">
        <img src="/user-icon.png"/>
      </div>
      <div className="comment_right_part">
        <div className="comment_content">
          <div className="comment_author">{comment.username}</div>
          <div>{comment.time_posted}</div>
        </div>
        <div className="comment_text">{comment.body}</div>
        {replies.length > 0 && (
          <div className="replies"> 
            {replies.map((reply) => (
              <Comment comment={reply} key={reply.id} replies={[]}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;