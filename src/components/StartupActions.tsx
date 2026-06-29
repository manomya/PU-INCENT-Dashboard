'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import StartupFormModal from './StartupFormModal';

interface StartupActionsProps {
  startup: any;
}

export default function StartupActions({ startup }: StartupActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: session } = useSession();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const canEdit = (session?.user as any)?.permissions?.canEdit;

  return (
    <>
      <div className="flex items-center gap-3 shrink-0">
        {canEdit && (
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-12 h-12 flex items-center justify-center border-2 border-outline-variant/50 text-on-surface bg-surface-container-lowest/50 backdrop-blur-md rounded-2xl hover:bg-surface-variant hover:border-outline-variant transition-all hover:shadow-md"
            title="Edit Startup"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        )}
        <button 
          onClick={handleShare}
          className="px-6 py-3 bg-brand-orange text-white rounded-2xl text-sm font-bold flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.23)]"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
          Share Profile
        </button>
      </div>

      <StartupFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        initialData={startup}
      />
    </>
  );
}
