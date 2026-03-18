import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'zh';
export type PantoneStyle = 
  | 'classic-blue' 
  | 'living-coral' 
  | 'ultra-violet' 
  | 'greenery' 
  | 'rose-quartz' 
  | 'serenity' 
  | 'marsala' 
  | 'radiant-orchid' 
  | 'emerald' 
  | 'tangerine-tango';

export interface AppState {
  theme: Theme;
  language: Language;
  pantoneStyle: PantoneStyle;
  apiKey: string;
  submissionSummary: string;
  fdaInfo: string;
  reviewGuidance: string;
  preliminaryReview: string;
  customSkillResult: string;
  followUpQuestions: string;
}

interface AppContextType {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const defaultState: AppState = {
  theme: 'light',
  language: 'en',
  pantoneStyle: 'classic-blue',
  apiKey: '',
  submissionSummary: '',
  fdaInfo: '',
  reviewGuidance: '',
  preliminaryReview: '',
  customSkillResult: '',
  followUpQuestions: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(defaultState);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ state, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
