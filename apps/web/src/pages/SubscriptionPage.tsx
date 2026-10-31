/**
 * @file apps/web/src/pages/SubscriptionPage.tsx
 * @description Phase 9: SaaS Monetization, Tier Selection & Pluggable Payment Checkout Flow
 */
import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Check,
  Zap,
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  HelpCircle,
  X,
  Lock,
} from 'lucide-react';
import {
  SubscriptionPlan,
  SubscriptionTier,
  BillingInterval,
  UserSubscriptionState,
} from '../../../../packages/shared-types/src/index.ts';

export const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<UserSubscriptionState | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('MONTHLY');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('STUDENT_PLUS');
  const [checkoutStep, setCheckoutStep] = useState<'DETAILS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const [simulatedOrder, setSimulatedOrder] = useState<any>(null);

  useEffect(() => {
    fetchPlansAndStatus();
  }, []);

  const fetchPlansAndStatus = async () => {
    try {
      const [plansRes, subRes] = await Promise.all([
        fetch('/api/v1/subscriptions/plans').then(r => r.json()),
        fetch('/api/v1/subscriptions/current').then(r => r.json()),
      ]);
      if (plansRes.success) setPlans(plansRes.data);
      if (subRes.success) setCurrentSub(subRes.data);
    } catch (e) {
      console.error('Failed to load subscriptions', e);
    }
  };

  const handleOpenCheckout = async (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setCheckoutStep('DETAILS');
    setCheckoutModalOpen(true);

    try {
      const res = await fetch('/api/v1/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billingInterval }),
      }).then(r => r.json());

      if (res.success) {
        setSimulatedOrder(res.data);
      }
    } catch (e) {
      console.error('Error generating checkout order', e);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!simulatedOrder) return;
    setCheckoutStep('PROCESSING');

    // Simulate network roundtrip to Razorpay sandbox webhook
    setTimeout(async () => {
      try {
        const verifyRes = await fetch('/api/v1/subscriptions/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: selectedTier,
            orderId: simulatedOrder.orderId,
            paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
            signature: `sig_sandbox_verified_${Date.now()}`,
            billingInterval,
          }),
        }).then(r => r.json());

        if (verifyRes.success) {
          setCurrentSub(verifyRes.data);
          setCheckoutStep('SUCCESS');
        }
      } catch (e) {
        console.error('Verification error', e);
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#b8ff3c]/10 text-[#b8ff3c] border border-[#b8ff3c]/20 text-xs font-mono font-semibold rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Phase 9: Simple, Fair Student Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Invest in Your Focus. Master Your Goals.
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Transparent student-friendly tiers designed to help you reclaim lost hours, ace your exams, and maintain healthy habits without burning out.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="inline-flex items-center p-1 bg-[#151222] border border-[#2c2537] rounded-2xl">
          <button
            onClick={() => setBillingInterval('MONTHLY')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
              billingInterval === 'MONTHLY'
                ? 'bg-[#b8ff3c] text-[#07060a] shadow-[0_0_15px_rgba(184,255,60,0.2)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingInterval('ANNUAL')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              billingInterval === 'ANNUAL'
                ? 'bg-[#b8ff3c] text-[#07060a] shadow-[0_0_15px_rgba(184,255,60,0.2)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#0c0a10] text-[#b8ff3c]">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map(plan => {
          const isCurrent = currentSub?.tier === plan.id;
          const price = billingInterval === 'ANNUAL' ? plan.priceAnnualInr : plan.priceMonthlyInr;
          const displayPrice = price === 0 ? '₹0' : `₹${price}`;
          const periodLabel = price === 0 ? 'Forever' : billingInterval === 'ANNUAL' ? '/year' : '/month';

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border flex flex-col justify-between p-6 sm:p-8 transition-all relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#1b172d] to-[#12101a] border-[#b8ff3c] shadow-[0_0_35px_rgba(184,255,60,0.12)]'
                  : 'bg-[#12101a] border-[#2c2537] hover:border-[#3d344d]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#b8ff3c] text-[#07060a] text-[10px] font-mono font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular for Students
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-zinc-400 mt-1 min-h-[36px]">{plan.description}</p>

                <div className="mt-5 mb-6 pb-6 border-b border-[#2c2537]">
                  <span className="text-4xl font-black text-white font-mono">{displayPrice}</span>
                  <span className="text-xs text-zinc-400 font-medium ml-1.5">{periodLabel}</span>
                  {billingInterval === 'ANNUAL' && price > 0 && (
                    <div className="text-[11px] text-[#b8ff3c] font-mono mt-1">
                      Equivalent to ~₹{Math.round(price / 12)}/month
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Included Features:
                  </div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <Check className="w-4 h-4 text-[#b8ff3c] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleOpenCheckout(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-[#1e192c] text-zinc-500 cursor-default border border-[#2c2537]'
                      : plan.isPopular
                      ? 'bg-[#b8ff3c] text-[#07060a] hover:bg-[#a8eb34] shadow-[0_0_20px_rgba(184,255,60,0.25)]'
                      : 'bg-[#1b172a] text-white hover:bg-[#25203a] border border-[#39304e]'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-4 h-4" /> Current Active Plan
                    </>
                  ) : (
                    <>
                      <span>Select {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal (Simulated Razorpay Sandbox) */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141220] border border-[#2c2537] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutStep === 'DETAILS' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 text-white">
                  <CreditCard className="w-5 h-5 text-[#b8ff3c]" />
                  <h3 className="font-bold text-lg">Razorpay Checkout Sandbox</h3>
                </div>

                <div className="bg-[#0c0a10] border border-[#2c2537] rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Plan</span>
                    <span className="font-bold text-white">{selectedTier}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Billing Cycle</span>
                    <span className="font-bold text-white">{billingInterval}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Gateway ID</span>
                    <span className="font-mono text-zinc-300">rzp_test_focusflow</span>
                  </div>
                  <div className="pt-2 border-t border-[#231e30] flex justify-between text-sm">
                    <span className="font-bold text-white">Total Amount</span>
                    <span className="font-mono font-black text-[#b8ff3c]">
                      ₹{(simulatedOrder?.amount || 14900) / 100}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 flex items-start gap-2 bg-[#1b172a] p-3 rounded-xl border border-[#2c2537]">
                  <Lock className="w-4 h-4 text-[#49e6ff] shrink-0 mt-0.5" />
                  <span>
                    Secure test environment. Clicking complete will simulate payment signature verification and grant instant access.
                  </span>
                </div>

                <button
                  onClick={handleSimulatePaymentSuccess}
                  className="w-full py-3 bg-[#b8ff3c] hover:bg-[#a8eb34] text-[#07060a] font-bold text-sm rounded-xl transition-colors shadow-[0_0_20px_rgba(184,255,60,0.2)]"
                >
                  Confirm & Simulate Payment
                </button>
              </div>
            )}

            {checkoutStep === 'PROCESSING' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 border-4 border-[#b8ff3c] border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="font-bold text-white text-base">Verifying Cryptographic Signature...</h4>
                <p className="text-xs text-zinc-400 font-mono">POST /api/v1/subscriptions/verify</p>
              </div>
            )}

            {checkoutStep === 'SUCCESS' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-xl text-white">Subscription Activated!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Your account has been upgraded to {selectedTier}. All pro focus features and Multi-Agent AI capabilities are now live.
                </p>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="px-6 py-2.5 bg-[#b8ff3c] text-[#07060a] font-bold text-xs rounded-xl"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
