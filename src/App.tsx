import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './store';
import { Sidebar } from './components/Sidebar';
import { SubmissionSummaryTab } from './components/SubmissionSummaryTab';
import { FDAInfoTab } from './components/FDAInfoTab';
import { ReviewGuidanceTab } from './components/ReviewGuidanceTab';
import { PreliminaryReviewTab } from './components/PreliminaryReviewTab';
import { CustomSkillTab } from './components/CustomSkillTab';
import { FollowUpQuestionsTab } from './components/FollowUpQuestionsTab';

function AppContent() {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    document.body.className = `theme-${state.theme} style-${state.pantoneStyle}`;
  }, [state.theme, state.pantoneStyle]);

  const renderTab = () => {
    switch (activeTab) {
      case 'summary': return <SubmissionSummaryTab />;
      case 'fda-info': return <FDAInfoTab />;
      case 'guidance': return <ReviewGuidanceTab />;
      case 'preliminary': return <PreliminaryReviewTab />;
      case 'skill': return <CustomSkillTab />;
      case 'questions': return <FollowUpQuestionsTab />;
      default: return <SubmissionSummaryTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
