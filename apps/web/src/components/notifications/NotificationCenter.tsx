/**
 * @file apps/web/src/components/notifications/NotificationCenter.tsx
 * @description Light-theme accessible Notification Menu in Top Bar with resilient polling and UI error recovery
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';
import type { AppNotification, NotificationType } from '../../../../../packages/shared-types/src/index.ts';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterUnread, setFilterUnread] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return;
    }
    try {
      const data = await apiClient.getNotifications();
      if (!mountedRef.current) return;
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setSyncError(null);
    } catch {
      if (!mountedRef.current) return;
      setSyncError('Notifications temporarily offline.');
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchNotifications();

    const interval = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        return;
      }
      fetchNotifications();
    }, 30000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(interval);
    };
  }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    try {
      await apiClient.markNotificationRead(id);
      await fetchNotifications();
    } catch {
      setSyncError('Could not update notification status.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.markAllNotificationsRead();
      await fetchNotifications();
    } catch {
      setSyncError('Could not mark notifications as read.');
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'LEVEL_UP':
      case 'XP_EARNED':
        return <Trophy className="w-4 h-4 text-[#079669]" />;
      case 'STREAK_MILESTONE':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'BADGE_UNLOCKED':
        return <Award className="w-4 h-4 text-[#438CF5]" />;
      case 'FRIEND_REQUEST':
      case 'FRIEND_ACCEPTED':
      case 'GROUP_INVITE':
        return <Users className="w-4 h-4 text-[#438CF5]" />;
      case 'CHALLENGE_COMPLETE':
        return <Target className="w-4 h-4 text-[#079669]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#7C5CFC]" />;
    }
  };

  const displayedList = filterUnread ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          const nextOpen = !isOpen;
          setIsOpen(nextOpen);
          if (nextOpen) {
            fetchNotifications();
          }
        }}
        className="relative w-10 h-10 rounded-full bg-white hover:bg-[#EEF8F4] border border-[#E1EEE9] text-[#142647] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center tabular-nums">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            role="dialog"
            aria-label="Notifications panel"
            className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl bg-white border border-[#E1EEE9] shadow-xl z-50 overflow-hidden flex flex-col max-h-[500px]"
          >
            <div className="p-4 border-b border-[#E1EEE9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#079669]" />
                <span className="font-display text-sm font-bold text-[#142647]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669] tabular-nums">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-[#079669] hover:text-[#057A55] flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close notifications"
                  className="text-[#6C819C] hover:text-[#142647] p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {syncError && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-2 text-xs text-amber-800">
                <span>{syncError}</span>
                <button
                  type="button"
                  onClick={fetchNotifications}
                  className="inline-flex items-center gap-1 font-bold text-[#079669] cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            <div className="px-4 py-2 bg-[#F7FCFA] border-b border-[#E1EEE9] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setFilterUnread(false)}
                className={`cursor-pointer ${
                  !filterUnread ? 'text-[#079669] font-bold' : 'text-[#5A708D] hover:text-[#142647]'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterUnread(true)}
                className={`cursor-pointer ${
                  filterUnread ? 'text-[#079669] font-bold' : 'text-[#5A708D] hover:text-[#142647]'
                }`}
              >
                Unread only ({unreadCount})
              </button>
            </div>

            <div className="divide-y divide-[#E1EEE9] overflow-y-auto flex-1">
              {displayedList.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#6C819C]">
                  You are all caught up. No new notifications.
                </div>
              ) : (
                displayedList.map((notif) => (
                  <button
                    type="button"
                    key={notif.id}
                    onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      notif.isRead
                        ? 'bg-white opacity-75 hover:opacity-100'
                        : 'bg-[#F4FCF8] hover:bg-[#EAF9F1]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E1EEE9] flex items-center justify-center shrink-0 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#142647] truncate">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#079669] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#4A607A] mt-0.5 leading-relaxed">{notif.message}</p>
                      <div className="text-[10px] text-[#6C819C] mt-1 tabular-nums">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
