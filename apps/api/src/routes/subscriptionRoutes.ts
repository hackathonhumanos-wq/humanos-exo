/**
 * @file apps/api/src/routes/subscriptionRoutes.ts
 * @description API routes for SaaS subscription plans, checkout, and verification
 */
import { Router, type Request, type Response } from 'express';
import { subscriptionService } from '../services/subscriptionService.ts';
import { subscriptionCheckoutSchema } from '../../../../packages/validation/src/index.ts';

export const subscriptionRouter = Router();

subscriptionRouter.get('/plans', (_req: Request, res: Response) => {
  const plans = subscriptionService.getPlans();
  res.json({ success: true, data: plans });
});

subscriptionRouter.get('/current', (_req: Request, res: Response) => {
  const current = subscriptionService.getUserSubscription('usr-student-demo');
  res.json({ success: true, data: current });
});

subscriptionRouter.post('/checkout', async (req: Request, res: Response) => {
  try {
    const parsed = subscriptionCheckoutSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: parsed.error.format() },
      });
      return;
    }

    const order = await subscriptionService.createCheckoutOrder(
      parsed.data.tier,
      parsed.data.billingInterval
    );
    res.status(201).json({ success: true, data: order });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown checkout error';
    res.status(500).json({ success: false, error: { code: 'CHECKOUT_FAILED', message: errorMsg } });
  }
});

subscriptionRouter.post('/verify', (req: Request, res: Response) => {
  try {
    const { tier, orderId, paymentId, signature, billingInterval } = req.body;
    if (!tier || !orderId || !paymentId || !signature) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_PAYMENT_PROOF', message: 'Order ID, payment ID, and signature are required.' },
      });
      return;
    }

    const updatedSub = subscriptionService.verifyAndActivateSubscription(
      tier,
      orderId,
      paymentId,
      signature,
      billingInterval || 'MONTHLY'
    );
    res.json({
      success: true,
      message: 'Payment verified! Subscription activated successfully.',
      data: updatedSub,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Verification failed';
    res.status(400).json({ success: false, error: { code: 'VERIFICATION_ERROR', message: errorMsg } });
  }
});
