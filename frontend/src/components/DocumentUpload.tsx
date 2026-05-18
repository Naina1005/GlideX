import { useState } from 'react';

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  uploading: boolean;
}

export function DocumentUpload({ onUpload, uploading }: DocumentUploadProps) {
  const [fileList, setFileList] = useState<File[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const items = Array.from(files);
    setFileList(items);
  };

  const handleSubmit = () => {
    if (fileList.length === 0) return;
    onUpload(fileList);
  };

  return (
    <div className="upload-area">
      <label htmlFor="document-upload" className="upload-button">
        Select documents
      </label>
      <input
        id="document-upload"
        type="file"
        accept=".pdf,.txt,.md"
        multiple
        hidden
        onChange={e => handleFiles(e.target.files)}
      />
      <div className="upload-hint">PDF, TXT, or Markdown files. Add multiple documents.</div>
      <button className="upload-button" onClick={handleSubmit} disabled={uploading || fileList.length === 0}>
        {uploading ? 'Uploading…' : 'Upload & Index'}
      </button>
      {fileList.length > 0 && (
        <div>
          <strong>{fileList.length} file(s) selected</strong>
        </div>
      )}
    </div>
  );
}
