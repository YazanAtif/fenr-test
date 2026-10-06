export type ProductSize = 'S' | 'M' | 'L' | 'XL';

export interface ProductColor {
  name: string;
  hex: string;
  badgeAccent?: string;
}

export interface SizeMeasurement {
  size: ProductSize;
  chestInches: number;
  lengthInches: number;
  shoulderInches: number;
  sleeveInches: number;
  chestCm: number;
  lengthCm: number;
  shoulderCm: number;
  sleeveCm: number;
}

export interface Product {
  id: string;
  name: string;
  japaneseName: string;
  category: 'Graphic Tees' | 'Hoodies';
  pricePKR: number;
  priceUSD: number;
  originalPricePKR?: number;
  originalPriceUSD?: number;
  description: string;
  highlightSpecs: string[];
  details: string[];
  fabricCare: string[];
  shippingInfo: string;
  images: string[];
  primaryColor: string;
  availableColors: ProductColor[];
  sizes: {
    size: ProductSize;
    inStock: boolean;
    quantity: number;
  }[];
  badge?: 'NEW DROP' | 'SELLING FAST' | 'LIMITED';
  badgeColor?: string;
  rating: number;
  reviewsCount: number;
  measurements: SizeMeasurement[];
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  selectedColor: ProductColor;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  sizePurchased: ProductSize;
}

export interface ArticleContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'comic-panel' | 'quote' | 'stat';
  text?: string;
  caption?: string;
  imageSrc?: string;
  speaker?: string;
  sfx?: string;
  narrator?: string;
  stats?: { label: string; value: string }[];
}

export interface Article {
  id: string;
  issue: string;
  title: string;
  japaneseTitle: string;
  subtitle: string;
  category: 'Style Guides' | 'Drop Announcements' | 'Culture' | 'Behind the Brand';
  readTime: string;
  date: string;
  author?: string;
  coverImage: string;
  panelGridImages?: string[];
  excerpt: string;
  pullQuote: string;
  speaker: string;
  badge?: 'HOT' | 'POW' | 'EXCLUSIVE' | 'ISSUE #01' | 'SPECIAL ISSUE' | 'SABR // 01' | string;
  blocks: ArticleContentBlock[];
  relatedProductIds: string[];
}

export interface Drop {
  id: string;
  code: string;
  title: string;
  releaseDate: string; // ISO string
  description: string;
  itemCount: number;
  images: string[];
  status: 'upcoming' | 'live' | 'vault';
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  deliveryNotes?: string;
}

export type PaymentMethodType = 'easypaisa' | 'sadapay' | 'nayapay' | 'visa_mastercard' | 'cod';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shipping: ShippingDetails;
  paymentMethod: PaymentMethodType;
  subtotalPKR: number;
  subtotalUSD: number;
  shippingPKR: number;
  shippingUSD: number;
  discountPKR: number;
  discountUSD: number;
  totalPKR: number;
  totalUSD: number;
  currency: 'PKR' | 'USD';
  status: 'confirmed' | 'processing' | 'dispatched' | 'delivered';
  courier: 'TCS Express' | 'Leopards' | 'Rider PK';
  trackingNumber: string;
  createdAt: string;
}
