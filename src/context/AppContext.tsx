import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, ShopSettings, CustomerApplication, ContactMessage } from '../types.ts';
import { INITIAL_SHOP_SETTINGS } from '../data/mockData.ts';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  shopSettings: ShopSettings;
  updateShopSettings: (settings: Partial<ShopSettings>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedToolId: string | null;
  setSelectedToolId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  applications: CustomerApplication[];
  addApplication: (app: Omit<CustomerApplication, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateApplicationStatus: (id: string, status: CustomerApplication['status'], notes?: string, paymentStatus?: CustomerApplication['paymentStatus'], paymentRef?: string) => void;
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  userRole: 'guest' | 'staff' | 'owner';
  setUserRole: (role: 'guest' | 'staff' | 'owner') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAMPLE_APPLICATIONS: CustomerApplication[] = [
  {
    id: 'APP-1002',
    customerName: 'Rahul Kumar',
    mobile: '9876543210',
    serviceName: 'RTPS Residential Certificate (निवास प्रमाण पत्र)',
    status: 'In progress',
    notes: 'Submitted on RTPS portal. Application Ref: RTPS/2026/0892. Processing with Revenue Officer.',
    createdAt: '2026-10-08 11:30',
    updatedAt: '2026-10-09 10:15',
    feeAmount: 70,
    paymentStatus: 'Paid (Cash)',
    paymentRef: 'CASH-RO1',
  },
  {
    id: 'APP-1001',
    customerName: 'Pooja Kumari',
    mobile: '9123456789',
    serviceName: 'New PAN Card Application',
    status: 'Completed',
    notes: 'PAN generated. e-PAN PDF sent on customer WhatsApp. Physical card will arrive at postal address in 10 days.',
    createdAt: '2026-10-06 14:00',
    updatedAt: '2026-10-08 16:45',
    feeAmount: 150,
    paymentStatus: 'Paid (UPI)',
    paymentRef: 'UPI-TXN9928',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state (English / Hindi)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('meraj_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'hi'; // default Hindi for local Bihar cyber cafe audience
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('meraj_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
  };

  // 2. Theme state (Light / Dark)
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('meraj_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
      }
    }
    localStorage.setItem('meraj_theme', theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  // 3. Shop settings state
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('meraj_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_SHOP_SETTINGS;
  });

  const updateShopSettings = (newSettings: Partial<ShopSettings>) => {
    setShopSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('meraj_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // 4. Navigation & Search state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 5. Customer Applications
  const [applications, setApplications] = useState<CustomerApplication[]>(() => {
    const saved = localStorage.getItem('meraj_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return SAMPLE_APPLICATIONS;
  });

  const addApplication = (appData: Omit<CustomerApplication, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newApp: CustomerApplication = {
      ...appData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem('meraj_applications', JSON.stringify(updated));
    return newId;
  };

  const updateApplicationStatus = (
    id: string,
    status: CustomerApplication['status'],
    notes?: string,
    paymentStatus?: CustomerApplication['paymentStatus'],
    paymentRef?: string
  ) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updated = applications.map((app) => {
      if (app.id === id) {
        return {
          ...app,
          status,
          notes: notes !== undefined ? notes : app.notes,
          paymentStatus: paymentStatus !== undefined ? paymentStatus : app.paymentStatus,
          paymentRef: paymentRef !== undefined ? paymentRef : app.paymentRef,
          updatedAt: now,
        };
      }
      return app;
    });
    setApplications(updated);
    localStorage.setItem('meraj_applications', JSON.stringify(updated));
  };

  // 6. Contact Messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('meraj_contact_msgs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: 'MSG-1',
        name: 'Amit Sharma',
        mobile: '9871122334',
        subject: 'BSSC Inter Level Form Submission',
        message: 'Sir, mera Inter level form fill karna hai. Documents ready hain, kal subah aa sakte hain?',
        createdAt: '2026-10-09 09:20',
        isRead: false,
      },
    ];
  });

  const addContactMessage = (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `MSG-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false,
    };
    const updated = [newMsg, ...contactMessages];
    setContactMessages(updated);
    localStorage.setItem('meraj_contact_msgs', JSON.stringify(updated));
  };

  const markMessageRead = (id: string) => {
    const updated = contactMessages.map((m) => (m.id === id ? { ...m, isRead: true } : m));
    setContactMessages(updated);
    localStorage.setItem('meraj_contact_msgs', JSON.stringify(updated));
  };

  // 7. Role-based view state (guest, staff, owner)
  const [userRole, setUserRole] = useState<'guest' | 'staff' | 'owner'>('guest');

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        shopSettings,
        updateShopSettings,
        activeTab,
        setActiveTab,
        selectedToolId,
        setSelectedToolId,
        searchQuery,
        setSearchQuery,
        applications,
        addApplication,
        updateApplicationStatus,
        contactMessages,
        addContactMessage,
        markMessageRead,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
