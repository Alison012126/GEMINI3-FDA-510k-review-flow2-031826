import React, { useState } from 'react';
import { useAppContext } from '../store';
import { Settings, FileText, Search, ClipboardCheck, FileSearch, Zap, HelpCircle, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const TABS = [
  { id: 'summary', label: '510(k) Summary', icon: FileText },
  { id: 'fda-info', label: 'FDA Info Search', icon: Search },
  { id: 'guidance', label: 'Review Guidance', icon: ClipboardCheck },
  { id: 'preliminary', label: 'Preliminary Review', icon: FileSearch },
  { id: 'skill', label: 'Custom Skill', icon: Zap },
  { id: 'questions', label: 'Follow-up Questions', icon: HelpCircle },
];

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  const { state, updateState } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={twMerge(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2 text-primary">
            <Settings className="text-primary" />
            Agentic Reviewer
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={twMerge(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Theme</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
              value={state.theme}
              onChange={(e) => updateState({ theme: e.target.value as any })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Language</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
              value={state.language}
              onChange={(e) => updateState({ language: e.target.value as any })}
            >
              <option value="en">English</option>
              <option value="zh">繁體中文</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Pantone Style</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
              value={state.pantoneStyle}
              onChange={(e) => updateState({ pantoneStyle: e.target.value as any })}
            >
              <option value="classic-blue">Classic Blue</option>
              <option value="living-coral">Living Coral</option>
              <option value="ultra-violet">Ultra Violet</option>
              <option value="greenery">Greenery</option>
              <option value="rose-quartz">Rose Quartz</option>
              <option value="serenity">Serenity</option>
              <option value="marsala">Marsala</option>
              <option value="radiant-orchid">Radiant Orchid</option>
              <option value="emerald">Emerald</option>
              <option value="tangerine-tango">Tangerine Tango</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Gemini API Key</label>
            <input 
              type="password"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
              placeholder="Optional if in env"
              value={state.apiKey}
              onChange={(e) => updateState({ apiKey: e.target.value })}
            />
          </div>
        </div>
      </div>
    </>
  );
}
