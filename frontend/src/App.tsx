import React, { useRef, useState } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { QueryInput } from './components/QueryInput';
import { Message, UploadedFile } from './types';
import { uploadDocuments, queryChat } from './services/api';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (selectedFiles: File[]) => {
    setUploading(true);
    const response = await uploadDocuments(selectedFiles);
    setUploading(false);
    if (response.success) {
      setFiles(response.files || []);
      setMessages(prev => [...prev, { role: 'system', text: 'Documents uploaded and indexed successfully.' }]);
    } else {
      setMessages(prev => [...prev, { role: 'system', text: response.error || 'Upload failed.' }]);
    }
  };

  const handleQuery = async (text: string) => {
    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);

    const response = await queryChat(text);
    const assistantMessage: Message = {
      role: 'assistant',
      text: response.answer || 'I could not find an answer for that query.'
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    handleUpload(Array.from(selectedFiles));
    event.target.value = '';
  };

  return (
    <div className="page-shell">
      <div className="hero-card">
        <header className="hero-header">
          <div className="brand">Welcome to GlideX</div>
          <p className="hero-subtitle">Upload documents, query them in natural language, and get fast context-aware answers.</p>
        </header>

        <section className="chat-card">
          {messages.length > 0 && <ChatWindow messages={messages} />}

          <div className="input-wrapper">
            <QueryInput onSubmit={handleQuery} onUploadClick={handleUploadClick} disabled={files.length === 0} />
            <div className="upload-summary">{files.length} document(s) ready</div>
          </div>
        </section>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default App;
