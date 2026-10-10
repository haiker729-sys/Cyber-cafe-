import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../context/AppContext.tsx';

export const SeoHelmet: React.FC = () => {
  const { activeTab, selectedToolId, language, shopSettings } = useApp();

  // Determine metadata based on activeTab and selectedToolId
  let pageTitle = 'MERAJ CAFE POINT | Cyber Cafe, Online Tools & Digital Services in Bihar';
  let metaDescription =
    language === 'hi'
      ? 'मेराज कैफे पॉइंट - बिहार में विश्वसनीय साइबर कैफे और ऑनलाइन डिजिटल सेवा केंद्र। पासपोर्ट फोटो, पीडीएफ टूल्स, सरकारी फॉर्म व प्रिंटिंग सेवाएं।'
      : 'MERAJ CAFE POINT - Premier Cyber Cafe & Online Service Center in Bihar. Instant passport photo maker, PDF tools, image compressor & government application assistance.';
  let pageKeywords =
    'meraj cafe point, cyber cafe bihar, passport photo maker online, image compressor kb, pdf merge online, bihar govt jobs, rtps bihar, online admission form, printing digital service';

  // Specific Tool Titles & Descriptions
  if (activeTab === 'tools' && selectedToolId) {
    switch (selectedToolId) {
      case 'compress-image':
        pageTitle =
          language === 'hi'
            ? 'इमेज कंप्रेसर (20KB - 50KB) | MERAJ CAFE POINT'
            : 'Image Compressor (Target 20KB - 50KB) | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'सरकारी फॉर्म और ऑनलाइन एग्जाम के लिए फोटो का साइज 20KB, 50KB या 100KB में कम करें बिना क्वालिटी खोए।'
            : 'Compress exam photos and documents to exact target sizes (20KB, 50KB, 100KB) with lossless quality for online form submissions.';
        break;
      case 'resize-image':
        pageTitle =
          language === 'hi'
            ? 'फोटो रीसाइज़र (पिक्सेल और सेमी) | MERAJ CAFE POINT'
            : 'Photo & Signature Resizer (Pixels & Cm) | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'ऑनलाइन आवेदन के लिए फोटो व सिग्नेचर की सही लम्बाई-चौड़ाई (पिक्सेल/सेमी) सेट करें।'
            : 'Resize candidate photo and signature to required pixel dimensions and aspect ratios for SSC, UPSC, and Bihar government portals.';
        break;
      case 'convert-image':
        pageTitle =
          language === 'hi'
            ? 'इमेज कन्वर्टर (JPG, PNG, WebP) | MERAJ CAFE POINT'
            : 'Image Converter (JPG, PNG, WebP) | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'किसी भी फोटो को तुरंत JPG, PNG या WebP फॉर्मेट में बदलें और डाउनलोड करें।'
            : 'Convert images to JPG, PNG, or WebP instantly in your browser without uploading to external servers.';
        break;
      case 'passport-photo':
        pageTitle =
          language === 'hi'
            ? 'पासपोर्ट साइज फोटो मेकर (6/12/32 फोटो शीट) | MERAJ CAFE POINT'
            : 'Passport Size Photo Maker (Print 4x6 / A4 Sheets) | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'भारतीय पासपोर्ट साइज फोटो (3.5x4.5 cm) बनाएं, बैकग्राउंड बदलें और प्रिंटिंग शीट तुरंत डाउनलोड करें।'
            : 'Create Indian standard passport photos (3.5x4.5 cm) with white/blue background and generate printable 6/12 photo sheets.';
        break;
      case 'pdf-merge':
        pageTitle =
          language === 'hi'
            ? 'पीडीएफ मर्ज टूल (फ्री में कई PDF जोड़ें) | MERAJ CAFE POINT'
            : 'Merge PDF Online (Combine Multiple PDFs) | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'कई पीडीएफ फाइलों को एक साथ एक ही डॉक्यूमेंट में आसानी से मर्ज करें।'
            : 'Fast, secure in-browser PDF merge tool. Combine marksheets, certificates, and application documents into a single PDF.';
        break;
      case 'pdf-split':
        pageTitle =
          language === 'hi'
            ? 'पीडीएफ स्प्लिटर (पेज अलग करें) | MERAJ CAFE POINT'
            : 'Split PDF Pages Online (Extract Specific Pages) | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'पीडीएफ फाइल में से मनपसंद पेज अलग करें या रेंज के अनुसार नई पीडीएफ बनाएं।'
            : 'Extract individual pages or custom ranges from any PDF document quickly and securely.';
        break;
      case 'qr-code':
        pageTitle =
          language === 'hi'
            ? 'क्यूआर कोड जनरेटर (UPI, URL, वाईफाई) | MERAJ CAFE POINT'
            : 'QR Code Generator (UPI Payment, URL, WiFi) | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'दुकान, पेमेंट व वेबसाइट के लिए हाई-रिज़ॉल्यूशन क्यूआर कोड बनाएं और डाउनलोड करें।'
            : 'Generate customizable, high-resolution QR codes for UPI payments, website URLs, and WhatsApp messaging with color presets.';
        break;
      case 'calculators':
        pageTitle =
          language === 'hi'
            ? 'साइबर कैफे कैलकुलेटर (आयु, GST, EMI, अंक प्रतिशत) | MERAJ CAFE POINT'
            : 'Cyber Cafe Calculator Suite (Age, GST, EMI, Marks) | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'सरकारी नौकरी के लिए कटऑफ डेट के अनुसार आयु, बिलिंग पर GST और लोन EMI की सटीक गणना करें।'
            : 'Calculate exact age eligibility as of cutoff date for government jobs, GST invoices (+/-), and exam percentage marks.';
        break;
      case 'whatsapp-print':
        pageTitle =
          language === 'hi'
            ? 'व्हाट्सएप डायरेक्ट प्रिंटिंग ऑर्डर | MERAJ CAFE POINT'
            : 'WhatsApp Direct Print Order | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'दस्तावेज और फोटो प्रिंटिंग के निर्देश सेट करें और सीधे मेराज कैफे पॉइंट के व्हाट्सएप पर ऑर्डर भेजें।'
            : 'Configure color/B&W printing instructions and send documents directly to Meraj Cafe Point on WhatsApp (9060776981).';
        break;
    }
  } else {
    // Tab Level Metadata
    switch (activeTab) {
      case 'tools':
        pageTitle =
          language === 'hi'
            ? 'सभी ऑनलाइन टूल्स | MERAJ CAFE POINT'
            : 'All Online Tools Directory | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'फ्री ऑनलाइन टूल्स: फोटो कंप्रेसर, पासपोर्ट साइज फोटो मेकर, पीडीएफ मर्जर, क्यूआर कोड और कैलकुलेटर।'
            : 'Free cyber cafe web tools: image compressor, passport photo generator, PDF merge & split, QR code maker, and age calculators.';
        break;
      case 'services':
        pageTitle =
          language === 'hi'
            ? 'साइबर कैफे सेवाएं | MERAJ CAFE POINT'
            : 'Cyber Cafe & Online Services | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'सरकारी आवेदन (RTPS, जाति/आय/निवास), पैन कार्ड, आधार सुधार, कॉलेज एडमिशन और हाई-स्पीड प्रिंटिंग।'
            : 'Expert cyber cafe services in Bihar: RTPS caste/income/domicile certificates, PAN card, Aadhaar updates, and digital printing.';
        break;
      case 'govt':
        pageTitle =
          language === 'hi'
            ? 'सरकारी नौकरी एवं एडमिट कार्ड पोर्टल | MERAJ CAFE POINT'
            : 'Bihar Govt Jobs, Results & Admit Card Directory | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'बिहार एवं केंद्रीय सरकारी नौकरियों, एडमिट कार्ड और रिजल्ट्स के आधिकारिक सत्यापित लिंक्स।'
            : 'Official verified links directory for Bihar government jobs, SSC, UPSC, Railway, admit cards, and latest examination results.';
        break;
      case 'contact':
        pageTitle =
          language === 'hi'
            ? 'संपर्क करें | MERAJ CAFE POINT (Phone: 9060776981)'
            : 'Contact Us | MERAJ CAFE POINT (WhatsApp: 9060776981)';
        metaDescription =
          language === 'hi'
            ? 'मेराज कैफे पॉइंट से संपर्क करें। फोन व व्हाट्सएप: 9060776981। गूगल मैप्स लोकेशन और सहायता केंद्र।'
            : 'Get in touch with Meraj Cafe Point via phone or WhatsApp at 9060776981. Visit our cyber cafe center in Bihar or find us on Google Maps.';
        break;
      case 'status':
        pageTitle =
          language === 'hi'
            ? 'आवेदन स्थिति ट्रैक करें | MERAJ CAFE POINT'
            : 'Track Application Status | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'अपने फॉर्म या सेवा का स्टेटस मोबाइल नंबर या रेफरेंस आईडी डालकर ऑनलाइन चेक करें।'
            : 'Track the real-time processing status of your online government applications and certificates submitted at Meraj Cafe Point.';
        break;
      case 'admin':
        pageTitle = 'Admin & Staff Portal | MERAJ CAFE POINT';
        metaDescription = 'Secure shop management portal for Meraj Cafe Point staff and owner.';
        break;
      case 'about':
        pageTitle =
          language === 'hi'
            ? 'हमारे बारे में | MERAJ CAFE POINT'
            : 'About Us | MERAJ CAFE POINT';
        metaDescription =
          language === 'hi'
            ? 'मेराज कैफे पॉइंट की कहानी, उद्देश्य और बिहार में प्रदान की जाने वाली डिजिटल सेवाएं।'
            : 'Learn about Meraj Cafe Point - your trusted partner for digital empowerment and online services in Bihar.';
        break;
      case 'privacy':
        pageTitle = 'Privacy Policy | MERAJ CAFE POINT';
        metaDescription = 'Privacy Policy and client data protection practices of Meraj Cafe Point.';
        break;
      case 'terms':
        pageTitle = 'Terms & Conditions | MERAJ CAFE POINT';
        metaDescription = 'Terms of service and customer guidelines for Meraj Cafe Point.';
        break;
    }
  }

  // Current URL resolution
  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${activeTab !== 'home' ? `?tab=${activeTab}` : ''}`
      : 'https://merajcafepoint.in';

  // Schema.org Structured Data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${typeof window !== 'undefined' ? window.location.origin : ''}/#business`,
        name: 'MERAJ CAFE POINT',
        alternateName: 'मेराज कैफे पॉइंट',
        telephone: `+91${shopSettings.phone || '9060776981'}`,
        url: typeof window !== 'undefined' ? window.location.origin : '',
        hasMap: 'https://goo.gl/maps/Du7Zmka1h91PL9HF8?g_st=ac',
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Bihar',
          addressCountry: 'IN',
        },
        priceRange: '₹',
        description:
          'Cyber Cafe, Online Service Center, In-browser Image & PDF Tools, Government Application Assistance and Digital Printing Services in Bihar.',
      },
      {
        '@type': 'WebApplication',
        '@id': `${currentUrl}#webapp`,
        name: pageTitle,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript and modern browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: typeof window !== 'undefined' ? window.location.origin : '',
          },
          ...(activeTab !== 'home'
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: activeTab.toUpperCase(),
                  item: currentUrl,
                },
              ]
            : []),
        ],
      },
    ],
  };

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />

      {/* Language Alternates */}
      <html lang={language === 'hi' ? 'hi' : 'en'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content="MERAJ CAFE POINT" />
      <meta property="og:locale" content={language === 'hi' ? 'hi_IN' : 'en_IN'} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};
