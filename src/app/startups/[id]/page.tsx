import { getStartupById } from '@/services/api';
import Link from 'next/link';
import DocumentUploader from '@/components/DocumentUploader';
import StartupActions from '@/components/StartupActions';
import RemoveDocumentButton from '@/components/RemoveDocumentButton';

export default async function StartupProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const startup = await getStartupById(id);

  if (!startup) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm mx-auto max-w-2xl mt-12">
        <div className="w-24 h-24 bg-surface-variant/50 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-50">search_off</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Startup Not Found</h2>
          <p className="text-on-surface-variant">We couldn't find a startup with the ID <span className="font-mono bg-surface-variant px-2 py-0.5 rounded text-sm">{id}</span> in the database.</p>
        </div>
        <Link href="/startups" className="bg-brand-orange text-white px-6 py-2.5 rounded-xl mt-4 shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.23)] hover:-translate-y-0.5 transition-all font-bold">
          Back to Directory
        </Link>
      </div>
    );
  }

  const name = startup["Startup Name"] || 'Unknown Startup';
  const initials = name.substring(0, 2).toUpperCase();
  const stage = startup["Stage"] || 'N/A';
  
  // Helper to convert Google Drive viewer links to direct image links
  const getDirectImageUrl = (url: string | undefined | null) => {
    if (!url) return null;
    if (url.includes('drive.google.com')) {
      const match = url.match(/id=([^&]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    return url;
  };

  const logo = getDirectImageUrl(startup["Logo"]);
  const founderPhoto = getDirectImageUrl(startup["Founder's Photo"]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-surface-variant/30 rounded-3xl border border-outline-variant shadow-sm p-8 md:p-12">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <Link href="/startups" className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest/50 backdrop-blur-md border border-outline-variant/50 rounded-full hover:bg-surface-variant transition-all hover:-translate-x-1 group shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface">arrow_back</span>
            </Link>
            
            {/* Logo Wrapper */}
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-black/5 border-4 border-white overflow-hidden relative group">
                {logo && logo.startsWith('http') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={logo} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-brand-orange font-black text-5xl bg-gradient-to-br from-brand-orange to-brand-orange/60 bg-clip-text text-transparent">{initials}</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight">{name}</h1>
                <span className="px-3 py-1 bg-surface-variant border border-outline-variant/50 rounded-full text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {stage}
                </span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">tag</span>{startup["Startup Registration number"] || 'N/A'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">category</span>{startup["Domain"] || 'N/A'}</span>
              </p>
              
              {startup["Website"] && (
                <a href={startup["Website"].startsWith('http') ? startup["Website"] : `https://${startup["Website"]}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-brand-orange/80 transition-colors mt-2">
                  <span className="material-symbols-outlined text-[18px]">language</span>
                  Visit Website
                  <span className="material-symbols-outlined text-[14px] ml-1 opacity-50">open_in_new</span>
                </a>
              )}
            </div>
          </div>
          
          <StartupActions startup={startup} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Founder Section */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-outline-variant/50 flex items-center gap-3 bg-gradient-to-r from-surface-variant/30 to-transparent">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600">group</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Founding Team</h3>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Primary Founder */}
              <div className="flex gap-5">
                <div className="w-20 h-20 bg-surface-variant rounded-2xl flex items-center justify-center border-2 border-outline-variant/50 overflow-hidden shrink-0 relative">
                  {founderPhoto && founderPhoto.startsWith('http') ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={founderPhoto} alt="Founder" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50">person</span>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-on-surface leading-tight">{startup["Founder Name"] || 'N/A'}</h4>
                  <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mt-1 mb-3">Founder</p>
                  
                  <div className="space-y-2">
                    {startup["Personal Email"] && (
                      <p className="text-sm text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] opacity-70">mail</span>
                        <span className="truncate max-w-[180px]" title={startup["Personal Email"]}>{startup["Personal Email"]}</span>
                      </p>
                    )}
                    {startup["Phone Number"] && (
                      <p className="text-sm text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] opacity-70">call</span>
                        {startup["Phone Number"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Co-Founder if exists */}
              {startup["Co - Founder"] && (
                <div className="flex gap-5 md:pl-8 md:border-l border-outline-variant/30">
                  <div className="w-20 h-20 bg-surface-variant rounded-2xl flex items-center justify-center border-2 border-outline-variant/50 overflow-hidden shrink-0">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50">person_add</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-on-surface leading-tight">{startup["Co - Founder"]}</h4>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 mb-3">Co-Founder</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Academic Profile */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-outline-variant/50 flex items-center gap-3 bg-gradient-to-r from-surface-variant/30 to-transparent">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600">school</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Academic Profile</h3>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-surface-variant/30 p-4 rounded-2xl border border-outline-variant/30">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Registration</p>
                  <p className="text-sm font-bold text-on-surface">{startup["Registration Number"] || 'N/A'}</p>
                </div>
                <div className="bg-surface-variant/30 p-4 rounded-2xl border border-outline-variant/30">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Department</p>
                  <p className="text-sm font-bold text-on-surface">{startup["Department"] || 'N/A'}</p>
                </div>
                <div className="bg-surface-variant/30 p-4 rounded-2xl border border-outline-variant/30">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Branch</p>
                  <p className="text-sm font-bold text-on-surface">{startup["Branch"] || 'N/A'}</p>
                </div>
                <div className="bg-surface-variant/30 p-4 rounded-2xl border border-outline-variant/30">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Year</p>
                  <p className="text-sm font-bold text-on-surface">{startup["Year"] || 'N/A'}</p>
                </div>
              </div>
              
              {startup["College Email"] && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <span className="material-symbols-outlined text-blue-600">contact_mail</span>
                  <div>
                    <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest">College Email</p>
                    <p className="text-sm font-medium text-blue-900">{startup["College Email"]}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Incubation Details */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
             <div className="p-6 border-b border-outline-variant/50">
              <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Program Status</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Incubation Start Date</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-orange text-[18px]">event</span>
                  <span className="font-bold text-on-surface">{startup["Incubation Start Date"] || 'N/A'}</span>
                </div>
              </div>
              
              <div className="pt-5 border-t border-outline-variant/50">
                <p className="text-xs text-on-surface-variant mb-1">MSME Registration</p>
                <div className="flex items-center gap-2">
                  {startup["MSME Registration "] && startup["MSME Registration "].trim() !== '' ? (
                    <>
                      <span className="material-symbols-outlined text-green-600 text-[18px]">verified</span>
                      <span className="font-bold text-on-surface truncate max-w-[200px]" title={startup["MSME Registration "]}>
                        {startup["MSME Registration "].startsWith('http') ? 'Certificate Uploaded' : startup["MSME Registration "]}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-orange-500 text-[18px]">pending_actions</span>
                      <span className="font-bold text-on-surface">Not Registered</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Key Documents */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
             <div className="p-6 border-b border-outline-variant/50">
              <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Key Documents</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Pitch Deck Uploader */}
              <DocumentUploader 
                startupId={startup["Startup Registration number"] || id}
                field="Pitch Deck"
                label="Upload New Pitch Deck"
                acceptedFileTypes=".pdf,.ppt,.pptx"
              />
              
              {startup["Pitch Deck"] && startup["Pitch Deck"].trim() !== '' && (
                <div className="relative">
                  <a href={startup["Pitch Deck"].startsWith('http') ? startup["Pitch Deck"] : `https://${startup["Pitch Deck"]}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 pr-16 bg-surface-variant/30 hover:bg-surface-variant/60 transition-colors rounded-2xl border border-outline-variant/50 group block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/10 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-on-surface group-hover:text-brand-orange transition-colors truncate">Pitch Deck</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">Click to view document</p>
                      </div>
                    </div>
                  </a>
                  <RemoveDocumentButton startupId={startup["Startup Registration number"] || id} field="Pitch Deck" />
                </div>
              )}

              {/* MSME Registration Uploader */}
              <div className="pt-4 border-t border-outline-variant/50 mt-4">
                <DocumentUploader 
                  startupId={startup["Startup Registration number"] || id}
                  field="MSME Registration "
                  label="Upload MSME Certificate"
                  acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                />
                
                {startup["MSME Registration "] && startup["MSME Registration "].trim().startsWith('http') && (
                  <div className="relative mt-4">
                    <a href={startup["MSME Registration "]} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 pr-16 bg-surface-variant/30 hover:bg-surface-variant/60 transition-colors rounded-2xl border border-outline-variant/50 group block">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-on-surface group-hover:text-green-600 transition-colors truncate">MSME Certificate</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">Click to view document</p>
                        </div>
                      </div>
                    </a>
                    <RemoveDocumentButton startupId={startup["Startup Registration number"] || id} field="MSME Registration " />
                  </div>
                )}
              </div>

              {(!startup["Pitch Deck"] || startup["Pitch Deck"].trim() === '') && (!startup["MSME Registration "] || !startup["MSME Registration "].trim().startsWith('http')) && (
                <div className="flex items-center justify-center p-8 text-center text-on-surface-variant opacity-70">
                  <div>
                    <span className="material-symbols-outlined text-3xl mb-2">folder_off</span>
                    <p className="text-xs">No documents uploaded yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
