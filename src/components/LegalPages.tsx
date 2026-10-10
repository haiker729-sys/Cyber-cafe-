import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export const LegalPages: React.FC<{ page: 'about' | 'privacy' | 'terms' }> = ({ page }) => {
  const { language, setActiveTab, shopSettings } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      <button
        type="button"
        onClick={() => setActiveTab('home')}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl neu-btn text-xs font-bold text-slate-700 dark:text-slate-300"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-orange-500" />
        <span>Back to Home</span>
      </button>

      {/* Review Banner */}
      <div className="p-4 rounded-2xl neu-inset-sm text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
        <span>
          <strong>Draft Document: </strong> Please review these terms with your local legal advisor before commercial publication.
        </span>
      </div>

      {page === 'about' && (
        <div className="neu-card p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            About MERAJ CAFE POINT
          </h1>
          <p>
            <strong>MERAJ CAFE POINT</strong> is an established cyber cafe and digital service center situated in Bihar, India. We empower citizens, students, and job aspirants with seamless access to online digital tools, document format compliance, and government application filing assistance.
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            Our Core Mission
          </h2>
          <p>
            Filling government forms often poses challenges: photos get rejected due to incorrect KB size, signatures are illegible, and portal deadlines are tight. MERAJ CAFE POINT solves this with fast, in-browser privacy-first utilities (photo compressors, DPI injectors, passport sheets, PDF merge/split) alongside dedicated in-person staff assistance for RTPS Bihar, PAN cards, voter IDs, and competitive exams.
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            Non-Government Affiliation Notice
          </h2>
          <p>
            MERAJ CAFE POINT is an independent private cyber service facility. We do not represent any government ministry, commission, or exam conducting board. All government portal hyperlinks directed from our site point strictly to verified official domains (.gov.in / .nic.in).
          </p>
        </div>
      )}

      {page === 'privacy' && (
        <div className="neu-card p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: October 2026
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            1. 100% In-Browser Tool Processing
          </h2>
          <p>
            All media tools on this site (Image Compressor, Passport Photo Maker, Signature Resizer, PDF Merge/Split, and OCR Scanner) run <strong>entirely inside your browser's local memory</strong> using client-side JavaScript, WebAssembly, and Canvas APIs. Your photos, signatures, and PDF certificates are <strong>never uploaded to our servers</strong> when using these tools.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            2. Customer Document Retention Policy
          </h2>
          <p>
            When customers voluntarily provide identity proofs, marksheet scans, or application details to our staff for form-filling assistance:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Documents are accessed exclusively by authorized staff for completing your requested filing.</li>
            <li><strong>Mandatory 30-Day Auto-Deletion:</strong> All uploaded application files and cached customer records are purged 30 days after the application is completed or cancelled.</li>
            <li>Customers may request immediate manual deletion at any time by contacting us on WhatsApp (9060776981).</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            3. Third-Party Links
          </h2>
          <p>
            Our website links to official government websites (e.g. ssc.gov.in, bpsc.bih.nic.in, serviceonline.bihar.gov.in). We are not responsible for the privacy practices or contents of those external government portals.
          </p>
        </div>
      )}

      {page === 'terms' && (
        <div className="neu-card p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: October 2026
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            1. Nature of Services
          </h2>
          <p>
            MERAJ CAFE POINT provides computer assistance, scanning, printing, and data-entry typing services for online portals. We do not issue government certificates, job appointment letters, or examination admissions.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            2. Customer Verification Responsibility
          </h2>
          <p>
            While our staff takes utmost care in accurate form-filling, the applicant bears the final legal responsibility for verifying the accuracy of personal details, spelling, category, date of birth, and submitted documents before final fee submission.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            3. Payments & Fees
          </h2>
          <p>
            Cyber cafe service charges are strictly for data-entry, guidance, scanning, and printing. Official government portal examination fees (if any) are separate and paid directly to the respective portal's payment gateway.
          </p>
        </div>
      )}

    </div>
  );
};
