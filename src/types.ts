export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export type ToolStatus = 'working' | 'partial' | 'coming_soon';

export type ToolCategory = 
  | 'image'
  | 'pdf'
  | 'document'
  | 'qr_barcode'
  | 'calculator'
  | 'printing';

export interface ToolItem {
  id: string;
  name: string;
  nameHi: string;
  category: ToolCategory;
  description: string;
  descriptionHi: string;
  status: ToolStatus;
  statusReason?: string;
  badge?: string;
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  titleHi: string;
  category: 'gov_form' | 'printing' | 'photo' | 'id_services' | 'education' | 'utility';
  description: string;
  descriptionHi: string;
  turnaround: string;
  turnaroundHi: string;
  price: string | null; // null means "Ask on WhatsApp"
  requirements: string[];
  requirementsHi: string[];
}

export interface GovtPortalLink {
  id: string;
  title: string;
  titleHi: string;
  category: 'jobs' | 'admit_card' | 'results' | 'certificates' | 'bihar_gov';
  portalName: string;
  officialUrl: string;
  description: string;
  descriptionHi: string;
  isVerified: boolean;
}

export interface ShopSettings {
  name: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  address: string; // empty until filled
  openingHours: string; // empty until filled
  upiId: string; // empty until filled
  upiName: string;
  email: string; // empty until filled
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    telegram?: string;
  };
}

export type ApplicationStatus = 
  | 'Received'
  | 'In progress'
  | 'Needs documents'
  | 'Completed'
  | 'Cancelled';

export interface CustomerApplication {
  id: string;
  customerName: string;
  mobile: string;
  serviceName: string;
  status: ApplicationStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  feeAmount?: number;
  paymentStatus?: 'Unpaid' | 'Paid (Cash)' | 'Paid (UPI)';
  paymentRef?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  mobile: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
