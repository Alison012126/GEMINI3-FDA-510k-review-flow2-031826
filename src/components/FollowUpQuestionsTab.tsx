import React, { useState } from 'react';
import { useAppContext } from '../store';
import { generateContent } from '../lib/gemini';
import { MarkdownEditor } from './MarkdownEditor';
import { HelpCircle, Loader2, Zap } from 'lucide-react';

export function FollowUpQuestionsTab() {
  const { state, updateState } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [model, setModel] = useState('gemini-3-flash-preview');

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const fullPrompt = `
        Based on the preliminary review report and the submission summary, generate exactly 20 comprehensive follow-up questions for the FDA reviewer to ask the applicant.
        Format the output as a numbered list in markdown.
        
        Preliminary Review Report:
        ${state.preliminaryReview.substring(0, 10000)}
        
        Submission Summary:
        ${state.submissionSummary.substring(0, 10000)}
      `;

      const result = await generateContent(fullPrompt, model, undefined, state.apiKey);
      updateState({ followUpQuestions: result });
    } catch (error: any) {
      console.error(error);
      alert(`Error generating questions: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isReady = state.preliminaryReview && state.submissionSummary;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <HelpCircle className="text-primary" />
          Follow-up Questions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Generate 20 comprehensive follow-up questions based on the preliminary review.
        </p>

        {!isReady && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> You need to generate the <strong>Preliminary Review</strong> first.
          </div>
        )}

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <div className="text-center p-6">
              <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Click the button below to generate 20 comprehensive follow-up questions for the applicant.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-end mt-auto">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              </select>
            </div>
            <button
              onClick={handleProcess}
              disabled={isProcessing || !isReady}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[38px]"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              {isProcessing ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>
        </div>
      </div>

      <div className="h-full">
        <MarkdownEditor
          title="20 Follow-up Questions"
          content={state.followUpQuestions}
          onChange={(content) => updateState({ followUpQuestions: content })}
        />
      </div>
    </div>
  );
}
