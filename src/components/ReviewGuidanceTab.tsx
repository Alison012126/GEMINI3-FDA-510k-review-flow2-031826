import React, { useState, useRef } from 'react';
import { useAppContext } from '../store';
import { extractTextFromPdf } from '../lib/pdf';
import { generateContent } from '../lib/gemini';
import { MarkdownEditor } from './MarkdownEditor';
import { Upload, ClipboardCheck, Loader2, Zap } from 'lucide-react';

export function ReviewGuidanceTab() {
  const { state, updateState } = useAppContext();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [model, setModel] = useState('gemini-3-flash-preview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      const text = await file.text();
      setInputText(text);
      setPdfFile(null);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      let textToProcess = inputText;
      
      if (pdfFile) {
        textToProcess = await extractTextFromPdf(pdfFile);
      }

      if (!textToProcess.trim()) {
        alert('Please provide some text or upload a file.');
        setIsProcessing(false);
        return;
      }

      const prompt = `
        You are an expert FDA regulatory reviewer. Analyze the following 510(k) review instructions.
        Create an organized review guidance including a review checklist and exactly 5 tables for an FDA officer to conduct a 510(k) review for the device.
        The final output should be comprehensive, around 3000-4000 words in markdown format.
        
        Review Instructions:
        ${textToProcess}
      `;

      const result = await generateContent(prompt, model, undefined, state.apiKey);
      updateState({ reviewGuidance: result });
    } catch (error: any) {
      console.error(error);
      alert(`Error creating review guidance: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <ClipboardCheck className="text-primary" />
          Review Guidance
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload or paste 510(k) review instructions to create an organized review guidance.
        </p>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-medium text-sm"
            >
              <Upload size={18} />
              Upload Instructions
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.md,.pdf"
            />
            {pdfFile && (
              <span className="text-sm text-primary font-medium truncate">
                {pdfFile.name}
              </span>
            )}
          </div>

          {!pdfFile && (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste review instructions here..."
              className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          )}

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
              disabled={isProcessing || (!inputText.trim() && !pdfFile)}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[38px]"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              {isProcessing ? 'Processing...' : 'Create Guidance'}
            </button>
          </div>
        </div>
      </div>

      <div className="h-full">
        <MarkdownEditor
          title="Review Guidance Document"
          content={state.reviewGuidance}
          onChange={(content) => updateState({ reviewGuidance: content })}
        />
      </div>
    </div>
  );
}
