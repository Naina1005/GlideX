import { useState } from 'react';

interface QueryInputProps {
  onSubmit: (text: string) => void;
  onUploadClick: () => void;
  disabled?: boolean;
}

export function QueryInput({ onSubmit, onUploadClick, disabled }: QueryInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = () => {
    if (!question.trim()) return;
    onSubmit(question.trim());
    setQuestion('');
  };

  return (
    <div className="query-box">
      <button type="button" className="icon-button" onClick={onUploadClick} title="Upload documents">
        +
      </button>
      <input
        type="text"
        placeholder={disabled ? 'Upload documents first to ask questions...' : 'Ask GlideX anything about your uploaded docs...'}
        value={question}
        onChange={e => setQuestion(e.target.value)}
        disabled={disabled}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
      />
      <button className="send-button" onClick={handleSubmit} disabled={disabled || question.trim().length === 0}>
        Send
      </button>
    </div>
  );
}
