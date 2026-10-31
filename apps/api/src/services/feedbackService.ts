/**
 * @file apps/api/src/services/feedbackService.ts
 * @description In-app student feedback management service
 */
import type {
  ProductFeedbackItem,
  FeedbackCategory,
  FeedbackStatus,
} from '../../../../packages/shared-types/src/index.ts';

class FeedbackService {
  private feedbackList: ProductFeedbackItem[] = [
    {
      id: 'fb-1',
      userId: 'usr-student-demo',
      category: 'FEATURE_REQUEST',
      rating: 5,
      title: 'Obsidian & Notion Study Session Sync',
      description: 'Would love to see our completed Pomodoros automatically logged into Notion study trackers.',
      status: 'IN_PROGRESS',
      createdAt: '2025-05-10T14:20:00.000Z',
      adminResponse: 'Great suggestion! Notion integration is currently planned for v1.2.',
    },
    {
      id: 'fb-2',
      userId: 'usr-student-demo',
      category: 'PRAISE',
      rating: 5,
      title: 'Reel Guard saved my midterm exam',
      description: 'The 5-second breath pause completely broke my habit of opening Instagram between lecture slides.',
      status: 'RESOLVED',
      createdAt: '2025-05-08T09:12:00.000Z',
      adminResponse: 'Congratulations on your midterm! Proud of your discipline.',
    },
    {
      id: 'fb-3',
      userId: 'usr-student-demo',
      category: 'UI_UX',
      rating: 4,
      title: 'Dark OLED mode contrast in timer',
      description: 'Timer numbers are crisp, but adding an ultra-dim pure black mode for night study would be awesome.',
      status: 'TRIAGED',
      createdAt: '2025-05-04T22:45:00.000Z',
      adminResponse: 'Under review by design team for the upcoming dark-theme polish.',
    },
  ];

  public getAllFeedback(): ProductFeedbackItem[] {
    return this.feedbackList;
  }

  public submitFeedback(data: {
    userId: string;
    category: FeedbackCategory;
    rating: number;
    title: string;
    description: string;
  }): ProductFeedbackItem {
    const item: ProductFeedbackItem = {
      id: `fb-${Date.now()}`,
      userId: data.userId,
      category: data.category,
      rating: Math.max(1, Math.min(5, data.rating)),
      title: data.title,
      description: data.description,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };
    this.feedbackList.unshift(item);
    return item;
  }

  public updateStatus(id: string, status: FeedbackStatus, adminResponse?: string): ProductFeedbackItem | null {
    const item = this.feedbackList.find(f => f.id === id);
    if (!item) return null;
    item.status = status;
    if (adminResponse) item.adminResponse = adminResponse;
    return item;
  }
}

export const feedbackService = new FeedbackService();
