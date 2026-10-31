/**
 * @file apps/web/src/pages/FriendsPage.tsx
 * @description Friends & Accountability Partners System
 */
import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Flame,
  Clock,
  Sparkles,
  Check,
  X,
  Trash2,
  BellRing,
  Send,
  Search,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import { FriendSummary } from '../../../../packages/shared-types/src/index.ts';

export function FriendsPage() {
  const [friendsData, setFriendsData] = useState<{
    all: FriendSummary[];
    accepted: FriendSummary[];
    pendingIncoming: FriendSummary[];
    pendingOutgoing: FriendSummary[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [addUsername, setAddUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'FRIENDS' | 'REQUESTS'>('FRIENDS');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getFriends();
      setFriendsData(res);
    } catch (err) {
      console.error('Failed to load friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUsername.trim()) return;

    try {
      const res = await apiClient.sendFriendRequest(addUsername.trim());
      if (res.success) {
        setActionMessage({ text: res.message, type: 'success' });
        setAddUsername('');
        await loadFriends();
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Failed to send friend request', type: 'error' });
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const res = await apiClient.acceptFriendRequest(id);
      if (res.success) {
        setActionMessage({ text: res.message, type: 'success' });
        await loadFriends();
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error accepting friend', type: 'error' });
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await apiClient.rejectFriendRequest(id);
      if (res.success) {
        setActionMessage({ text: res.message, type: 'success' });
        await loadFriends();
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error rejecting friend', type: 'error' });
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    try {
      const res = await apiClient.removeFriend(id);
      if (res.success) {
        setActionMessage({ text: res.message, type: 'success' });
        await loadFriends();
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error removing friend', type: 'error' });
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleNudge = (name: string) => {
    setActionMessage({
      text: `Sent focus reminder nudge to ${name}! 🔔`,
      type: 'success',
    });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const acceptedFriends = friendsData?.accepted || [];
  const pendingIncoming = friendsData?.pendingIncoming || [];
  const pendingOutgoing = friendsData?.pendingOutgoing || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2537] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2.5 py-1 rounded-full border border-[#b8ff3c]/20 mb-2">
            <Users className="w-3.5 h-3.5" />
            Phase 6 Social Accountability
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Study Friends & Accountability Circles
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Compare study streaks, share weekly focus milestones, and keep each other motivated.
          </p>
        </div>

        {/* Total Active Friends Counter */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#b8ff3c]/10 border border-[#b8ff3c]/20 flex items-center justify-center text-[#b8ff3c]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Accountability Partners</div>
            <div className="text-2xl font-black font-mono tabular-nums text-white">
              {acceptedFriends.length}
            </div>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-[#b8ff3c]/10 border border-[#b8ff3c]/30 text-[#b8ff3c]'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Add Friend Form */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <UserPlus className="w-4 h-4 text-[#b8ff3c]" />
          Connect with a Study Partner
        </h2>
        <p className="text-xs text-zinc-400 mb-4">
          Enter their FocusFlow username to send an accountability partner invitation.
        </p>

        <form onSubmit={handleSendRequest} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">@</span>
            <input
              type="text"
              value={addUsername}
              onChange={(e) => setAddUsername(e.target.value)}
              placeholder="username (e.g. priya_patel, alex_chen)"
              className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#b8ff3c]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            Send Request
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2c2537] pb-3">
        <button
          onClick={() => setActiveTab('FRIENDS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'FRIENDS'
              ? 'bg-[#b8ff3c] text-[#07060a]'
              : 'bg-[#17131f] text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Friends ({acceptedFriends.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'REQUESTS'
              ? 'bg-[#b8ff3c] text-[#07060a]'
              : 'bg-[#17131f] text-zinc-400 hover:text-white'
          }`}
        >
          <span>Pending Invitations</span>
          {(pendingIncoming.length > 0 || pendingOutgoing.length > 0) && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
              {pendingIncoming.length + pendingOutgoing.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'FRIENDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {acceptedFriends.map((f) => (
            <div
              key={f.id}
              className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={f.avatarUrl}
                      alt={f.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#17131f] ${
                        f.isOnline ? 'bg-emerald-400' : 'bg-zinc-600'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{f.displayName}</h3>
                    <div className="text-xs font-mono text-zinc-400">@{f.username}</div>
                    <div className="text-[11px] font-mono text-[#b8ff3c] mt-0.5">Level {f.level} Scholar</div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(f.id)}
                  title="Remove friend"
                  className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#0c0a10] border border-white/5 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px]">CURRENT STREAK</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    {f.streakDays} Days
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">WEEKLY FOCUS</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#49e6ff]" />
                    {f.weeklyFocusHours}h
                  </span>
                </div>
              </div>

              {/* Action Button: Nudge */}
              <button
                onClick={() => handleNudge(f.displayName)}
                className="w-full py-2 rounded-xl bg-[#0c0a10] hover:bg-white/5 border border-[#2c2537] text-zinc-300 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-[#b8ff3c]" />
                Send Study Nudge
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'REQUESTS' && (
        <div className="space-y-6">
          {/* Incoming */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Incoming Requests</span>
              <span className="text-xs font-mono text-zinc-400">({pendingIncoming.length})</span>
            </h3>

            {pendingIncoming.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#17131f] border border-[#2c2537] text-center text-xs text-zinc-500 font-mono">
                No pending incoming partner requests.
              </div>
            ) : (
              <div className="space-y-2">
                {pendingIncoming.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-xl bg-[#17131f] border border-[#2c2537] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={f.avatarUrl}
                        alt={f.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-bold text-white">{f.displayName}</div>
                        <div className="text-xs font-mono text-zinc-400">@{f.username}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(f.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(f.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#0c0a10] hover:bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Outgoing Requests Sent</span>
              <span className="text-xs font-mono text-zinc-400">({pendingOutgoing.length})</span>
            </h3>

            {pendingOutgoing.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#17131f] border border-[#2c2537] text-center text-xs text-zinc-500 font-mono">
                No pending outgoing requests.
              </div>
            ) : (
              <div className="space-y-2">
                {pendingOutgoing.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-xl bg-[#17131f] border border-[#2c2537] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">@{f.username}</div>
                      <div className="text-xs font-mono text-zinc-500">Waiting for user acceptance...</div>
                    </div>
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
