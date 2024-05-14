import React, { useState } from 'react';

interface CommentFormProps {
  handleSubmit: (text: string, parent_id: string | null) => void;
  submitLabel: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ handleSubmit, submitLabel }) => {
  const [text, setText] = useState("");
  const isTextareDisabled = text.length === 0;
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(text, null);
    setText("");
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea 
        className="comment_form_textarea" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
      />
      <button className="comment_form_button" disabled={isTextareDisabled}>
        {submitLabel}</button>
    </form>
  );
};

export default CommentForm;
