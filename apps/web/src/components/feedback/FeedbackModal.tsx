/**
 * @file apps/web/src/components/feedback/FeedbackModal.tsx
 * @description Light-theme student product feedback submission and community board modal
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
import type {
  ProductFeedbackItem,
  FeedbackCategory,
} from '../../../../../packages/shared-types/src/index.ts';
import { apiClient } from '../../services/apiClient.ts';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'NEW' | 'COMMUNITY'>('NEW');

  useEffect(() => {
    if (isOpen) {
      apiClient
        .getFeedback()
        .then((items) => setFeedbackList(items))
        .catch(() => setFeedbackList([]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (title.trim().length < 3 || description.trim().length < 8) {
      setErrorMsg('Please enter a short summary and at least 8 characters of detail.');
      return;
    }
    try {
      setIsSubmitting(true);
      const created = await apiClient.submitFeedback({
        category,
        rating,
        title: title.trim(),
        description: description.trim(),
      });
      setSubmitSuccess(true);
      setFeedbackList((prev) => [created, ...prev]);
      window.setTimeout(() => {
        setSubmitSuccess(false);
        setTitle('');
        setDescription('');
        setActiveTab('COMMUNITY');
      }, 1100);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to submit feedback right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { id: FeedbackCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'FEATURE_REQUEST', label: 'Feature', icon: Sparkles },
    { id: 'BUG', label: 'Bug Report', icon: Bug },
    { id: 'UI_UX', label: 'UI / UX', icon: Palette },
    { id: 'PRAISE', label: 'Praise', icon: Heart },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142647]/35 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div className="bg-white border border-[#E1EEE9] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close feedback modal"
          className="absolute right-5 top-5 p-1.5 rounded-xl text-[#6C819C] hover:text-[#142647] hover:bg-[#F7FCFA] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center border border-[#CBEFE0]">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 id="feedback-modal-title" className="font-display text-xl font-bold text-[#142647]">
              Student Feedback & Ideas
            </h3>
            <p className="text-xs text-[#5A708D]">
              Help improve FOCUSFLOW for fellow students.
            </p>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-[#F2F9F6] border border-[#E1EEE9] rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('NEW')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer ${
              activeTab === 'NEW'
                ? 'bg-white text-[#079669] shadow-2xs'
                : 'text-[#5A708D] hover:text-[#142647]'
            }`}
          >
            Submit Feedback
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('COMMUNITY')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer ${
              activeTab === 'COMMUNITY'
                ? 'bg-white text-[#079669] shadow-2xs'
                : 'text-[#5A708D] hover:text-[#142647]'
            }`}
          >
            Community Board ({feedbackList.length})
          </button>
        </div>

        {activeTab === 'NEW' ? (
          submitSuccess ? (
            <div className="text-center py-10 space-y-2.5">
              <CheckCircle2 className="w-12 h-12 text-[#079669] mx-auto" />
              <h4 className="font-display font-bold text-[#142647] text-lg">Thank you for sharing!</h4>
              <p className="text-xs text-[#5A708D] max-w-xs mx-auto">
                Your note has been added to our student feedback board.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                  {errorMsg}
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-[#334B68] block mb-2">Category</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-semibold cursor-pointer ${
                          isSelected
                            ? 'bg-[#E9F9F2] border-[#079669] text-[#079669]'
                            : 'bg-[#F7FCFA] border-[#E1EEE9] text-[#4A607A] hover:text-[#142647]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#334B68] block mb-1.5">Experience Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5 stars`}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="feedback-title" className="text-xs font-bold text-[#334B68] block mb-1">
                  Summary
                </label>
                <input
                  id="feedback-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Add exam countdown widget to Study Planner"
                  className="w-full bg-[#F7FCFA] border border-[#E1EEE9] rounded-xl px-3.5 py-2.5 text-sm text-[#142647] placeholder-[#8CA0B8] focus:outline-none focus:bg-white focus:border-[#079669]"
                  required
                />
              </div>

              <div>
                <label htmlFor="feedback-desc" className="text-xs font-bold text-[#334B68] block mb-1">
                  Details
                </label>
                <textarea
                  id="feedback-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share how this would help your study routine..."
                  className="w-full bg-[#F7FCFA] border border-[#E1EEE9] rounded-xl px-3.5 py-2.5 text-sm text-[#142647] placeholder-[#8CA0B8] focus:outline-none focus:bg-white focus:border-[#079669]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#079669] hover:bg-[#057A55] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Send Feedback'}</span>
              </button>
            </form>
          )
        ) : (
          <div className="space-y-3">
            {feedbackList.map((item) => (
              <div key={item.id} className="bg-[#F7FCFA] border border-[#E1EEE9] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#142647]">{item.title}</h4>
                <p className="text-xs text-[#4A607A] leading-relaxed">{item.description}</p>
                {item.adminResponse && (
                  <div className="bg-white border border-[#E1EEE9] rounded-xl p-3 text-xs text-[#334B68] mt-2 flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 text-[#079669] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#142647] block mb-0.5">FOCUSFLOW Team:</span>
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
