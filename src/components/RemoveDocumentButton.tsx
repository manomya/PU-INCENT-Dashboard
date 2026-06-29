'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RemoveDocumentButtonProps {
  startupId: string;
  field: string;
}

export default function RemoveDocumentButton({ startupId, field }: RemoveDocumentButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    // Prevent the click from bubbling up if it's placed inside or over a link
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(`Are you sure you want to remove the ${field}?`);
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/startups/${startupId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: "" }), // Empty string removes it
      });

      if (!res.ok) {
        throw new Error('Failed to update Google Sheet');
      }

      router.refresh();
      
    } catch (error) {
      console.error(error);
      alert(`Failed to remove the ${field}.`);
      setIsDeleting(false); // Only reset if failed, if success, the page will refresh and unmount
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isDeleting}
      className={`absolute top-1/2 -translate-y-1/2 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 
        ${isDeleting ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:scale-110'}`}
      title={`Remove ${field}`}
    >
      <span className={`material-symbols-outlined text-[18px] ${isDeleting ? 'animate-spin' : ''}`}>
        {isDeleting ? 'progress_activity' : 'delete'}
      </span>
    </button>
  );
}
