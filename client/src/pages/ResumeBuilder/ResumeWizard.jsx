import { useState } from 'react';
import { WIZARD_STEPS } from './resumeDefaults';
import { ResumeForm, ResumeTips } from './ResumeForm';

export function ResumeWizard({ resume, onChange, stepIndex, setStepIndex }) {
  const total = WIZARD_STEPS.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex gap-1 min-w-0">
          {WIZARD_STEPS.map((step, i) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setStepIndex(i)}
              className={`shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                i === stepIndex
                  ? 'bg-primary text-white dark:bg-mint dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary dark:bg-mint transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / total) * 100}%` }}
        />
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {WIZARD_STEPS[stepIndex].label}
        </h2>
        <ResumeForm
          stepIndex={stepIndex}
          resume={resume}
          onChange={onChange}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
          disabled={stepIndex === 0}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setStepIndex(Math.min(total - 1, stepIndex + 1))}
          disabled={stepIndex === total - 1}
          className="px-4 py-2 rounded-lg bg-primary text-white dark:bg-mint dark:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover"
        >
          Next
        </button>
      </div>
      <ResumeTips />
    </div>
  );
}
