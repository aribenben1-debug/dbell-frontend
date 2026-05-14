import { useState } from 'react';
import UrgencyModal from './UrgencyModal.jsx';

export default function Survey({ questions, onComplete, onUrgency }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animating, setAnimating] = useState(false);
  const [urgencyModal, setUrgencyModal] = useState(null); // { level, value }

  const q = questions[current];
  const total = questions.length;
  const progress = Math.round((current / total) * 100);

  function selectAnswer(value, option) {
    // Check if this option triggers urgency warning
    if (option?.urgency) {
      setUrgencyModal({ level: option.urgency, value });
      return;
    }
    commitAnswer(value);
  }

  function commitAnswer(value) {
    const updated = { ...answers, [q.id]: value };
    setAnswers(updated);
    if (!q.optional) advance(updated);
  }

  function handleUrgencyConfirm() {
    const value = urgencyModal.value;
    onUrgency?.(urgencyModal.level); // tell parent about surcharge
    setUrgencyModal(null);
    commitAnswer(value);
  }

  function handleUrgencyCancel() {
    setUrgencyModal(null);
  }

  function toggleMulti(value) {
    const prev = answers[q.id] || [];
    const next = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];
    setAnswers({ ...answers, [q.id]: next });
  }

  function advance(ans = answers) {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      if (current < total - 1) {
        setCurrent((c) => c + 1);
      } else {
        onComplete(ans);
      }
      setAnimating(false);
    }, 200);
  }

  function goBack() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  const isAnswered = q.multi
    ? (answers[q.id]?.length > 0)
    : !!answers[q.id];

  return (
    <div className="min-h-[60vh] flex flex-col">
      {/* Progress bar */}
      <div className="mb-6 sm:mb-10">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Question {current + 1} of {total}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div
        className={`flex-1 transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      >
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1.5 leading-snug">
          {q.question}
        </h2>
        {q.hint && (
          <p className="text-gray-500 text-sm mb-5">{q.hint}</p>
        )}
        {!q.hint && <div className="mb-5" />}

        {/* Card options */}
        {(q.type === 'cards') && (
          <div className={`grid gap-3 ${q.options.length > 4 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`} style={{WebkitTapHighlightColor:'transparent'}}>
            {q.options.map((opt) => {
              const selected = q.multi
                ? (answers[q.id] || []).includes(opt.value)
                : answers[q.id] === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => q.multi ? toggleMulti(opt.value) : selectAnswer(opt.value, opt)}
                  className={`flex items-center gap-2.5 sm:gap-4 p-2.5 sm:p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-150 active:scale-95 touch-manipulation ${
                    selected
                      ? 'border-brand-500 bg-brand-50 text-brand-800 shadow-md'
                      : opt.urgency === 'emergency'
                      ? 'border-red-200 bg-red-50 text-red-700 hover:border-red-400 hover:shadow-md'
                      : opt.urgency === 'urgent'
                      ? 'border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-400 hover:shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl sm:text-2xl shrink-0">{opt.icon}</span>
                  <div className="flex-1 leading-tight">
                    <span>{opt.label}</span>
                    {opt.urgency === 'emergency' && (
                      <span className="ml-2 text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">+50% fee</span>
                    )}
                    {opt.urgency === 'urgent' && (
                      <span className="ml-2 text-xs font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">+25% fee</span>
                    )}
                  </div>
                  {selected && (
                    <span className="ml-auto text-brand-600 shrink-0">✓</span>
                  )}
                </button>
              );
            })}

            {/* Urgency modal */}
            {urgencyModal && (
              <UrgencyModal
                level={urgencyModal.level}
                onConfirm={handleUrgencyConfirm}
                onCancel={handleUrgencyCancel}
              />
            )}
          </div>
        )}

        {/* Textarea */}
        {q.type === 'textarea' && (
          <div>
            <textarea
              className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-brand-500 transition resize-none bg-white"
              rows={5}
              placeholder="Type your answer here…"
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              autoFocus
            />
            <div className="flex items-center justify-between mt-4">
              {q.optional && (
                <button
                  onClick={() => advance()}
                  className="text-gray-400 hover:text-gray-600 text-sm underline"
                >
                  Skip this question
                </button>
              )}
              <button
                onClick={() => advance()}
                disabled={!q.optional && !answers[q.id]?.trim()}
                className="btn-primary ml-auto"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Multi-select continue button */}
        {q.multi && (
          <button
            onClick={() => advance()}
            disabled={!isAnswered}
            className="btn-primary mt-6"
          >
            Continue →
          </button>
        )}
      </div>

      {/* Back button */}
      {current > 0 && (
        <button
          onClick={goBack}
          className="mt-8 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
