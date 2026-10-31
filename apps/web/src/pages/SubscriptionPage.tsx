/**
 * @file apps/web/src/pages/SubscriptionPage.tsx
 * @description Light-theme Student Plans & Campus Access page connected to /api/v1/subscriptions/*
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  SubscriptionPlan,
  UserSubscriptionState,
  BillingInterval,
} from '../../../../packages/shared-types/src/index.ts';
import { EmptyState } from '../components/ui/EmptyState.tsx';

export const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [current, setCurrent] = useState<UserSubscriptionState | null>(null);
  const [interval, setInterval] = useState<BillingInterval>('ANNUAL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, cur] = await Promise.all([
        apiClient.getSubscriptionPlans(),
        apiClient.getCurrentSubscription(),
      ]);
      setPlans(p);
      setCurrent(cur);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load student plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    try {
      setUpgradingTier(plan.id);
      const order = await apiClient.createCheckoutOrder({
        tier: plan.id,
        billingInterval: interval,
      });
      const verified = await apiClient.verifySubscriptionPayment({
        tier: plan.id,
        orderId: order.orderId,
        paymentId: `pay_demo_${Date.now()}`,
        signature: 'demo_verified_signature',
        billingInterval: interval,
      });
      setCurrent(verified);
      setNotice(`[DEMO] Activated ${plan.name} plan in sandbox mode.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Unable to switch plan.');
    } finally {
      setUpgradingTier(null);
    }
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Student Plans"
        description="Retrieving student-friendly plans and institutional access..."
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Student plans unavailable"
        description={error}
        actionLabel="Retry"
        onAction={loadPlans}
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Student-Friendly Plans
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Core focus timers, Reels &amp; Shorts estimation, and privacy controls are free for every student.
          </p>
        </div>

        <div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-white border border-[#E1EEE9] self-start">
          {(['MONTHLY', 'ANNUAL'] as BillingInterval[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setInterval(b)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                interval === b ? 'bg-[#079669] text-white' : 'text-[#5A708D]'
              }`}
            >
              {b === 'ANNUAL' ? 'Annual (Student Save)' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-[#E9F9F2] border border-[#BCEAD7] text-[#067652] text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#079669]" />
            {notice}
          </span>
          <button type="button" onClick={() => setNotice(null)} className="underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isCurrent = current?.tier === plan.id;
          const displayPrice =
            plan.priceMonthlyInr === 0
              ? 'Free'
              : interval === 'ANNUAL'
                ? `₹${Math.round(plan.priceAnnualInr / 12)}/mo`
                : `₹${plan.priceMonthlyInr}/mo`;

          return (
            <div
              key={plan.id}
              className={`ff-card p-6 flex flex-col justify-between gap-6 ${
                plan.isPopular ? 'ring-2 ring-[#079669]' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-[#142647]">{plan.name}</h2>
                  {plan.isPopular && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669]">
                      Popular
                    </span>
                  )}
                </div>
                <div className="font-display text-3xl font-extrabold text-[#142647] tabular-nums">
                  {displayPrice}
                </div>
                <p className="text-xs text-[#5A708D] leading-relaxed">{plan.description}</p>

                <ul className="space-y-2 pt-2">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-[#253858]">
                      <Check className="w-4 h-4 text-[#079669] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isCurrent || upgradingTier === plan.id}
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                  isCurrent
                    ? 'bg-[#E9F9F2] text-[#079669] cursor-default'
                    : 'bg-[#079669] hover:bg-[#057A55] text-white'
                }`}
              >
                {isCurrent
                  ? 'Current Active Plan'
                  : upgradingTier === plan.id
                    ? 'Activating [DEMO]...'
                    : `Select ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
