import { AnalysisResult, UserProfile, SubscriptionPlan, Feedback } from '../types';

const STORAGE_KEY = 'carwise_history_v1';
const USER_KEY = 'carwise_user_v1';
const FEEDBACK_KEY = 'carwise_feedback_v1';

const FREE_LIMIT = 3;

export const getUserProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) {
      return { plan: 'free', analysisCount: 0, limit: FREE_LIMIT };
    }
    return JSON.parse(stored);
  } catch (e) {
    return { plan: 'free', analysisCount: 0, limit: FREE_LIMIT };
  }
};

export const updatePlan = (plan: SubscriptionPlan): UserProfile => {
  const profile = getUserProfile();
  profile.plan = plan;
  profile.limit = plan === 'premium' ? Infinity : FREE_LIMIT;
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
  return profile;
};

export const incrementUsage = (): UserProfile => {
  const profile = getUserProfile();
  profile.analysisCount += 1;
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
  return profile;
};

export const getHistory = (): AnalysisResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored).sort((a: AnalysisResult, b: AnalysisResult) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveAnalysis = (analysis: AnalysisResult): AnalysisResult[] => {
  try {
    const history = getHistory();
    const existingIndex = history.findIndex(h => h.id === analysis.id);
    if (existingIndex >= 0) {
        history[existingIndex] = analysis;
    } else {
        history.unshift(analysis);
    }
    
    if (history.length > 20) {
        history.pop();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
  } catch (e) {
    console.error("Failed to save analysis", e);
    return [];
  }
};

export const deleteAnalysis = (id: string): AnalysisResult[] => {
  try {
    const history = getHistory().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
  } catch (e) {
    console.error("Failed to delete analysis", e);
    return [];
  }
};

export const clearHistory = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};

export const saveFeedback = (feedback: Feedback): void => {
  try {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    const feedbacks: Feedback[] = stored ? JSON.parse(stored) : [];
    feedbacks.push(feedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));
    console.log('Feedback saved:', feedback);
  } catch (e) {
    console.error("Failed to save feedback", e);
  }
};