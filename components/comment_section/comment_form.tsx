import React, { useState } from 'react';

interface CommentFormProps {
  handleSubmit: (text: string, parent_id: string | null) => void;
  submitLabel: string;
  hasCancelButton?: boolean;
  initialText?: string; 
  handleCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ handleSubmit, submitLabel, hasCancelButton=false, initialText="", handleCancel }) => {
  const [text, setText] = useState(initialText);
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
        {submitLabel}
      </button>

      {hasCancelButton && (
        <button type="button" className="comment_form_button comment_form_cancel_button" 
        onClick={handleCancel}
        > 
        Cancel 
        </button>
      )}


    </form>
  );
};

export default CommentForm;
