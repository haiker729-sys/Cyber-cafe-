import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ApplicationStatus } from '../types.ts';
import { 
  Search, 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  ShieldCheck, 
  Plus, 
  MessageCircle 
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { language, applications, addApplication, shopSettings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Submit new application assistance request
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newService, setNewService] = useState('New PAN Card Application');
  const [newNotes, setNewNotes] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [createdAppId, setCreatedAppId] = useState<string | null>(null);

  const matchedApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      app.id.toLowerCase().includes(q) ||
      app.mobile.includes(q) ||
      app.customerName.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Received':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
            <Clock className="w-3 h-3" />
            <span>Received</span>
          </span>
        );
      case 'In progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold">
            <Clock className="w-3 h-3 animate-spin" />
            <span>In progress</span>
          </span>
        );
      case 'Needs documents':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-semibold">
            <AlertTriangle className="w-3 h-3" />
            <span>Needs Documents</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) return;

    const id = addApplication({
      customerName: newName.trim(),
      mobile: newMobile.trim(),
      serviceName: newService,
      status: 'Received',
      notes: newNotes.trim() || 'Application request submitted by customer.',
      feeAmount: 0,
      paymentStatus: 'Unpaid',
    });

    setCreatedAppId(id);
    setNewName('');
    setNewMobile('');
    setNewNotes('');
    setConsentChecked(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60 dark:border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === 'hi' ? 'आवेदन स्थिति ट्रैकर' : 'Customer Application Tracker'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'अपने एप्लिकेशन नंबर या मोबाइल नंबर से फॉर्म भरने की लाइव स्थिति जांचें।'
              : 'Track the live progress of your government form, certificates, or services.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setShowNewModal(true); setCreatedAppId(null); }}
          className="px-5 py-2.5 neu-btn-orange text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? '+ नया आवेदन दर्ज करें' : '+ Submit New Request'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative neu-inset">
          <Search className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'App ID या मोबाइल नंबर दर्ज करें (उदा. APP-1002)...' : 'Search by App ID or Mobile (e.g. APP-1002)...'}
            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {matchedApps.length === 0 ? (
          <div className="p-12 text-center rounded-2xl neu-card text-slate-500">
            No application found matching "{searchQuery}".
          </div>
        ) : (
          matchedApps.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-2xl neu-card space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/50 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg neu-inset-sm text-slate-900 dark:text-white">
                    {app.id}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {app.customerName}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    (📱 {app.mobile})
                  </span>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Service:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{app.serviceName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Last Updated:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{app.updatedAt}</span>
                </div>
              </div>

              {/* Staff Notes */}
              <div className="p-3.5 rounded-xl neu-inset-sm text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Staff Update / Notes:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {app.notes}
                </p>
              </div>

              {/* Quick WhatsApp update trigger */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <a
                  href={`https://wa.me/91${shopSettings.whatsapp}?text=${encodeURIComponent(
                    `Hello Meraj Cafe Point, regarding my application ID: ${app.id} (${app.serviceName}), please check.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-500"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask Staff on WhatsApp</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="neu-card max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'नया आवेदन अनुरोध दर्ज करें' : 'Submit New Application Request'}
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {createdAppId ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Application Created!
                </h4>
                <p className="text-xs text-slate-500">
                  Your tracking ID is{' '}
                  <span className="font-mono font-bold text-orange-600 dark:text-orange-400 text-sm">
                    {createdAppId}
                  </span>
                  . Keep this ID safe to track status.
                </p>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-orange-500 text-slate-950 hover:bg-orange-400"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ramesh Singh"
                    className="w-full px-3 py-2 neu-input text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    placeholder="9060776981"
                    className="w-full px-3 py-2 neu-input font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Service Required
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full px-3 py-2 neu-input text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="New PAN Card Application">New PAN Card Application</option>
                    <option value="PAN Card Correction">PAN Card Correction</option>
                    <option value="RTPS Residential Certificate (निवास)">RTPS Residential Certificate (निवास)</option>
                    <option value="RTPS Caste Certificate (जाति)">RTPS Caste Certificate (जाति)</option>
                    <option value="RTPS Income Certificate (आय)">RTPS Income Certificate (आय)</option>
                    <option value="Bihar Student Scholarship">Bihar Student Scholarship</option>
                    <option value="Admit Card Print & Xerox">Admit Card Print & Xerox</option>
                    <option value="Other Govt Form Filling">Other Govt Form Filling</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Additional Instructions / Details
                  </label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Mention any specific details (e.g. urgent deadline, photo ready on WhatsApp)"
                    className="w-full p-3 neu-input text-sm"
                  />
                </div>

                {/* Privacy & Document Retention Consent */}
                <div className="p-3.5 neu-inset-sm space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="rounded text-orange-500 focus:ring-orange-500 mt-0.5"
                    />
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      I consent to Meraj Cafe Point securely handling my documents solely for this application. Documents are kept confidential and auto-deleted 30 days after completion.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 neu-btn text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!consentChecked}
                    className="px-5 py-2.5 neu-btn-orange text-xs font-bold disabled:opacity-50 min-h-[44px]"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
