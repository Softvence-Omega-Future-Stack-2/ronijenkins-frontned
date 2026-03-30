// types/prisma.ts

// ============== ENUMS ==============

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CLINIC = 'CLINIC',
  CUSTOMER = 'CUSTOMER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  UNVERIFIED = 'UNVERIFIED',
}

export enum Lang {
  ENG = 'ENG',
  RON = 'RON',
  HUN = 'HUN',
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
  INACTIVE = 'INACTIVE',
}

export enum PauseType {
  NONE = 'NONE',
  PERIMENO = 'PERIMENO',
  POSTMENO = 'POSTMENO',
  PREMENO = 'PREMENO',
}

export enum PlanName {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum SubscribePlan {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum SubscriptionPlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PaymentStatus {
  REQUIRES_PAYMENT_METHOD = 'REQUIRES_PAYMENT_METHOD',
  REQUIRES_CONFIRMATION = 'REQUIRES_CONFIRMATION',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
  PROCESSING = 'PROCESSING',
  REQUIRES_CAPTURE = 'REQUIRES_CAPTURE',
  CANCELED = 'CANCELED',
  SUCCEEDED = 'SUCCEEDED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  FAILED = 'FAILED',
}

export enum BroadcastType {
  NOW = 'NOW',
  SCHEDULED = 'SCHEDULED',
}

export enum BroadcastStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export enum BroadcastMethod {
  FCM = 'FCM',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum ContentType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
}

export enum LogPreference {
  HOT_FLASHES = 'HOT_FLASHES',
  NIGHT_SWEATS = 'NIGHT_SWEATS',
  MOOD_SWINGS = 'MOOD_SWINGS',
  SLEEP_DISTURBANCES = 'SLEEP_DISTURBANCES',
  VAGINAL_DRYNESS = 'VAGINAL_DRYNESS',
  IRREGULAR_PERIODS = 'IRREGULAR_PERIODS',
  JOINT_PAIN = 'JOINT_PAIN',
  HEADACHES = 'HEADACHES',
  FATIGUE = 'FATIGUE',
  MEMORY_PROBLEMS = 'MEMORY_PROBLEMS',
}

export enum Topic {
  HORMONES_HRT = 'HORMONES_HRT',
  NUTRITION_WEIGHT = 'NUTRITION_WEIGHT',
  MENTAL_WELLBEING = 'MENTAL_WELLBEING',
  STRENGTH_MOBILITY = 'STRENGTH_MOBILITY',
  SEXUAL_HEALTH = 'SEXUAL_HEALTH',
  SLEEP_RECOVERY = 'SLEEP_RECOVERY',
  HEALTH_SCREENING = 'HEALTH_SCREENING',
  OTHER = 'OTHER',
}

export enum PostCategory {
  PERIMENOPAUSE_JOURNEY = 'PERIMENOPAUSE_JOURNEY',
  SYMPTOM_MANAGEMENT = 'SYMPTOM_MANAGEMENT',
  WELLNESS_CHALLENGES = 'WELLNESS_CHALLENGES',
  NAVELLE_HEALTH_FEEDBACK = 'NAVELLE_HEALTH_FEEDBACK',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum MedicalHistoryCategory {
  GYNECOLOGICAL = 'GYNECOLOGICAL',
  ENDOCRINE = 'ENDOCRINE',
  CARDIOVASCULAR = 'CARDIOVASCULAR',
  GASTROINTESTINAL = 'GASTROINTESTINAL',
  NEUROLOGICAL = 'NEUROLOGICAL',
  PSYCHIATRIC = 'PSYCHIATRIC',
  UROLOGICAL = 'UROLOGICAL',
  MUSCULOSKELETAL = 'MUSCULOSKELETAL',
  OTHER = 'OTHER',
}

export enum HealthGoalCategory {
  HORMONES_HRT = 'HORMONES_HRT',
  NUTRITION_WEIGHT = 'NUTRITION_WEIGHT',
  MENTAL_WELLBEING = 'MENTAL_WELLBEING',
  STRENGTH_MOBILITY = 'STRENGTH_MOBILITY',
  SEXUAL_HEALTH = 'SEXUAL_HEALTH',
  SLEEP_RECOVERY = 'SLEEP_RECOVERY',
  HEALTH_SCREENING = 'HEALTH_SCREENING',
  OTHER = 'OTHER',
}

export enum Symptom {
  VASOMOTOR = 'VASOMOTOR',
  MOOD_MENTAL_HEALTH = 'MOOD_MENTAL_HEALTH',
  SLEEP = 'SLEEP',
  SEXUAL_HEALTH = 'SEXUAL_HEALTH',
  URINARY = 'URINARY',
  COGNITIVE = 'COGNITIVE',
  WEIGHT_METABOLIC = 'WEIGHT_METABOLIC',
  MOTOR_PHYSICAL = 'MOTOR_PHYSICAL',
  PELVIC_URINARY = 'PELVIC_URINARY',
  OTHER = 'OTHER',
}

export enum FileType {
  DOC = 'DOC',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum NotificationType {
  SUBSCRIPTION_REMINDER = 'SUBSCRIPTION_REMINDER',
  GROUP_ASSIGNMENT = 'GROUP_ASSIGNMENT',
  MEMBER_REGISTERED = 'MEMBER_REGISTERED',
  POST_ENGAGEMENT = 'POST_ENGAGEMENT',
  TRAINING_REQUESTED = 'TRAINING_REQUESTED',
  NEED_HELP_REQUESTED = 'NEED_HELP_REQUESTED',
}

export enum BloodGroup {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  AUD = 'AUD',
  CAD = 'CAD',
  JPY = 'JPY',
}

// ============== INTERFACES ==============

export interface User {
  id: string;
  username: string | null;
  email: string;
  contactNo: string;
  password: string | null;
  lang: Lang;
  role: Role;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: UserStatus;
  dob: Date | null;
  fcmToken: string | null;
  admin: Admin | null;
  customer: Customer | null;
  notifications: Notification[];
  blockReason: string | null;
  verificationCode: string | null;
  provider: AuthProvider;
  providerId: string | null;
  verificationCodeExpires: Date | null;
  verificationCodeLastSent: Date | null;
}

export interface Admin {
  id: string;
  userId: string;
  fullName: string;
  address: string | null;
  intro: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  location: string | null;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  userId: string;
  fullName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  pauseType: PauseType | null;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  planName: PlanName | null;
  symptoms: SymptomTracker[];
  topics: Topic[];
  payments: Payment[];
  subscriptions: Subscription[];
  region: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  MedicalHistory: MedicalHistory[];
  HealthGoal: HealthGoal[];
  comments: Comment[];
  labHistories: LabHistory[];
}

export interface Broadcast {
  id: string;
  name: string;
  body: string | null;
  buttonText: string | null;
  linkUrl: string | null;
  attachmentUrl: string | null;
  scheduledAt: Date | null;
  type: BroadcastType;
  status: BroadcastStatus;
  method: BroadcastMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface Content {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: ContentType;
  category: LogPreference | null;
  time: number | null;
  thumbnail: string | null;
  notify: boolean;
  locked: boolean;
  status: ContentStatus;
  impressions: number;
  completionRate: number;
  avgRating: number;
  videoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  plan: SubscribePlan;
  status: SubscriptionPlanStatus;
  name: string | null;
  description: string | null;
  trialPeriod: boolean;
  price: number;
  stripePriceId: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  enrolledSubscription: Subscription[];
}

export interface Subscription {
  id: string;
  customerId: string | null;
  subscriptionPlanId: string | null;
  subscriptionStatus: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  cancelRequest: boolean;
  customer: Customer | null;
  subscriptionPlan: SubscriptionPlan | null;
  payments: Payment[];
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  currency: string | null;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  subscriptionId: string | null;
  subscriptionPlanId: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
  subscription: Subscription | null;
}

export interface Post {
  id: string;
  name: string;
  category: PostCategory;
  description: string | null;
  tags: string[];
  files: File[];
  links: string[];
  annonimously: boolean;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  post: Post;
  customerId: string;
  customer: Customer;
  body: string;
  parentId: string | null;
  parent: Comment | null;
  children: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalHistory {
  id: string;
  condition: string;
  category: MedicalHistoryCategory;
  customerId: string;
  customer: Customer;
  startedProblem: Date;
  dateDiagnosed: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthGoal {
  id: string;
  name: string;
  customerId: string;
  customer: Customer;
  whatMeasuring: string;
  currentValue: number;
  targetValue: number;
  category: HealthGoalCategory;
  startDate: Date;
  endDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabHistory {
  id: string;
  customerId: string;
  customer: Customer;
  notes: string | null;
  url: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SymptomTracker {
  id: string;
  name: LogPreference;
  type: Symptom;
  severity: number;
  notes: string | null;
  customerId: string;
  customer: Customer;
  createdAt: Date;
  updatedAt: Date;
}

export interface File {
  id: string;
  name: string | null;
  url: string;
  postId: string;
  post: Post;
  type: FileType;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: string;
  name: string;
  slug: string;
  writer: string;
  description: string;
  url: string | null;
  secUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: string | null;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

// ============== INPUT TYPES (for DTOs/Create/Update) ==============

export interface CreateUserInput {
  username?: string;
  email: string;
  contactNo?: string;
  password?: string;
  lang?: Lang;
  role?: Role;
  avatar?: string;
  dob?: Date;
  fcmToken?: string;
  provider?: AuthProvider;
  providerId?: string;
}

export interface UpdateUserInput {
  username?: string;
  contactNo?: string;
  password?: string;
  lang?: Lang;
  role?: Role;
  avatar?: string;
  status?: UserStatus;
  dob?: Date;
  fcmToken?: string;
  blockReason?: string;
  verificationCode?: string;
  provider?: AuthProvider;
  providerId?: string;
  verificationCodeExpires?: Date;
  verificationCodeLastSent?: Date;
}

export interface CreateCustomerInput {
  userId: string;
  fullName?: string;
  pauseType?: PauseType;
  subscriptionStatus?: SubscriptionStatus;
  stripeCustomerId?: string;
  planName?: PlanName;
  region?: string;
}

export interface UpdateCustomerInput {
  fullName?: string;
  pauseType?: PauseType;
  subscriptionStatus?: SubscriptionStatus;
  stripeCustomerId?: string;
  planName?: PlanName;
  region?: string;
}

export interface CreateAdminInput {
  userId: string;
  fullName: string;
  address?: string;
  intro?: string;
  city?: string;
  state?: string;
  zip?: string;
  location?: string;
}

export interface CreateSubscriptionInput {
  customerId?: string;
  subscriptionPlanId?: string;
  subscriptionStatus?: SubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  expiresAt?: Date;
  cancelRequest?: boolean;
}

export interface CreatePaymentInput {
  customerId: string;
  amount: number;
  currency?: string;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  subscriptionId?: string;
  subscriptionPlanId?: string;
}

export interface CreatePostInput {
  name: string;
  category: PostCategory;
  description?: string;
  tags?: string[];
  links?: string[];
  annonimously?: boolean;
  status?: PostStatus;
}

export interface CreateCommentInput {
  postId: string;
  customerId: string;
  body: string;
  parentId?: string;
}

export interface CreateContentInput {
  name: string;
  slug: string;
  description?: string;
  type?: ContentType;
  category?: LogPreference;
  time?: number;
  thumbnail?: string;
  notify?: boolean;
  locked?: boolean;
  status?: ContentStatus;
  videoUrl?: string;
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: string;
}

// ============== RESPONSE TYPES ==============

// export interface UserResponse extends Omit<User, 'password'> {
//   admin?: Admin | null;
//   customer?: Customer | null;
// }

// export interface CustomerResponse extends Omit<Customer, 'user'> {
//   user?: UserResponse;
// }

// export interface SubscriptionWithPlan extends Subscription {
//   subscriptionPlan?: SubscriptionPlan | null;
//   customer?: CustomerResponse | null;
// }

// export interface PaymentWithRelations extends Payment {
//   customer?: CustomerResponse;
//   subscription?: SubscriptionWithPlan | null;
// }

// export interface PostWithRelations extends Post {
//   comments?: Comment[];
//   files?: File[];
// }

// export interface CommentWithRelations extends Comment {
//   customer?: CustomerResponse;
//   parent?: CommentWithRelations | null;
//   children?: CommentWithRelations[];
// }

// ============== PAGINATION TYPES ==============

export interface PaginationInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface PaginatedResponse<T> {
  meta: Meta;
  data: T[];
}

// ============== FILTER TYPES ==============

export interface UserFilter {
  email?: string;
  role?: Role;
  status?: UserStatus;
  createdAt?: Date;
}

export interface CustomerFilter {
  subscriptionStatus?: SubscriptionStatus;
  planName?: PlanName;
  region?: string;
  createdAt?: Date;
}

export interface ContentFilter {
  type?: ContentType;
  status?: ContentStatus;
  category?: LogPreference;
  locked?: boolean;
}

export interface PostFilter {
  category?: PostCategory;
  status?: PostStatus;
  tags?: string[];
}