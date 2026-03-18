import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Download, Edit2, Eye } from 'lucide-react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
}

export function MarkdownEditor({ content, onChange, title }: MarkdownEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDownload = (format: 'txt' | 'md') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title={isEditing ? "Preview" : "Edit"}
          >
            {isEditing ? <Eye size={18} /> : <Edit2 size={18} />}
          </button>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <button
            onClick={() => handleDownload('md')}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
            title="Download Markdown"
          >
            <Download size={16} /> MD
          </button>
          <button
            onClick={() => handleDownload('txt')}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
            title="Download Text"
          >
            <Download size={16} /> TXT
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Markdown content..."
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            {content ? (
              <Markdown>{content}</Markdown>
            ) : (
              <div className="text-gray-400 italic text-center py-12">No content generated yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
