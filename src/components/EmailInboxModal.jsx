'use client';

export default function EmailInboxModal({
  isOpen,
  onClose,
  emails,
  onConfirmDoubleOptIn,
  onSimulatePasswordReset
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border-2 border-emerald-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-envelope-open-text text-emerald-300"></i>
            <span className="font-bold text-sm">SendGrid / Mailchimp Simulated Inbox</span>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Email List */}
        <div className="p-6 space-y-4 max-h-[440px] overflow-y-auto bg-white">
          {emails.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <i className="fa-solid fa-inbox text-3xl text-emerald-300 mb-2"></i>
              <p className="font-semibold">Simulated inbox is currently empty.</p>
            </div>
          ) : (
            emails.map((mail) => (
              <div
                key={mail.id}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-emerald-700">To: {mail.to}</span>
                  <span>{mail.timestamp}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{mail.subject}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{mail.body}</p>

                {mail.actionType === 'verify_email' && (
                  <button
                    onClick={() => onConfirmDoubleOptIn(mail.to)}
                    className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-check-double"></i>
                    <span>Confirm Double Opt-In Email Now</span>
                  </button>
                )}

                {mail.actionType === 'reset_password' && (
                  <button
                    onClick={onSimulatePasswordReset}
                    className="mt-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-key"></i>
                    <span>Simulate New Password Saved</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
