import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { language, shopSettings, addContactMessage } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !mobile.trim() || !message.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill all required fields.');
      return;
    }

    if (mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    addContactMessage({
      name: name.trim(),
      mobile: mobile.trim(),
      subject: subject.trim() || 'General Inquiry',
      message: message.trim(),
    });

    setSubmitted(true);
    setName('');
    setMobile('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {language === 'hi' ? 'संपर्क करें (Contact Us)' : 'Contact Meraj Cafe Point'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {language === 'hi'
            ? 'किसी भी प्रकार की ऑनलाइन सेवा, सरकारी फॉर्म या प्रिंटिंग के लिए सीधे कॉल या व्हाट्सएप करें।'
            : 'Get in touch for cyber services, government form filling, or quick printing orders.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Direct Contact Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Phone Card */}
          <div className="p-6 rounded-2xl neu-card-hover space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl neu-icon">
                <Phone className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Direct Phone Call
                </span>
                <a
                  href={`tel:${shopSettings.phone}`}
                  className="text-lg font-bold text-slate-900 dark:text-white hover:text-orange-600 font-mono"
                >
                  {shopSettings.phone}
                </a>
              </div>
            </div>
            <a
              href={`tel:${shopSettings.phone}`}
              className="w-full py-2.5 neu-btn text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 min-h-[44px]"
            >
              <span>Call Now</span>
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="p-6 rounded-2xl neu-card-hover space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl neu-icon">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  WhatsApp Support
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {shopSettings.whatsapp}
                </span>
              </div>
            </div>
            <a
              href={`https://wa.me/91${shopSettings.whatsapp}?text=${encodeURIComponent(
                language === 'hi'
                  ? 'नमस्ते मेराज कैफे पॉइंट, मुझे ऑनलाइन सेवा के संबंध में मदद चाहिए।'
                  : 'Hello Meraj Cafe Point, I need assistance.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 neu-btn-emerald text-white text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Google Maps Card */}
          <div className="p-6 rounded-2xl neu-card-hover space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl neu-icon">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Google Maps Location
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  MERAJ CAFE POINT, Bihar
                </span>
              </div>
            </div>

            {shopSettings.address && (
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {shopSettings.address}
              </p>
            )}

            {shopSettings.openingHours && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>{shopSettings.openingHours}</span>
              </div>
            )}

            <a
              href={shopSettings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 neu-btn text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 min-h-[44px]"
            >
              <span>{language === 'hi' ? 'गूगल मैप्स पर रूट देखें' : 'Open in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 neu-card p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {language === 'hi' ? 'संदेश भेजें (Send Message)' : 'Send Us a Message'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {language === 'hi'
              ? 'अपना विवरण भरें। हम जल्द से जल्द आपसे फोन या व्हाट्सएप पर संपर्क करेंगे।'
              : 'Submit your query below. Our staff will review and get back to you.'}
          </p>

          {submitted ? (
            <div className="p-6 rounded-2xl neu-inset text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                {language === 'hi' ? 'संदेश सफलतापूर्वक प्राप्त हुआ!' : 'Message Received Successfully!'}
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {language === 'hi'
                  ? 'धन्यवाद! मेराज कैफे पॉइंट टीम जल्द ही आपके मोबाइल नंबर पर संपर्क करेगी।'
                  : 'Thank you! Meraj Cafe Point team will contact you on your mobile number shortly.'}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl neu-btn-emerald text-white"
              >
                {language === 'hi' ? 'अन्य संदेश भेजें' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl neu-inset text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Deepak Kumar"
                    className="w-full px-3.5 py-2.5 text-sm neu-input text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9060776981"
                    className="w-full px-3.5 py-2.5 text-sm neu-input text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject / Service Needed
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. RTPS Caste Certificate or Urgent Admit Card Print"
                  className="w-full px-3.5 py-2.5 text-sm neu-input text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Message / Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'hi' ? 'अपनी आवश्यकता के बारे में यहाँ लिखें...' : 'Describe what you need...'}
                  className="w-full p-3.5 text-sm neu-input text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 neu-btn-orange text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'hi' ? 'संदेश सबमिट करें' : 'Submit Message'}</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
