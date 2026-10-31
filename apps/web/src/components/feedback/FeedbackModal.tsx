/**
 * @file apps/web/src/components/feedback/FeedbackModal.tsx
 * @description In-app student feedback submission component & review modal
 */
import React, { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Star,
  Send,
  X,
  CheckCircle2,
  Bug,
  Sparkles,
  Palette,
  Heart,
  MessageCircle,
} from 'lucide-react';
import {
  ProductFeedbackItem,
  FeedbackCategory,
} from '../../../../../packages/shared-types/src/index.ts';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<FeedbackCategory>('FEATURE_REQUEST');
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [feedbackList, setFeedbackList] = useState<ProductFeedbackItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'NEW' | 'COMMUNITY'>('NEW');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/v1/feedback')
        .then(r => r.json())
        .then(res => {
          if (res.success) setFeedbackList(res.data);
        })
        .catch(e => console.error(e));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, rating, title, description }),
      }).then(r => r.json());

      if (res.success) {
        setSubmitSuccess(true);
        setFeedbackList([res.data, ...feedbackList]);
        setTimeout(() => {
          setSubmitSuccess(false);
          setTitle('');
          setDescription('');
          setActiveTab('COMMUNITY');
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#141220] border border-[#2c2537] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#b8ff3c]/10 text-[#b8ff3c] flex items-center justify-center border border-[#b8ff3c]/20">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Product Feedback & Ideas</h3>
            <p className="text-xs text-zinc-400">Help shape the future of FOCUSFLOW. Every student voice matters.</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 p-1 bg-[#0c0a10] border border-[#2c2537] rounded-xl">
          <button
            onClick={() => setActiveTab('NEW')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'NEW' ? 'bg-[#1e192c] text-[#b8ff3c]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab('COMMUNITY')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'COMMUNITY' ? 'bg-[#1e192c] text-[#b8ff3c]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Community Board ({feedbackList.length})
          </button>
        </div>

        {activeTab === 'NEW' ? (
          submitSuccess ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#b8ff3c] mx-auto" />
              <h4 className="font-bold text-white text-lg">Thank You!</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Your thoughts have been logged for our product engineering team.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category picker */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-2">CATEGORY</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'FEATURE_REQUEST', label: 'Feature', icon: Sparkles },
                    { id: 'BUG', label: 'Bug Report', icon: Bug },
                    { id: 'UI_UX', label: 'UI / UX', icon: Palette },
                    { id: 'PRAISE', label: 'Praise', icon: Heart },
                  ].map(cat => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#1e192c] border-[#b8ff3c] text-white'
                            : 'bg-[#0c0a10] border-[#2c2537] text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#b8ff3c]' : 'text-zinc-500'}`} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-2">EXPERIENCE RATING</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-zinc-600 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">SUMMARY / TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Add dark OLED mode for night sessions"
                  className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#b8ff3c]"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">DETAILS</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain what would make your focus workflow better..."
                  className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#b8ff3c]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !title || !description}
                className="w-full py-3 bg-[#b8ff3c] hover:bg-[#a8eb34] text-[#07060a] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Send Product Feedback'}</span>
              </button>
            </form>
          )
        ) : (
          <div className="space-y-3">
            {feedbackList.map(item => (
              <div key={item.id} className="bg-[#0c0a10] border border-[#2c2537] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1e192c] text-[#b8ff3c] border border-[#342b4a]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>

                {item.adminResponse && (
                  <div className="bg-[#181524] border border-[#2c2537] rounded-xl p-3 text-xs text-zinc-300 mt-2 flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 text-[#49e6ff] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">FocusFlow Team Response:</span>
                      {item.adminResponse}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
