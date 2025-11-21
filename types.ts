export interface PersonalDetails {
  name: string;
  age: string;
  phone: string;
}

export interface ChildDetails {
  count: number;
  child1Age: string;
  child2Age: string;
  schoolPerformance: number; // 1-10
}

export interface Question {
  id: number;
  text: string;
  subText?: string;
  category: 'warmth' | 'control' | 'support';
}

export interface SurveyResponse {
  [questionId: number]: number; // 0, 1, or 2
}

export interface AssessmentResult {
  id: string;
  timestamp: Date;
  personalInfo: PersonalDetails;
  childInfo: ChildDetails;
  scores: {
    warmthScore: number;
    controlScore: number;
    supportScore: number;
    maxWarmth: number;
    maxControl: number;
    maxSupport: number;
  };
  styleTitle: string;
}

export enum Step {
  WELCOME,
  PERSONAL_INFO,
  CHILD_INFO,
  SURVEY,
  RESULTS,
  DASHBOARD
}