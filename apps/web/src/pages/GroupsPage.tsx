/**
 * @file apps/web/src/pages/GroupsPage.tsx
 * @description Light-theme Collaborative Study Groups page with ConfirmDialog and StudentAvatar
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, KeyRound, Flame, LogOut, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { StudyGroupItem } from '../../../../packages/shared-types/src/index.ts';
import { StudentAvatar } from '../components/ui/BrandIllustrations.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.tsx';

export const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<StudyGroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [groupToLeave, setGroupToLeave] = useState<StudyGroupItem | null>(null);

  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStudyGroups();
      setGroups(data.groups);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Unable to load study groups.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    try {
      const res = await apiClient.joinStudyGroup(inviteCode.trim());
      setFeedback(res.message);
      setInviteCode('');
      await loadGroups();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Invalid invite code.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) return;
    const res = await apiClient.createStudyGroup({
      name: newName.trim(),
      description: newDesc.trim(),
      isPrivate: false,
    });
    setFeedback(res.message);
    setNewName('');
    setNewDesc('');
    setShowCreate(false);
    await loadGroups();
  };

  const handleConfirmLeave = async () => {
    if (!groupToLeave) return;
    const res = await apiClient.leaveStudyGroup(groupToLeave.id);
    setFeedback(res.message);
    setGroupToLeave(null);
    await loadGroups();
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Study Groups
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Team up with classmates for exam prep sprints and shared focus streaks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Invite code (e.g. CS-2026)"
              aria-label="Study group invite code"
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E1EEE9] text-xs font-semibold text-[#142647]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#E9F9F2] border border-[#E1EEE9] text-xs font-bold text-[#079669] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Join</span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowCreate((s) => !s)}
            className="px-4 py-2 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#E9F9F2] border border-[#BCEAD7] text-[#067652] text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#079669]" />
            {feedback}
          </span>
          <button type="button" onClick={() => setFeedback(null)} className="underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="ff-card p-6 space-y-3">
          <h2 className="font-display text-base font-bold text-[#142647]">Create New Study Group</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Group name (e.g., JEE Physics Sprint)"
              className="px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs text-[#142647]"
              required
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Short study focus description"
              className="px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs text-[#142647]"
              required
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#079669] text-white text-xs font-bold cursor-pointer"
          >
            Launch Study Group
          </button>
        </form>
      )}

      {loading ? (
        <EmptyState
          variant="loading"
          title="Loading Study Groups"
          description="Fetching active student study rooms..."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((g) => (
            <div key={g.id} className="ff-card p-6 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#142647]">{g.name}</h2>
                      <div className="text-xs text-[#5A708D] tabular-nums">
                        Code: <strong className="text-[#079669]">{g.inviteCode}</strong> • {g.memberCount} members
                      </div>
                    </div>
                  </div>

                  {g.userRole && (
                    <button
                      type="button"
                      onClick={() => setGroupToLeave(g)}
                      aria-label={`Leave ${g.name}`}
                      className="p-1.5 rounded-lg text-[#6C819C] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#4A607A] leading-relaxed">{g.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#E1EEE9]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#334B68] tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <Flame className="w-3.5 h-3.5" /> {g.groupStreak}d Group Streak
                  </span>
                  <span className="text-[#079669]">
                    {Math.round(g.totalWeeklyFocusMinutes / 60)}h weekly focus
                  </span>
                </div>

                {g.members && g.members.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {g.members.slice(0, 5).map((m) => (
                      <StudentAvatar
                        key={m.userId}
                        name={m.displayName}
                        avatarUrl={m.avatarUrl}
                        size="sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(groupToLeave)}
        title="Leave Study Group?"
        description={groupToLeave ? `Are you sure you want to leave "${groupToLeave.name}"?` : ''}
        confirmLabel="Leave Group"
        tone="danger"
        onConfirm={handleConfirmLeave}
        onCancel={() => setGroupToLeave(null)}
      />
    </div>
  );
};
