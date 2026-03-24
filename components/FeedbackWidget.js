'use client';
import { useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const FEEDBACK_CATEGORIES = [
  { id: 'accuracy', label: 'Requirement Accuracy', desc: 'Did the PRD Analyst correctly identify requirements?' },
  { id: 'criteria', label: 'Criteria Quality', desc: 'Were acceptance criteria relevant and useful?' },
  { id: 'tests', label: 'Test Relevance', desc: 'Were generated tests realistic and actionable?' },
  { id: 'verdict', label: 'Verdict Fairness', desc: 'Did the quality score feel accurate?' },
  { id: 'ux', label: 'Overall Experience', desc: 'Was the tool easy to use and understand?' },
];

async function submitToSupabase(feedback) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured, logging feedback locally');
    console.log('Feedback:', feedback);
    return { ok: false, fallback: true };
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      rating_accuracy: feedback.ratings.accuracy || null,
      rating_criteria: feedback.ratings.criteria || null,
      rating_tests: feedback.ratings.tests || null,
      rating_verdict: feedback.ratings.verdict || null,
      rating_ux: feedback.ratings.ux || null,
      gaps: feedback.gaps || null,
      comment: feedback.comment || null,
      prd_length: feedback.prdLength,
      requirements_found: feedback.requirementsFound,
      verdict: feedback.verdict,
      score: feedback.score,
    }),
  });

  return { ok: res.ok, status: res.status };
}

export default function FeedbackWidget({ pipelineResults, prdText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [gaps, setGaps] = useState('');

  const handleRate = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const feedback = {
      ratings,
      comment,
      gaps,
      prdLength: prdText?.length || 0,
      requirementsFound: pipelineResults?.prd_analyst?.requirements?.length || 0,
      verdict: pipelineResults?.quality_oracle?.verdict || 'N/A',
      score: pipelineResults?.quality_oracle?.overall_score || 0,
    };

    try {
      const result = await submitToSupabase(feedback);
      if (result.ok || result.fallback) {
        setSubmitted(true);
      } else {
        setError('Failed to submit — please try again.');
      }
    } catch (e) {
      console.error('Feedback submission error:', e);
      setError('Network error — feedback saved locally.');
      // Fallback to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('evalcopilot_feedback') || '[]');
        existing.push({ ...feedback, timestamp: new Date().toISOString() });
        localStorage.setItem('evalcopilot_feedback', JSON.stringify(existing));
      } catch (le) {}
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full shadow-lg text-sm font-bold text-white transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #0D9488)' }}
      >
        💬 Give Feedback
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <div className="text-lg font-bold text-gray-900 mb-2">Thanks for your feedback!</div>
        <p className="text-sm text-gray-500 mb-4">Your input directly shapes the next version of Eval Copilot PRO.</p>
        <button onClick={() => { setIsOpen(false); setSubmitted(false); setRatings({}); setComment(''); setGaps(''); }}
          className="text-sm text-teal-600 font-semibold hover:underline">Close</button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div>
          <div className="font-bold text-gray-900 text-sm">Pipeline Feedback</div>
          <div className="text-xs text-gray-400">Help us improve Eval Copilot PRO</div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-gray-500 text-xl leading-none">&times;</button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
        {FEEDBACK_CATEGORIES.map(cat => (
          <div key={cat.id}>
            <div className="text-sm font-semibold text-gray-800 mb-1">{cat.label}</div>
            <div className="text-xs text-gray-400 mb-2">{cat.desc}</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => handleRate(cat.id, n)}
                  className="w-10 h-8 rounded-md text-xs font-bold transition-all"
                  style={{
                    background: ratings[cat.id] === n ? '#0D9488' : ratings[cat.id] > n ? '#0D948830' : '#F3F4F6',
                    color: ratings[cat.id] === n ? 'white' : ratings[cat.id] > n ? '#0D9488' : '#9CA3AF',
                    border: ratings[cat.id] === n ? '2px solid #0D9488' : '2px solid transparent',
                  }}
                >{n}</button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <div className="text-sm font-semibold text-gray-800 mb-1">Gaps or Missing Features</div>
          <div className="text-xs text-gray-400 mb-2">What should the agents catch that they missed?</div>
          <textarea
            value={gaps}
            onChange={e => setGaps(e.target.value)}
            placeholder="e.g., Didn't flag security concerns, missed a key requirement..."
            className="w-full h-20 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-800 mb-1">Additional Comments</div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Anything else you'd like us to know..."
            className="w-full h-16 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 rounded-lg text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="px-5 py-4 border-t border-gray-100 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={Object.keys(ratings).length < 3 || submitting}
          className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: Object.keys(ratings).length >= 3 && !submitting ? 'linear-gradient(135deg, #0D9488, #0F766E)' : '#D1D5DB' }}
        >
          {submitting ? '⏳ Submitting...' : `Submit Feedback (${Object.keys(ratings).length}/5 rated)`}
        </button>
      </div>
    </div>
  );
}
