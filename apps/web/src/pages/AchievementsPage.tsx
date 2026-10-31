/**
 * @file apps/web/src/pages/AchievementsPage.tsx
 * @description 16 Academic & Focus Badges Gallery with Category & Rarity Filters
 */
import React, { useState, useEffect } from 'react';
import {
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Shield,
  Target,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import {
  AchievementItem,
  BadgeCategory,
  BadgeRarity,
} from '../../../../packages/shared-types/src/index.ts';

export function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'ALL'>('ALL');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAchievements();
      setAchievements(data.achievements);
      setUnlockedCount(data.unlockedCount);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRarityBadge = (rarity: BadgeRarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return {
          label: 'LEGENDARY',
          color: 'text-amber-400 bg-amber-400/10 border-amber-400/30 ring-1 ring-amber-400/20',
        };
      case 'EPIC':
        return {
          label: 'EPIC',
          color: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
        };
      case 'RARE':
        return {
          label: 'RARE',
          color: 'text-[#49e6ff] bg-[#49e6ff]/10 border-[#49e6ff]/30',
        };
      case 'COMMON':
      default:
        return {
          label: 'COMMON',
          color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
        };
    }
  };

  const filteredBadges = achievements.filter((ach) => {
    const matchesCategory = selectedCategory === 'ALL' || ach.category === selectedCategory;
    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'UNLOCKED' && ach.isUnlocked) ||
      (selectedFilter === 'LOCKED' && !ach.isUnlocked);
    const matchesSearch =
      ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2537] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2.5 py-1 rounded-full border border-[#b8ff3c]/20 mb-2">
            <Award className="w-3.5 h-3.5" />
            Phase 6 Achievement System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic & Focus Badges
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Unlock prestige trophies through study streaks, deep work marathons, and digital balance.
          </p>
        </div>

        {/* Counter Card */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#b8ff3c]/10 border border-[#b8ff3c]/20 flex items-center justify-center text-[#b8ff3c]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Badges Unlocked</div>
            <div className="text-2xl font-black font-mono tabular-nums text-white">
              {unlockedCount} <span className="text-sm text-zinc-500 font-normal">/ {achievements.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#17131f] p-1.5 rounded-2xl border border-[#2c2537]">
            {[
              { id: 'ALL', label: 'All Categories' },
              { id: 'FOCUS', label: 'Focus Study' },
              { id: 'CONSISTENCY', label: 'Consistency' },
              { id: 'WELLBEING', label: 'Digital Wellbeing' },
              { id: 'SOCIAL', label: 'Social' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#b8ff3c] text-[#07060a]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#17131f] p-1 rounded-xl border border-[#2c2537]">
              {(['ALL', 'UNLOCKED', 'LOCKED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                    selectedFilter === filter
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search badges..."
                className="w-full bg-[#17131f] border border-[#2c2537] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#b8ff3c]/50 font-sans"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((ach) => {
          const rarity = getRarityBadge(ach.rarity);
          const isUnlocked = ach.isUnlocked;

          return (
            <div
              key={ach.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                isUnlocked
                  ? 'bg-gradient-to-b from-[#191424] to-[#120f18] border-[#2c2537] hover:border-[#b8ff3c]/40 shadow-lg'
                  : 'bg-[#100d17]/80 border-[#2c2537]/60 opacity-60'
              }`}
            >
              <div>
                {/* Top Badge Meta */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${rarity.color}`}
                  >
                    {rarity.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#b8ff3c] bg-[#b8ff3c]/10 px-2 py-0.5 rounded-md border border-[#b8ff3c]/20">
                    +{ach.xpReward} XP
                  </span>
                </div>

                {/* Badge Icon / Lock */}
                <div className="my-3 flex items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-[#b8ff3c]/20 to-[#49e6ff]/10 border border-[#b8ff3c]/30 text-white'
                        : 'bg-white/5 border border-white/5 text-zinc-600'
                    }`}
                  >
                    {isUnlocked ? (
                      <Award className="w-7 h-7 text-[#b8ff3c]" />
                    ) : (
                      <Lock className="w-6 h-6 text-zinc-600" />
                    )}
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-tight">{ach.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Progress or Unlock Stamp */}
              <div className="mt-4 pt-3 border-t border-white/5">
                {isUnlocked ? (
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked {ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : 'Verified'}</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>Progress</span>
                      <span>
                        {ach.progressCurrent ?? 0} / {ach.progressTotal ?? 1}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0c0a10] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-600 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(((ach.progressCurrent ?? 0) / (ach.progressTotal ?? 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
