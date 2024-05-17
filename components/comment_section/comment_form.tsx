import React, { useState } from 'react';

interface CommentFormProps {
  handleSubmit: (text: string, parent_id: string | null) => void;
  submitLabel: string;
  hasCancelButton?: boolean;
  initialText?: string; // Initial text for the textarea
  handleCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ handleSubmit, submitLabel, hasCancelButton=false, initialText="", handleCancel }) => {
  const [text, setText] = useState(initialText);  // State variable for textarea value
  const isTextareDisabled = text.length === 0;
  // Function to handle form submission
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(text, null);
    setText("");  // Clear the textarea after submission
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Textarea for entering comment */}
      <textarea 
        className="comment_form_textarea" 
        value={text} 
        onChange={(e) => setText(e.target.value)} // Update the textarea value on change
      />
      {/* Submit button */}
      <button className="comment_form_button" disabled={isTextareDisabled}>
        {submitLabel}
      </button>
      {/* Cancel button*/}
      {hasCancelButton && (
        <button type="button" className="comment_form_button comment_form_cancel_button" 
        onClick={handleCancel}> 
          Cancel 
        </button>
      )}
    </form>
  );
};

export default CommentForm;
