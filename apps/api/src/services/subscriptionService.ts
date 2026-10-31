/**
 * @file apps/api/src/services/subscriptionService.ts
 * @description SaaS monetization engine with tier models, entitlement checks, and payment gateway abstraction
 */
import type {
  SubscriptionPlan,
  SubscriptionTier,
  BillingInterval,
  UserSubscriptionState,
  PaymentOrderResponse,
} from '../../../../packages/shared-types/src/index.ts';

export interface PaymentProvider {
  createOrder(amount: number, currency: string, receipt: string): Promise<{ id: string; amount: number; currency: string }>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}

export class MockRazorpayProvider implements PaymentProvider {
  private keyId = 'rzp_test_focusflow_sandbox';
  private keySecret = 'mock_secret_key_focusflow';

  public getKeyId(): string {
    return this.keyId;
  }

  public async createOrder(amount: number, currency: string, receipt: string): Promise<{ id: string; amount: number; currency: string }> {
    return {
      id: `order_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
      amount,
      currency,
    };
  }

  public verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    // In test sandbox mode, any valid-looking signature format is accepted
    return Boolean(orderId && paymentId && signature && signature.length >= 10);
  }
}

class SubscriptionService {
  private paymentProvider = new MockRazorpayProvider();

  private plans: SubscriptionPlan[] = [
    {
      id: 'STUDENT_FREE',
      name: 'Free Student',
      priceMonthlyInr: 0,
      priceAnnualInr: 0,
      priceMonthlyUsd: 0,
      description: 'Core focus essentials for everyday high school & college studying.',
      features: [
        'Custom Pomodoro & Deep Work Timer',
        'Basic Reels & Shorts navigation limiter (30m daily)',
        '7-day historical focus analytics',
        'Standard XP progression & 16 basic badges',
        'Public study groups access',
      ],
      isPopular: false,
    },
    {
      id: 'STUDENT_PLUS',
      name: 'Student Plus',
      priceMonthlyInr: 149,
      priceAnnualInr: 1490,
      priceMonthlyUsd: 2.99,
      description: 'Advanced AI coaching, customized website blocker schedules, and streak safety.',
      features: [
        'Everything in Free Student',
        'Strict Reel Guard: Zero-Bypass lockdown mode',
        'Adaptive AI Study Planner with energy curve balancing',
        'Unlimited streak freezes & challenge creation',
        'Multi-Agent Focus Coach (Weekly synthesis audio & text)',
        'Priority cloud sync across Extension & Mobile',
      ],
      isPopular: true,
    },
    {
      id: 'PRO_CAMPUS',
      name: 'Pro Campus / Institutional',
      priceMonthlyInr: 399,
      priceAnnualInr: 3990,
      priceMonthlyUsd: 6.99,
      description: 'Maximum performance for competitive exams & campus counsellor opt-in circles.',
      features: [
        'Everything in Student Plus',
        'Autonomous Multi-Agent System (6 specialized agents)',
        'Institutional Counsellor opt-in portal access',
        'Custom Smart Automations (trigger-based focus workflows)',
        'Exam Crunch Mode with predictive syllabus pacing',
        'Direct 1-on-1 priority support & roadmap voting',
      ],
      isPopular: false,
    },
  ];

  // In-memory demo subscription state
  private userSubscription: UserSubscriptionState = {
    userId: 'usr-student-demo',
    tier: 'STUDENT_PLUS',
    isActive: true,
    expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    billingInterval: 'MONTHLY',
    provider: 'MOCK_RAZORPAY',
    featuresUnlocked: [
      'pomodoro_timer',
      'reel_guard_strict',
      'adaptive_study_planner',
      'ai_coach_weekly',
      'streak_freezes',
    ],
  };

  public getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  public getUserSubscription(userId: string): UserSubscriptionState {
    return this.userSubscription;
  }

  public async createCheckoutOrder(
    tier: SubscriptionTier,
    billingInterval: BillingInterval = 'MONTHLY'
  ): Promise<PaymentOrderResponse> {
    const plan = this.plans.find(p => p.id === tier);
    if (!plan) {
      throw new Error(`Invalid subscription tier: ${tier}`);
    }

    const price = billingInterval === 'ANNUAL' ? plan.priceAnnualInr : plan.priceMonthlyInr;
    const amountInPaise = price * 100; // Razorpay expects smallest currency subunit

    const order = await this.paymentProvider.createOrder(amountInPaise, 'INR', `rcpt_${tier}_${Date.now()}`);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      tier,
      billingInterval,
      keyId: this.paymentProvider.getKeyId(),
      mockGatewayUrl: `https://api.focusflow.study/mock-checkout/${order.id}`,
    };
  }

  public verifyAndActivateSubscription(
    tier: SubscriptionTier,
    orderId: string,
    paymentId: string,
    signature: string,
    billingInterval: BillingInterval = 'MONTHLY'
  ): UserSubscriptionState {
    const isValid = this.paymentProvider.verifySignature(orderId, paymentId, signature);
    if (!isValid) {
      throw new Error('Payment verification signature mismatch');
    }

    const plan = this.plans.find(p => p.id === tier);
    const durationDays = billingInterval === 'ANNUAL' ? 365 : 30;

    this.userSubscription = {
      userId: 'usr-student-demo',
      tier,
      isActive: true,
      expiresAt: new Date(Date.now() + 86400000 * durationDays).toISOString(),
      billingInterval,
      provider: 'MOCK_RAZORPAY',
      featuresUnlocked: plan ? plan.features : [],
    };

    return this.userSubscription;
  }
}

export const subscriptionService = new SubscriptionService();
