export type ScalpType = 'Oily' | 'Dry' | 'Normal' | 'Sensitive' | 'Combination';
export type HairType = 'Straight' | 'Wavy' | 'Curly' | 'Coily';
export type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive';
export type FlowIntensity = 'Spotting' | 'Light' | 'Medium' | 'Heavy';
export type MoodType = 'Calm' | 'Happy' | 'Energetic' | 'Tired' | 'Irritable' | 'Anxious' | 'Sad' | 'Crampy';
export type CycleRegularity = 'Regular (26-32 days)' | 'Slightly Irregular' | 'Irregular' | 'Not Sure';

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  scalpType: ScalpType;
  hairType: HairType;
  hairConcerns: string[];
  hairWashFreq: string;
  skinType: SkinType;
  skinConcerns: string[];
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLengthDays: number;
  cycleRegularity: CycleRegularity;
  periodFlow: FlowIntensity;
  periodMood: MoodType;
  areaLandmark: string;
  fullAddress: string;
  pincode: string;
  contactNumber: string;
  locationPermissionGranted: boolean;
  onboardingCompleted: boolean;
}

export interface UserAuth {
  isLoggedIn: boolean;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

export interface PeriodDailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  flow: FlowIntensity;
  mood: MoodType;
  painLevel: number; // 0-10
  discharge: 'None' | 'Watery' | 'Creamy' | 'Egg-white' | 'Sticky' | 'Dry';
  notes: string;
}

export interface Recipe {
  id: string;
  title: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  category: 'Hormonal Wellness' | 'Weight Management' | 'Glowing Skin' | 'Hair Care' | 'Bone Health';
  calories: number;
  cookTimeMinutes: number;
  image: string;
  benefits: string[];
  ingredients: { name: string; amount: string; storeProductId?: string }[];
  instructions: string[];
  dietaryTags: string[];
}

export interface ExerciseItem {
  id: string;
  title: string;
  category: 'Yoga' | 'Walking & Cardio' | 'Facial & Relaxation' | 'Scalp & Hair Care' | 'Bone Strength';
  durationSeconds: number;
  caloriesBurned: number;
  difficulty: 'Gentle' | 'Moderate' | 'Invigorating';
  image: string;
  instructions: string[];
  benefits: string[];
  targetPhase?: CyclePhase;
}

export type StoreCategory =
  | 'Skin Care'
  | 'Hair Care'
  | 'Period Essentials'
  | 'Medicines'
  | 'Supplements'
  | 'Herbal Teas'
  | 'Aromatherapy'
  | 'Sleep & Recovery'
  | 'Superfoods & Seeds'
  | 'Body & Intimate'
  | 'Wellness Tools';

export interface StoreProduct {
  id: string;
  name: string;
  brand: string;
  category: StoreCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  requiresConsultation?: boolean;
  cautionNotice?: string;
  stockStatus: 'In Stock' | 'Low Stock';
  bestFor: string[];
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export interface HospitalLab {
  id: string;
  type: 'Hospital' | 'Laboratory';
  name: string;
  address: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  openStatus: string;
  contactNumber: string;
  emergencyAvailable: boolean;
  services: string[];
  doctors?: Doctor[];
  tests?: LabTest[];
  image: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  availableToday: boolean;
  slots: string[];
}

export interface LabTest {
  id: string;
  name: string;
  price: number;
  fastingRequired: boolean;
  turnaroundHours: number;
  homeCollectionAvailable: boolean;
}

export interface RideOption {
  id: 'bike' | 'auto' | 'cab' | 'ambulance';
  name: string;
  etaMinutes: number;
  price: number;
  description: string;
  iconName: string;
}

export interface AppNotification {
  id: string;
  category: 'Period' | 'Diet' | 'Store' | 'SOS' | 'Health';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationSettings {
  period: boolean;
  diet: boolean;
  water: boolean;
  exercise: boolean;
  medicines: boolean;
  store: boolean;
  appointments: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface BookingRecord {
  id: string;
  type: 'Doctor' | 'Lab' | 'Ride';
  providerName: string;
  itemName: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'In Progress' | 'Completed';
  amount: number;
  bookingRef: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryMethod: string;
  status: 'Order Placed' | 'Packing' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
  shippingAddress: string;
  paymentMethod: string;
}
