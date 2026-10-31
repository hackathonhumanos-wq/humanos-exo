import React, { useState } from 'react';
import { Friend, BRAIN_STAGES } from '../types/brainrot';
import { getStageForCount, formatDuration, INITIAL_FRIENDS } from '../utils/brainrotHelpers';
import { Users, UserPlus, Copy, Check, Sparkles, Flame, ExternalLink, X } from 'lucide-react';

interface SocialLeaderboardProps {
  myCount: number;
  myScrollingMs: number;
}

export const SocialLeaderboard: React.FC<SocialLeaderboardProps> = ({
  myCount,
  myScrollingMs,
}) => {
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [copied, setCopied] = useState(false);
  const [myUsername, setMyUsername] = useState('ayush_rot');
  const [myDisplayName, setMyDisplayName] = useState('Ayush');
  const [inviteCode] = useState('BRAIN-ROT-9X2');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const myStage = getStageForCount(myCount);

  // Build complete leaderboard including user
  const allUsers = [
    {
      id: 'me',
      username: myUsername,
      displayName: `${myDisplayName} (You)`,
      count: myCount,
      scrollingMs: myScrollingMs,
      lastActiveMs: Date.now(),
      stage: myStage.stage,
      streakDays: 5,
      isMe: true,
    },
    ...friends.map(f => ({ ...f, isMe: false })),
  ].sort((a, b) => b.count - a.count);

  const inviteLink = `https://brain-rot-drab.vercel.app/?invite=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newFriend: Friend = {
      id: `f-${Date.now()}`,
      username: newCode.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'new_scroller',
      displayName: 'Invited Friend',
      count: Math.floor(Math.random() * 150) + 20,
      scrollingMs: (Math.floor(Math.random() * 45) + 10) * 60 * 1000,
      lastActiveMs: Date.now() - 40 * 1000,
      stage: 3,
      streakDays: 1,
    };
    setFriends(prev => [newFriend, ...prev]);
    setNewCode('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2c2537]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#b8ff3c] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Social Rot Sync
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Friends Leaderboard</h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Compare reel counts and watch each other's brains rot in real time.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2 bg-[#f4533f] hover:bg-[#ff6957] active:scale-95 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-[#f4533f]/20 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      </div>

      {/* Invite Code Share Banner */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Your Invite Link</span>
          <span className="text-sm font-mono text-[#b8ff3c] font-semibold truncate block max-w-xs sm:max-w-md">
            {inviteLink}
          </span>
        </div>
        <button
          onClick={handleCopyLink}
          className="px-3.5 py-2 bg-[#242423] hover:bg-[#2d2d2c] border border-white/10 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Link' : 'Copy Invite'}</span>
        </button>
      </div>

      {/* Leaderboard Ranking Table */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#120f18] border-b border-[#2c2537] flex items-center justify-between text-xs font-mono text-zinc-400 uppercase tracking-wider">
          <span>Rank & Friend</span>
          <span className="pr-2">Today's Rot</span>
        </div>

        <div className="divide-y divide-[#2c2537]">
          {allUsers.map((user, idx) => {
            const isLive = Date.now() - user.lastActiveMs < 2 * 60 * 1000;
            const stage = BRAIN_STAGES[user.stage];

            return (
              <div
                key={user.id}
                onClick={() => !user.isMe && setSelectedFriend(user as Friend)}
                className={`p-4 flex items-center justify-between transition-colors ${
                  user.isMe ? 'bg-[#241a31]/50 border-l-4 border-l-[#f4533f]' : 'hover:bg-[#1f1a29] cursor-pointer'
                }`}
              >
                {/* Left: Rank, Avatar, Name */}
                <div className="flex items-center gap-3.5">
                  <span
                    className={`font-mono font-bold text-sm w-5 text-center ${
                      idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-zinc-500'
                    }`}
                  >
                    #{idx + 1}
                  </span>

                  {/* Brain Stage Sprite */}
                  <div className="relative w-12 h-10 flex items-center justify-center shrink-0">
                    <img
                      src={stage.sprite}
                      alt={stage.name}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                    {isLive && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#17131f] animate-pulse"
                        title="Live right now (numbers moved in last 2m)"
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{user.displayName}</span>
                      {user.isMe && (
                        <span className="text-[10px] font-mono bg-[#f4533f]/20 text-[#f4533f] px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                      {isLive && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>@{user.username}</span>
                      <span>•</span>
                      <span className="text-zinc-500">{formatDuration(user.scrollingMs)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Count and Stage Name */}
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="font-mono-numbers text-xl font-extrabold text-white">{user.count}</span>
                    <span className="text-xs text-zinc-400 font-normal">reels</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      user.stage >= 5 ? 'text-red-400' : user.stage >= 4 ? 'text-[#b8ff3c]' : 'text-zinc-400'
                    }`}
                  >
                    {stage.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Friend Detail Inspection Modal */}
      {selectedFriend && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 max-w-sm w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedFriend(null)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <img
                src={BRAIN_STAGES[selectedFriend.stage].sprite}
                alt=""
                className="w-20 h-16 mx-auto object-contain drop-shadow-md mb-2"
              />
              <h3 className="text-lg font-bold text-white">{selectedFriend.displayName}</h3>
              <p className="text-xs text-zinc-400">@{selectedFriend.username}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#120f18] p-3 rounded-xl border border-white/5">
                <span className="text-zinc-400 block">Watched Today</span>
                <span className="text-lg font-mono-numbers font-bold text-white mt-1 block">
                  {selectedFriend.count} reels
                </span>
              </div>
              <div className="bg-[#120f18] p-3 rounded-xl border border-white/5">
                <span className="text-zinc-400 block">Scrolling Time</span>
                <span className="text-lg font-mono-numbers font-bold text-white mt-1 block">
                  {formatDuration(selectedFriend.scrollingMs)}
                </span>
              </div>
            </div>

            <div className="bg-[#120f18] p-3 rounded-xl border border-white/5 text-xs">
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Rot Stage:</span>
                <strong className="text-white">{BRAIN_STAGES[selectedFriend.stage].name}</strong>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Streak:</span>
                <strong className="text-[#b8ff3c] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {selectedFriend.streakDays} days
                </strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedFriend(null)}
              className="w-full py-2.5 bg-[#242423] hover:bg-[#2d2d2c] text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Friend Code Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 max-w-sm w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">Add a Friend</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter an invite code or username to sync daily reel counts.
              </p>
            </div>

            <form onSubmit={handleRedeemCode} className="space-y-3">
              <input
                type="text"
                placeholder="e.g. BRAIN-ROT-9X2 or username"
                value={newCode}
                onChange={e => setNewCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120f18] border border-[#2c2537] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#b8ff3c]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-[#242423] text-zinc-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#f4533f] text-white rounded-xl text-xs font-semibold"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
