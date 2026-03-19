export type SubscriptionPlan = 'free' | 'premium';

export interface UserProfile {
  plan: SubscriptionPlan;
  analysisCount: number;
  limit: number;
}

export interface CarDetails {
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  images?: string[]; 
  carfaxReport?: string; 
  carfaxMimeType?: string;
  inspectionReport?: string;
  inspectionMimeType?: string;
  description?: string;
}

export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface AlternativeCar {
  make: string;
  model: string;
  year: number;
  reason: string;
}

export interface RecallItem {
  title: string;
  description: string;
  severity: 'Critical' | 'Moderate' | 'Historical';
}

export interface CarReport {
  reliabilityScore: number; 
  riskLevel: RiskLevel;
  technicalSummary: string;
  nonTechnicalSummary: string;
  commonIssues: string[];
  inspectionChecklist: string[];
  positiveIndicators: string[];
  priceAnalysis: string;
  suggestions: AlternativeCar[];
  recalls: RecallItem[]; 
  carfaxInsights?: string;
  inspectionInsights?: string;
  negotiationTips?: string;
  deductionLogic: {
    category: string;
    deduction: number;
    reasoning: string;
  }[];
  verdict: string;
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface Feedback {
  id: string;
  reportId: string;
  rating: 'positive' | 'negative';
  comment: string;
  timestamp: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  carDetails: CarDetails;
  report: CarReport;
  sources: WebSource[];
}