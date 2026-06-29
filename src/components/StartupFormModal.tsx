'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StartupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: any; // The startup row data mapped from Google Sheet
}

// All 19 fields expected in the Google Sheet in order (excluding some if we want to handle them specially, but for a raw form we map them)
const FORM_FIELDS = [
  { name: 'Startup Registration number', type: 'text', label: 'Registration ID (e.g. PU-GCEC-2025-001)', required: true },
  { name: 'Startup Name', type: 'text', label: 'Startup Name', required: true },
  { name: 'Domain', type: 'text', label: 'Domain / Industry' },
  { name: 'Stage', type: 'select', label: 'Stage', options: ['Ideation', 'Validation', 'Prototype', 'MVP', 'Early Revenue', 'Revenue', 'Scaling', 'NO IDEA'] },
  { name: 'Founder Name', type: 'text', label: 'Primary Founder Name', required: true },
  { name: 'Co - Founder', type: 'text', label: 'Co-Founder Name' },
  { name: 'College Email', type: 'email', label: 'College Email' },
  { name: 'Personal Email', type: 'email', label: 'Personal Email' },
  { name: 'Phone Number', type: 'tel', label: 'Phone Number' },
  { name: 'Year', type: 'text', label: 'College Year' },
  { name: 'Department', type: 'text', label: 'Department' },
  { name: 'Branch', type: 'text', label: 'Branch' },
  { name: 'Registration Number', type: 'text', label: 'College Registration Number' },
  { name: 'Website', type: 'url', label: 'Website URL' },
  { name: 'Incubation Start Date', type: 'date', label: 'Incubation Start Date' },
  { name: 'MSME Registration ', type: 'text', label: 'MSME Registration Number' },
  // Note: Logo, Founder's Photo, and Pitch Deck are managed via the Cloudflare Uploader directly on the profile page,
  // so we can omit them from this basic text form, or include them as text inputs for manual URL entry.
  // We'll include them as text for now so they can be edited if needed.
  { name: 'Logo', type: 'text', label: 'Logo URL' },
  { name: "Founder's Photo", type: 'text', label: 'Founder Photo URL' },
  { name: 'Pitch Deck', type: 'text', label: 'Pitch Deck URL' },
];

export default function StartupFormModal({ isOpen, onClose, mode, initialData = {} }: StartupFormModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    // Initialize form with initialData or empty strings
    const initial: Record<string, string> = {};
    FORM_FIELDS.forEach(field => {
      initial[field.name] = initialData[field.name] || '';
    });
    return initial;
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = mode === 'create' 
        ? '/api/startups/create'
        : `/api/startups/${initialData['Startup Registration number']}/update-all`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save startup');

      router.refresh(); // Refresh the page to show new data
      onClose(); // Close modal
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving the startup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-surface-container-lowest/80 backdrop-blur-sm">
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => !isSubmitting && onClose()}
      ></div>
      
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/50 flex items-center justify-between bg-gradient-to-r from-surface-variant/30 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-brand-orange">
                {mode === 'create' ? 'add_business' : 'edit_document'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                {mode === 'create' ? 'Add New Startup' : 'Edit Startup Profile'}
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {mode === 'create' ? 'Fill out the details to register a new startup.' : 'Update the details for this startup.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {FORM_FIELDS.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-on-surface"
                  >
                    <option value="">Select Stage...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-on-surface"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-10 pt-6 border-t border-outline-variant/50 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                isSubmitting 
                  ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                  : 'bg-brand-orange text-white hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.23)]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Startup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
