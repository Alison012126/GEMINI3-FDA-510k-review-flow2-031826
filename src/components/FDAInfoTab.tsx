import React, { useState } from 'react';
import { useAppContext } from '../store';
import { generateContentWithSearch } from '../lib/gemini';
import { MarkdownEditor } from './MarkdownEditor';
import { Search, Loader2, Zap } from 'lucide-react';

export function FDAInfoTab() {
  const { state, updateState } = useAppContext();
  const [prompt, setPrompt] = useState('Search and summarize FDA related information about the medical device described in the submission summary. Provide the output in markdown format, around 3000-4000 words.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [model, setModel] = useState('gemini-3-flash-preview');

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const fullPrompt = `
        ${prompt}
        
        Context (Submission Summary):
        ${state.submissionSummary.substring(0, 5000)}...
      `;

      const result = await generateContentWithSearch(fullPrompt, model, undefined, state.apiKey);
      updateState({ fdaInfo: result });
    } catch (error: any) {
      console.error(error);
      alert(`Error searching FDA info: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Search className="text-primary" />
          FDA Info Search
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Search and summarize FDA related information about the medical device.
        </p>

        <div className="flex flex-col gap-4 flex-1">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />

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
              disabled={isProcessing || !state.submissionSummary}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[38px]"
              title={!state.submissionSummary ? "Please generate a submission summary first" : ""}
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              {isProcessing ? 'Searching...' : 'Search & Summarize'}
            </button>
          </div>
        </div>
      </div>

      <div className="h-full">
        <MarkdownEditor
          title="FDA Information Summary"
          content={state.fdaInfo}
          onChange={(content) => updateState({ fdaInfo: content })}
        />
      </div>
    </div>
  );
}
