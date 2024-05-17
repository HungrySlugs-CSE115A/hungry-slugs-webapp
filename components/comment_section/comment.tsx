import React from 'react';
import CommentForm from './comment_form';

// Define the shape of each comment's data
export interface CommentData {
  id: string;
  body: string;
  username: string;
  user_id: string;
  parent_id: string | null;
  time_posted: string;
}

// Define the props expected by the Comment component
interface CommentProps {
  comment: {
    id: string;
    body: string;
    username: string;
    user_id: string;
    time_posted: string; 
  };
  replies: CommentData[]; 
  currentUserId: string;
  deleteComment: (comment_id: string) => void;
  addComment: (text: string, parent_id: string | null) => void;
  updateComment: (text: string, comment_id: string) => void;
  activeComment: { id: string, type: string } | null;
  setActiveComment: React.Dispatch<React.SetStateAction<{ id: string, type: string } | null>>;
  parentId: null | string;
}

// Comment component
const Comment: React.FC<CommentProps> = ({ comment, replies, currentUserId, deleteComment, addComment, updateComment, activeComment, setActiveComment, parentId }) => {
  // Don't allow editing or deleting comment after 5 minutes passed since posting
  const fiveMinutes: number = 300000; // 5 minutes in milliseconds
  const currentTime = new Date().getTime();
  const commentTime = new Date(comment.time_posted).getTime();
  const timePassed: boolean = (currentTime - commentTime) > fiveMinutes;
  const canReply = Boolean(currentUserId)
  const canEdit = currentUserId === comment.user_id && !timePassed;
  const canDelete = currentUserId === comment.user_id && !timePassed;
  const timePosted = new Date(comment.time_posted).toLocaleDateString();
  const isReplying = activeComment && activeComment.type === "replying" && activeComment.id === comment.id;
  const isEditing = activeComment && activeComment.type === "editing" && activeComment.id === comment.id;
  const replyId = parentId ? parentId : comment.id;

  return (
    <div className="comment">
      <div className="comment_image_container">
        <img src="/user-icon.png"/>
      </div>
      <div className="comment_right_part">
        <div className="comment_content">
          <div className="comment_author">{comment.username}</div>
          <div>{timePosted}</div>
        </div>
        {!isEditing && <div className="comment_text">{comment.body}</div>}
        {isEditing && (
          <CommentForm 
            submitLabel="Update" 
            hasCancelButton 
            initialText={comment.body}
            handleSubmit={(text) => updateComment(text, comment.id)} 
            handleCancel={() => setActiveComment(null)}
          />
        )}
        
        {/* Display actions (reply, edit, delete) */}
        <div className="comment_actions">
          {canReply && <div className="comment_action" onClick={() => setActiveComment({id: comment.id, type: "replying"})}>
            Reply</div>}
          {canEdit && <div className="comment_action"  onClick={() => setActiveComment({id: comment.id, type: "editing"})}>
            Edit</div>}
          {canDelete && (
            <div className="comment_action" onClick={() => deleteComment(comment.id)}>
              Delete</div>)}
        </div>
        {/* Display a form for replying to the comment */}
        {isReplying && (
          <CommentForm submitLabel="Reply" handleSubmit={(text: string) => addComment(text, replyId)}
          />
        )}
        {replies.length > 0 && (
          <div className="replies"> 
            {replies.map((reply) => (
              <Comment 
                key={reply.id} 
                comment={reply} 
                replies={[]} 
                currentUserId={currentUserId} 
                deleteComment={deleteComment}
                addComment={addComment}
                updateComment={updateComment}
                parentId={comment.id}
                activeComment={activeComment}
                setActiveComment={setActiveComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;