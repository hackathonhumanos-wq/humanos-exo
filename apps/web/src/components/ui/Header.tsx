/**
 * @file apps/web/src/components/ui/Header.tsx
 * @description Clean Reference-Matched Top Toolbar with inline Search box (no Ctrl+K labels), Notification Bell, and Account Menu
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Menu,
  ChevronDown,
  User,
  Settings,
  PauseCircle,
  PlayCircle,
  MessageSquarePlus,
  LogOut,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import { NotificationCenter } from '../notifications/NotificationCenter.tsx';
import { StudentAvatar, FocusFlowLogo } from './BrandIllustrations.tsx';
import {
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  type NavPageId,
} from './Sidebar.tsx';

interface HeaderProps {
  studentName: string;
  studentAvatarUrl?: string;
  trackingPaused: boolean;
  onToggleTrackingPause: () => Promise<void> | void;
  onNavigate: (page: NavPageId) => void;
  onStartFocusSession?: () => void;
  onLogout?: () => void;
  onOpenMobileMenu: () => void;
  onOpenFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  studentName,
  studentAvatarUrl,
  trackingPaused,
  onToggleTrackingPause,
  onNavigate,
  onStartFocusSession,
  onLogout,
  onOpenMobileMenu,
  onOpenFeedback,
}) => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      } else if (e.key === 'Escape') {
        setSearchFocused(false);
        setAccountMenuOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allNavItems = [...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS];
  const filteredPages = allNavItems.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.toLowerCase().includes(q))
    );
  });

  return (
    <header className="sticky top-0 z-30 bg-[#F8FCFA]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 pt-4 pb-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger + Clean Search Input ("Search anything..." with zero Ctrl+K text or right badge) */}
        <div className="flex items-center gap-3 flex-1 max-w-[430px]" ref={searchContainerRef}>
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation sidebar"
            className="lg:hidden p-2.5 rounded-xl bg-white border border-[#DFEBF0] text-[#142447] hover:bg-[#F1FAF6] cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden sm:block hidden shrink-0">
            <FocusFlowLogo showTagline={false} compact />
          </div>

          <div className="relative flex-1">
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all ${
                searchFocused
                  ? 'bg-white border-[#079669]/45 shadow-sm'
                  : 'bg-[#EFF5F3] hover:bg-[#EAF3F0] border-[#DFEBF0]'
              }`}
            >
              <Search className="w-4 h-4 text-[#8290A5] shrink-0" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!searchFocused) setSearchFocused(true);
                }}
                placeholder="Search anything..."
                aria-label="Search anything"
                className="w-full bg-transparent text-[13.5px] text-[#142447] placeholder-[#7B8B9F] focus:outline-none"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search query"
                  className="p-0.5 rounded-full text-[#8290A5] hover:text-[#142447] cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Results Popover */}
            {searchFocused && (
              <div
                role="listbox"
                aria-label="Search results"
                className="absolute left-0 right-0 mt-2 bg-white border border-[#DFEBF0] rounded-2xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto p-2 space-y-1"
              >
                <div className="px-3 py-1 text-[10.5px] font-bold text-[#8290A5] uppercase tracking-wider">
                  Quick Actions
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchFocused(false);
                    setQuery('');
                    if (onStartFocusSession) {
                      onStartFocusSession();
                    } else {
                      onNavigate('focus');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-[#E9F9F2] flex items-center justify-between text-xs font-bold text-[#079669] cursor-pointer"
                >
                  <span>Start a 25-Minute Focus Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleTrackingPause();
                    setSearchFocused(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-[#F1FAF6] flex items-center justify-between text-xs font-semibold text-[#142447] cursor-pointer"
                >
                  <span>
                    {trackingPaused
                      ? 'Resume Short-Form Activity Estimation'
                      : 'Pause Short-Form Activity Estimation'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8290A5]" />
                </button>

                <div className="px-3 pt-2 pb-1 text-[10.5px] font-bold text-[#8290A5] uppercase tracking-wider">
                  Pages ({filteredPages.length})
                </div>
                {filteredPages.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-[#8290A5]">
                    No matching pages found for &ldquo;{query}&rdquo;.
                  </div>
                ) : (
                  filteredPages.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSearchFocused(false);
                          setQuery('');
                          onNavigate(item.id);
                        }}
                        className="w-full px-3 py-2 rounded-xl hover:bg-[#F1FAF6] flex items-center justify-between text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-[#52627D] group-hover:text-[#079669]" />
                          <span className="text-xs font-semibold text-[#142447] group-hover:text-[#079669]">
                            {item.label}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8290A5] group-hover:text-[#079669]" />
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Notification Bell + User Profile Avatar & Account Menu */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <NotificationCenter />

          {/* User Profile & Account Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              aria-expanded={accountMenuOpen}
              aria-haspopup="menu"
              aria-label={`Open account menu for ${studentName}`}
              className="flex items-center gap-1.5 py-0.5 pl-0.5 pr-1.5 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
            >
              <StudentAvatar
                name={studentName}
                avatarUrl={studentAvatarUrl}
                size="sm"
                illustratedPortrait
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#52627D]" />
            </button>

            {accountMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAccountMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white border border-[#DFEBF0] shadow-xl z-50 py-2 overflow-hidden"
                >
                  <div className="px-4 py-2.5 border-b border-[#DFEBF0]">
                    <div className="text-sm font-bold text-[#142447]">{studentName}</div>
                    <div className="text-xs text-[#52627D] flex items-center justify-between gap-2 mt-0.5">
                      <span>Student Account</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          trackingPaused
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-[#DDF7EC] text-[#079669]'
                        }`}
                      >
                        {trackingPaused ? 'Paused' : 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-[#142447] hover:bg-[#F1FAF6] hover:text-[#079669] flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#52627D]" />
                      <span>Profile</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onNavigate('settings');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-[#142447] hover:bg-[#F1FAF6] hover:text-[#079669] flex items-center gap-2.5 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#52627D]" />
                      <span>Account &amp; Privacy Settings</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onToggleTrackingPause();
                        setAccountMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-[#142447] hover:bg-[#F1FAF6] hover:text-[#079669] flex items-center gap-2.5 cursor-pointer"
                    >
                      {trackingPaused ? (
                        <PlayCircle className="w-4 h-4 text-[#079669]" />
                      ) : (
                        <PauseCircle className="w-4 h-4 text-[#F28A35]" />
                      )}
                      <span>
                        {trackingPaused ? 'Resume Activity Tracking' : 'Pause Activity Tracking'}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onOpenFeedback();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-[#142447] hover:bg-[#F1FAF6] hover:text-[#079669] flex items-center gap-2.5 cursor-pointer"
                    >
                      <MessageSquarePlus className="w-4 h-4 text-[#52627D]" />
                      <span>Send Product Feedback</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onNavigate('landing');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-[#142447] hover:bg-[#F1FAF6] hover:text-[#079669] flex items-center gap-2.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#52627D]" />
                      <span>Platform Tour</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#DFEBF0]">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onLogout) {
                          onLogout();
                        } else {
                          onNavigate('login');
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-[#EF4444] hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
