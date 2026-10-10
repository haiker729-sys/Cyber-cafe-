import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ApplicationStatus, CustomerApplication } from '../types.ts';
import { 
  ShieldCheck, 
  Settings, 
  Users, 
  MessageSquare, 
  CreditCard, 
  FileText, 
  Save, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  AlertCircle 
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    language, 
    shopSettings, 
    updateShopSettings, 
    applications, 
    updateApplicationStatus, 
    contactMessages, 
    markMessageRead,
    userRole,
    setUserRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'settings' | 'messages' | 'payments'>('applications');
  
  // Settings form local state
  const [phone, setPhone] = useState(shopSettings.phone);
  const [whatsapp, setWhatsapp] = useState(shopSettings.whatsapp);
  const [mapsUrl, setMapsUrl] = useState(shopSettings.mapsUrl);
  const [address, setAddress] = useState(shopSettings.address || '');
  const [openingHours, setOpeningHours] = useState(shopSettings.openingHours || '');
  const [upiId, setUpiId] = useState(shopSettings.upiId || '');
  const [upiName, setUpiName] = useState(shopSettings.upiName || 'MERAJ CAFE POINT');
  const [email, setEmail] = useState(shopSettings.email || '');
  const [insta, setInsta] = useState(shopSettings.socialLinks.instagram || '');
  const [fb, setFb] = useState(shopSettings.socialLinks.facebook || '');
  const [yt, setYt] = useState(shopSettings.socialLinks.youtube || '');
  const [tg, setTg] = useState(shopSettings.socialLinks.telegram || '');

  const [settingsSaved, setSettingsSaved] = useState(false);

  // Application editing state
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('In progress');
  const [editNotes, setEditNotes] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState<CustomerApplication['paymentStatus']>('Unpaid');
  const [editPaymentRef, setEditPaymentRef] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings({
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      mapsUrl: mapsUrl.trim(),
      address: address.trim(),
      openingHours: openingHours.trim(),
      upiId: upiId.trim(),
      upiName: upiName.trim(),
      email: email.trim(),
      socialLinks: {
        instagram: insta.trim(),
        facebook: fb.trim(),
        youtube: yt.trim(),
        telegram: tg.trim(),
      },
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleStartEditApp = (app: CustomerApplication) => {
    setEditingAppId(app.id);
    setEditStatus(app.status);
    setEditNotes(app.notes);
    setEditPaymentStatus(app.paymentStatus || 'Unpaid');
    setEditPaymentRef(app.paymentRef || '');
  };

  const handleSaveAppEdit = (id: string) => {
    updateApplicationStatus(id, editStatus, editNotes, editPaymentStatus, editPaymentRef);
    setEditingAppId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Banner with Role Switcher */}
      <div className="p-5 sm:p-6 rounded-2xl neu-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neu-icon">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin & Staff Management Portal</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            MERAJ CAFE POINT · Role-Based Dashboard (Owner / Staff Access)
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl neu-inset-sm">
          <span className="text-[11px] font-semibold text-slate-500 px-2">Role:</span>
          <button
            type="button"
            onClick={() => setUserRole('owner')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              userRole === 'owner' ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Owner
          </button>
          <button
            type="button"
            onClick={() => setUserRole('staff')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              userRole === 'staff' ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Staff
          </button>
          <button
            type="button"
            onClick={() => setUserRole('guest')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              userRole === 'guest' ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-slate-700 dark:text-slate-200' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Guest
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl neu-inset-sm overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all min-h-[40px] ${
            activeTab === 'applications'
              ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
              : 'neu-tab-idle'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-orange-500" />
          <span>Applications Queue ({applications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all min-h-[40px] ${
            activeTab === 'settings'
              ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
              : 'neu-tab-idle'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-orange-500" />
          <span>Shop Settings & UPI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all min-h-[40px] ${
            activeTab === 'messages'
              ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
              : 'neu-tab-idle'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
          <span>Contact Inquiries ({contactMessages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all min-h-[40px] ${
            activeTab === 'payments'
              ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
              : 'neu-tab-idle'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-orange-500" />
          <span>Payments Ledger</span>
        </button>
      </div>

      {/* 1. APPLICATIONS QUEUE */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Customer Application Records
            </h2>
            <span className="text-xs text-slate-500">
              Auto-delete retention policy: 30 days after completion
            </span>
          </div>

          <div className="space-y-4">
            {applications.map((app) => {
              const isEditing = editingAppId === app.id;
              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl neu-card space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/50 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg neu-inset-sm">
                        {app.id}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {app.customerName}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {app.mobile}
                      </span>
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                          {app.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStartEditApp(app)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg neu-btn text-slate-700 dark:text-slate-200"
                        >
                          Update Status
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="p-4 rounded-xl neu-inset space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Status
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl neu-input font-medium"
                          >
                            <option value="Received">Received</option>
                            <option value="In progress">In progress</option>
                            <option value="Needs documents">Needs documents</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Payment Record
                          </label>
                          <select
                            value={editPaymentStatus}
                            onChange={(e) => setEditPaymentStatus(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl neu-input font-medium"
                          >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid (Cash)">Paid (Cash)</option>
                            <option value="Paid (UPI)">Paid (UPI)</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-xs">
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Staff Notes / Customer Feedback
                        </label>
                        <textarea
                          rows={2}
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full p-2.5 rounded-xl neu-input font-medium"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingAppId(null)}
                          className="px-3.5 py-1.5 neu-btn text-xs font-semibold text-slate-700 dark:text-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveAppEdit(app.id)}
                          className="px-4 py-1.5 neu-btn-orange text-xs font-bold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs space-y-1">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Service: </span>
                        {app.serviceName}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Staff Note: </span>
                        {app.notes}
                      </p>
                      <p className="text-slate-500 font-mono text-[11px]">
                        Payment: {app.paymentStatus || 'Unpaid'} · Last updated: {app.updatedAt}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SHOP SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="neu-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Editable Business Settings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Items left empty (like address, hours, UPI ID) remain strictly hidden on the public site until filled.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3.5 rounded-xl neu-inset text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Settings successfully saved and live on website!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number (Required)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 neu-input font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                WhatsApp Number (Required)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 neu-input font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Shop Physical Address (Keep empty until confirmed)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Leave blank until provided"
                className="w-full px-3.5 py-2.5 neu-input text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Opening Hours (Keep empty until confirmed)
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="e.g. Mon-Sat: 8:00 AM - 9:00 PM"
                className="w-full px-3.5 py-2.5 neu-input text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                UPI ID for QR (Keep empty until confirmed)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. 9060776981@ybl"
                className="w-full px-3.5 py-2.5 neu-input font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                UPI Beneficiary Name
              </label>
              <input
                type="text"
                value={upiName}
                onChange={(e) => setUpiName(e.target.value)}
                className="w-full px-3.5 py-2.5 neu-input text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Google Maps Link
              </label>
              <input
                type="text"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 neu-input text-sm font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Social Media Links (Hidden on site until filled)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="url"
                value={insta}
                onChange={(e) => setInsta(e.target.value)}
                placeholder="Instagram URL"
                className="px-3.5 py-2.5 neu-input"
              />
              <input
                type="url"
                value={fb}
                onChange={(e) => setFb(e.target.value)}
                placeholder="Facebook URL"
                className="px-3.5 py-2.5 neu-input"
              />
              <input
                type="url"
                value={yt}
                onChange={(e) => setYt(e.target.value)}
                placeholder="YouTube URL"
                className="px-3.5 py-2.5 neu-input"
              />
              <input
                type="url"
                value={tg}
                onChange={(e) => setTg(e.target.value)}
                placeholder="Telegram URL"
                className="px-3.5 py-2.5 neu-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 neu-btn-orange text-xs font-bold flex items-center gap-2 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </form>
      )}

      {/* 3. CONTACT INQUIRIES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Customer Inquiries Received ({contactMessages.length})
          </h2>

          <div className="space-y-4">
            {contactMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 rounded-2xl neu-card space-y-3 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{msg.name}</span>
                    <span className="text-slate-500 font-mono">📱 {msg.mobile}</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono">{msg.createdAt}</span>
                </div>

                <div className="font-semibold text-orange-600 dark:text-orange-400">
                  Subject: {msg.subject}
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed neu-inset-sm p-3.5">
                  {msg.message}
                </p>

                <div className="flex justify-end gap-2 pt-1">
                  <a
                    href={`https://wa.me/91${msg.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${msg.name}, thank you for contacting Meraj Cafe Point regarding "${msg.subject}".`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl neu-btn-emerald text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>Reply on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PAYMENTS LEDGER */}
      {activeTab === 'payments' && (
        <div className="neu-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Payments Ledger (Recorded by Staff)
            </h2>
            <span className="text-xs text-slate-500">
              Only verified gateway or staff references recorded here
            </span>
          </div>

          <div className="divide-y divide-slate-200/50 dark:divide-slate-800 text-xs">
            {applications.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {app.customerName} ({app.id})
                  </span>
                  <span className="text-slate-500">{app.serviceName}</span>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-sm block">
                    ₹{app.feeAmount || 0}
                  </span>
                  <span className={`text-[11px] font-semibold ${
                    app.paymentStatus?.includes('Paid') ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    {app.paymentStatus || 'Unpaid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
