'use client';

export default function PreviewModal({
  isOpen,
  onClose,
  resource,
  canDownload,
  downloadReason,
  onDownload,
  onUnlock
}) {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border-2 border-emerald-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-file-pdf text-emerald-300"></i>
            <span className="font-bold text-sm">Resource Executive Preview</span>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="p-6 space-y-4 bg-white">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full">
              {resource.category}
            </span>
            <span className="text-slate-500 font-medium">{resource.pages} Pages</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">By {resource.author}</span>
          </div>

          <h3 className="font-extrabold text-lg text-slate-900">{resource.title}</h3>

          <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-5 space-y-3 max-h-72 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900">Executive Summary (Public Preview Mode):</p>
            <p>{resource.abstract}</p>
            <div className="border-t border-dashed border-emerald-300 pt-3 text-xs text-emerald-800 italic">
              <i className="fa-solid fa-lock mr-1 text-emerald-600"></i>
              Full architectural diagrams, production code repositories, and printable exercises are included in the complete downloadable PDF.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 transition"
            >
              Close Preview
            </button>
            {canDownload ? (
              <button
                onClick={() => {
                  onClose();
                  onDownload(resource);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <span>Download Full PDF ({downloadReason})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onUnlock(resource);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-600 text-emerald-900 hover:text-white border border-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-lock text-emerald-600"></i>
                <span>Unlock Full PDF (${resource.price})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
