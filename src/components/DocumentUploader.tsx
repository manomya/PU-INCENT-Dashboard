'use client';

import { useRouter } from 'next/navigation';
import Uploader from './Uploader';

interface DocumentUploaderProps {
  startupId: string;
  field: string;
  label: string;
  acceptedFileTypes?: string;
}

export default function DocumentUploader({ startupId, field, label, acceptedFileTypes }: DocumentUploaderProps) {
  const router = useRouter();

  const handleSuccess = async (url: string) => {
    try {
      const res = await fetch(`/api/startups/${startupId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: url }),
      });

      if (!res.ok) {
        throw new Error('Failed to update Google Sheet');
      }

      // Refresh the current route to fetch updated data
      router.refresh();
      
    } catch (error) {
      console.error(error);
      alert('File uploaded to Cloudflare, but failed to save to Google Sheet.');
    }
  };

  return (
    <Uploader 
      label={label}
      acceptedFileTypes={acceptedFileTypes}
      onUploadSuccess={handleSuccess}
    />
  );
}
