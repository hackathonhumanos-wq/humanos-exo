/**
 * @file apps/web/src/components/notifications/NotificationCenter.tsx
 * @description In-App Notification Center Drawer & Trigger
 */
import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  X,
  Trophy,
  Flame,
  Award,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';
import { AppNotification, NotificationType } from '../../../../../packages/shared-types/src/index.ts';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterUnread, setFilterUnread] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await apiClient.markNotificationRead(id);
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.markAllNotificationsRead();
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'LEVEL_UP':
      case 'XP_EARNED':
        return <Trophy className="w-4 h-4 text-[#b8ff3c]" />;
      case 'STREAK_MILESTONE':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'BADGE_UNLOCKED':
        return <Award className="w-4 h-4 text-[#49e6ff]" />;
      case 'FRIEND_REQUEST':
      case 'FRIEND_ACCEPTED':
      case 'GROUP_INVITE':
        return <Users className="w-4 h-4 text-indigo-400" />;
      case 'CHALLENGE_COMPLETE':
        return <Target className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const displayedList = filterUnread ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#17131f] hover:bg-[#241a31] border border-[#2c2537] text-zinc-300 hover:text-white transition-all cursor-pointer"
        aria-label="Open notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-[#17131f] border border-[#2c2537] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[520px]">
            {/* Header */}
            <div className="p-4 border-b border-[#2c2537] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#b8ff3c]" />
                <span className="text-sm font-bold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-mono text-zinc-400 hover:text-[#b8ff3c] flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="px-4 py-2 bg-[#0c0a10] border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <button
                onClick={() => setFilterUnread(false)}
                className={`cursor-pointer ${!filterUnread ? 'text-white font-bold' : 'hover:text-white'}`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilterUnread(true)}
                className={`cursor-pointer ${filterUnread ? 'text-[#b8ff3c] font-bold' : 'hover:text-white'}`}
              >
                Unread only ({unreadCount})
              </button>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-[#2c2537]/50 overflow-y-auto flex-1">
              {displayedList.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-zinc-500">
                  No notifications to display.
                </div>
              ) : (
                displayedList.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      notif.isRead ? 'opacity-60 hover:opacity-100' : 'bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0c0a10] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#b8ff3c] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="text-[10px] font-mono text-zinc-500 mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
