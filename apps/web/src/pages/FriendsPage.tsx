/**
 * @file apps/web/src/pages/FriendsPage.tsx
 * @description Light-theme Friends accountability circle with ConfirmDialog and resilient StudentAvatar
 */
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Check, X, Flame, Clock, UserMinus, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { FriendSummary } from '../../../../packages/shared-types/src/index.ts';
import { StudentAvatar } from '../components/ui/BrandIllustrations.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.tsx';

export const FriendsPage: React.FC = () => {
  const [accepted, setAccepted] = useState<FriendSummary[]>([]);
  const [incoming, setIncoming] = useState<FriendSummary[]>([]);
  const [outgoing, setOutgoing] = useState<FriendSummary[]>([]);
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [friendToRemove, setFriendToRemove] = useState<FriendSummary | null>(null);

  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getFriends();
      setAccepted(data.accepted);
      setIncoming(data.pendingIncoming);
      setOutgoing(data.pendingOutgoing);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Unable to sync friends list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = usernameInput.trim().replace(/^@/, '');
    if (cleaned.length < 3) {
      setFeedback('Enter a valid student username (at least 3 characters).');
      return;
    }
    try {
      setSubmitting(true);
      const res = await apiClient.sendFriendRequest(cleaned);
      setFeedback(res.message);
      setUsernameInput('');
      await loadFriends();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Could not send request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (id: string) => {
    const res = await apiClient.acceptFriendRequest(id);
    setFeedback(res.message);
    await loadFriends();
  };

  const handleReject = async (id: string) => {
    const res = await apiClient.rejectFriendRequest(id);
    setFeedback(res.message);
    await loadFriends();
  };

  const handleConfirmRemove = async () => {
    if (!friendToRemove) return;
    const res = await apiClient.removeFriend(friendToRemove.id);
    setFeedback(res.message);
    setFriendToRemove(null);
    await loadFriends();
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Friends Circle"
        description="Syncing peer study streaks and incoming requests..."
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Study Friends Circle
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Stay accountable with classmates through healthy focus streaks — never screen shaming.
          </p>
        </div>

        <form onSubmit={handleSendRequest} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Invite by @username"
            aria-label="Invite friend by username"
            className="flex-1 sm:w-56 px-3.5 py-2.5 rounded-xl bg-white border border-[#E1EEE9] text-xs font-medium text-[#142647] focus:outline-none focus:border-[#079669]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Sending...' : 'Add Friend'}</span>
          </button>
        </form>
      </div>

      {feedback && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-[#E9F9F2] border border-[#BCEAD7] text-[#067652] text-xs font-semibold flex items-center justify-between gap-2"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#079669]" />
            {feedback}
          </span>
          <button type="button" onClick={() => setFeedback(null)} className="underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Requests */}
      {(incoming.length > 0 || outgoing.length > 0) && (
        <section className="ff-card p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-[#142647]">
            Pending Invitations ({incoming.length + outgoing.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incoming.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-[#F2FAF6] border border-[#CBEFE0] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <StudentAvatar name={req.displayName} avatarUrl={req.avatarUrl} isOnline={req.isOnline} />
                  <div>
                    <div className="text-sm font-bold text-[#142647]">{req.displayName}</div>
                    <div className="text-xs text-[#5A708D]">@{req.username} • Incoming request</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAccept(req.id)}
                    aria-label={`Accept ${req.displayName}`}
                    className="p-2 rounded-xl bg-[#079669] text-white hover:bg-[#057A55] cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(req.id)}
                    aria-label={`Decline ${req.displayName}`}
                    className="p-2 rounded-xl bg-white border border-[#E1EEE9] text-[#5A708D] hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {outgoing.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <StudentAvatar name={req.displayName} avatarUrl={req.avatarUrl} />
                  <div>
                    <div className="text-sm font-bold text-[#142647]">{req.displayName}</div>
                    <div className="text-xs text-[#5A708D]">@{req.username} • Awaiting response</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#EBF3FF] text-[#2563EB]">
                  Sent
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Accepted Friends */}
      {accepted.length === 0 ? (
        <EmptyState
          variant="empty"
          title="No study friends connected yet"
          description="Invite a study partner above using their @username to compare focus streaks."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accepted.map((friend) => (
            <div key={friend.id} className="ff-card p-5 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <StudentAvatar
                    name={friend.displayName}
                    avatarUrl={friend.avatarUrl}
                    size="lg"
                    isOnline={friend.isOnline}
                  />
                  <div>
                    <h3 className="font-display text-base font-bold text-[#142647]">
                      {friend.displayName}
                    </h3>
                    <div className="text-xs text-[#5A708D]">
                      @{friend.username} • Level {friend.level}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFriendToRemove(friend)}
                  aria-label={`Remove ${friend.displayName}`}
                  className="p-1.5 rounded-lg text-[#6C819C] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E1EEE9] text-center">
                <div className="p-2 rounded-xl bg-[#F7FCFA]">
                  <div className="text-xs font-bold text-[#142647] tabular-nums inline-flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {friend.streakDays}d
                  </div>
                  <div className="text-[10px] text-[#6C819C]">Streak</div>
                </div>
                <div className="p-2 rounded-xl bg-[#F7FCFA]">
                  <div className="text-xs font-bold text-[#079669] tabular-nums inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {friend.weeklyFocusHours}h
                  </div>
                  <div className="text-[10px] text-[#6C819C]">Weekly Focus</div>
                </div>
                <div className="p-2 rounded-xl bg-[#F7FCFA]">
                  <div className="text-xs font-bold text-[#142647] tabular-nums">
                    {friend.totalXp.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#6C819C]">Total XP</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(friendToRemove)}
        title="Remove Friend Connection?"
        description={
          friendToRemove
            ? `Are you sure you want to remove ${friendToRemove.displayName} (@${friendToRemove.username}) from your accountability circle?`
            : ''
        }
        confirmLabel="Remove Friend"
        tone="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setFriendToRemove(null)}
      />
    </div>
  );
};
