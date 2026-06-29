'use client';

import { useState, useRef } from 'react';

interface UploaderProps {
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  acceptedFileTypes?: string;
  label?: string;
}

export default function Uploader({ 
  onUploadSuccess, 
  onUploadError,
  acceptedFileTypes = "image/*,application/pdf",
  label = "Upload Document"
}: UploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(10);

      // 1. Get presigned URL from our Next.js API
      const res = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { presignedUrl, finalUrl } = await res.json();
      setProgress(50);

      // 2. Upload file directly to Cloudflare R2
      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to bucket');
      }

      setProgress(100);
      
      if (onUploadSuccess) {
        onUploadSuccess(finalUrl);
      } else {
        alert(`Upload successful!\nURL: ${finalUrl}\n(Check your console for the link)`);
        console.log("Uploaded File URL:", finalUrl);
      }

    } catch (error) {
      console.error(error);
      if (onUploadError) onUploadError(error as Error);
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
      />
      
      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className={`px-4 py-2 flex items-center gap-2 rounded-xl text-sm font-bold transition-all
          ${isUploading 
            ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' 
            : 'bg-brand-orange text-white hover:-translate-y-0.5 shadow-sm hover:shadow-md'
          }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isUploading ? 'hourglass_empty' : 'cloud_upload'}
        </span>
        {isUploading ? 'Uploading...' : label}
      </button>

      {/* Progress Bar Overlay */}
      {isUploading && (
        <div className="absolute -bottom-3 left-0 w-full h-1 bg-surface-variant rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-orange transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
