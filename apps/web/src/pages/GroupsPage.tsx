/**
 * @file apps/web/src/pages/GroupsPage.tsx
 * @description Study Groups Hub: Group Sprints, Member Rosters, and Collaborative Focus
 */
import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  PlusCircle,
  Flame,
  Shield,
  Clock,
  Sparkles,
  Lock,
  Globe,
  Crown,
  ChevronRight,
  LogOut,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import { StudyGroupItem } from '../../../../packages/shared-types/src/index.ts';

export function GroupsPage() {
  const [groups, setGroups] = useState<StudyGroupItem[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroupItem | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createForm, setCreateForm] = useState({ name: '', description: '', isPrivate: false });
  const [copiedCode, setCopiedCode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getStudyGroups();
      setGroups(res.groups);
      setMyGroups(res.myGroups);
      if (res.groups.length > 0 && !selectedGroup) {
        setSelectedGroup(res.groups[0]);
      }
    } catch (err) {
      console.error('Failed to load study groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;

    try {
      const res = await apiClient.createStudyGroup(createForm);
      if (res.success) {
        setToast(res.message);
        setShowCreateModal(false);
        setCreateForm({ name: '', description: '', isPrivate: false });
        await loadGroups();
        if (res.group) setSelectedGroup(res.group);
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err: any) {
      setToast(err.message || 'Error creating group');
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      const res = await apiClient.joinStudyGroup(joinCode.trim());
      if (res.success) {
        setToast(res.message);
        setShowJoinModal(false);
        setJoinCode('');
        await loadGroups();
        if (res.group) setSelectedGroup(res.group);
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err: any) {
      setToast(err.message || 'Error joining study group');
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleLeave = async (groupId: string) => {
    if (!confirm('Are you sure you want to leave this study group?')) return;
    try {
      const res = await apiClient.leaveStudyGroup(groupId);
      if (res.success) {
        setToast(res.message);
        await loadGroups();
        setSelectedGroup(null);
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err: any) {
      setToast(err.message || 'Error leaving group');
      setTimeout(() => setToast(null), 4000);
    }
  };

  const copyInvite = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2537] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#49e6ff] bg-[#49e6ff]/10 px-2.5 py-1 rounded-full border border-[#49e6ff]/20 mb-2">
            <Users className="w-3.5 h-3.5" />
            Phase 6 Study Circles
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Peer Study Groups & Sprint Hub
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Form collaborative focus rooms, compete on weekly group leaderboards, and safeguard study streaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#17131f] hover:bg-[#231a31] border border-[#2c2537] text-zinc-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#49e6ff]" />
            Join with Code
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#b8ff3c]/20"
          >
            <PlusCircle className="w-4 h-4" />
            Create Circle
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-[#b8ff3c]/10 border border-[#b8ff3c]/30 text-[#b8ff3c] text-xs font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Grid: Groups Directory & Selected Group Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Study Groups List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>Active Study Circles</span>
            <span className="text-xs font-mono text-zinc-400">{groups.length} Available</span>
          </h2>

          <div className="space-y-3">
            {groups.map((grp) => {
              const isSelected = selectedGroup?.id === grp.id;
              const isMember = Boolean(grp.userRole);

              return (
                <div
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#1e172a] border-[#49e6ff] ring-1 ring-[#49e6ff]/30 shadow-xl'
                      : 'bg-[#17131f] border-[#2c2537] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{grp.name}</h3>
                        {grp.isPrivate ? (
                          <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Private
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Public
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {grp.description}
                      </p>
                    </div>

                    {isMember && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#b8ff3c] text-[#07060a] shrink-0">
                        {grp.userRole}
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-4 text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        {grp.memberCount} Members
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {grp.groupStreak} Day Streak
                      </span>
                      <span className="flex items-center gap-1.5 text-[#49e6ff]">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.round(grp.totalWeeklyFocusMinutes / 60)}h This Week
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-500">
                      Code: <code className="text-white font-bold">{grp.inviteCode}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Group Roster Drawer */}
        <div className="space-y-4">
          {selectedGroup ? (
            <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-6 shadow-xl sticky top-20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedGroup.name}</h3>
                  <div className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-2">
                    <span>Invite Code:</span>
                    <button
                      onClick={() => copyInvite(selectedGroup.inviteCode)}
                      className="px-2 py-0.5 rounded-md bg-[#0c0a10] border border-white/10 text-[#49e6ff] hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{selectedGroup.inviteCode}</span>
                    </button>
                  </div>
                </div>

                {selectedGroup.userRole && (
                  <button
                    onClick={() => handleLeave(selectedGroup.id)}
                    title="Leave group"
                    className="p-2 text-zinc-500 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Weekly Performance Stats */}
              <div className="p-4 rounded-2xl bg-[#0c0a10] border border-white/5 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Collective Focus</span>
                  <span className="text-white font-bold">
                    {Math.round(selectedGroup.totalWeeklyFocusMinutes / 60)} Hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Group Habit Streak</span>
                  <span className="text-amber-400 font-bold">{selectedGroup.groupStreak} Consecutive Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Active Students</span>
                  <span className="text-[#b8ff3c] font-bold">{selectedGroup.memberCount} Scholars</span>
                </div>
              </div>

              {/* Members Roster */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Member Roster
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {(selectedGroup.members || []).map((m) => (
                    <div
                      key={m.userId}
                      className="p-3 rounded-xl bg-[#0c0a10] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                          alt={m.displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{m.displayName}</span>
                            {m.role === 'OWNER' && <Crown className="w-3 h-3 text-amber-400" />}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">@{m.username}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-[#b8ff3c] font-bold">{Math.round(m.weeklyFocusMinutes / 60)}h</div>
                        <div className="text-[9px] text-zinc-500 uppercase">{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#17131f] border border-[#2c2537] text-center text-xs text-zinc-500 font-mono">
              Select a study circle to inspect members and collective stats.
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create Study Circle</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono">Group Name</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Distributed Systems Lab"
                  className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#b8ff3c]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono">Mission / Focus Objective</label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="What are your collective study goals?"
                  className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#b8ff3c]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={createForm.isPrivate}
                  onChange={(e) => setCreateForm({ ...createForm, isPrivate: e.target.checked })}
                  className="rounded border-[#2c2537] bg-[#0c0a10] text-[#b8ff3c] focus:ring-0"
                />
                <label htmlFor="isPrivate" className="text-zinc-300">
                  Private Circle (invite code required)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a] font-bold cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Join with Invite Code</h3>
              <button onClick={() => setShowJoinModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinByCode} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono">6-8 Character Group Code</label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GATE2027, MONK99"
                  className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3 py-2 text-white font-mono uppercase tracking-wider placeholder-zinc-500 focus:outline-none focus:border-[#49e6ff]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#49e6ff] hover:bg-[#3cd0e6] text-[#07060a] font-bold cursor-pointer"
                >
                  Join Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
