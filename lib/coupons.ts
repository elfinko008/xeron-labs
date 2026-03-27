// ═══════════════════════════════════════════════════════════════
//  XERON ENGINE v7 — Coupon System
//  SERVER-SIDE ONLY — NEVER import on client!
//  Coupon codes are read exclusively from environment variables.
// ═══════════════════════════════════════════════════════════════

export type CouponRewardType = 'credits' | 'discount_percent' | 'plan_free'

export interface CouponReward {
  type: CouponRewardType
  value?: number        // for credits or discount %
  plan?: string         // for plan_free
  credits?: number      // bonus credits with plan_free
  plans?: string[]      // which plans the discount applies to
}

export interface CouponResult {
  valid: boolean
  reward: CouponReward | null
  message?: string
  error?: string
}

// ── GET COUPON MAP — reads from env, returns code→reward map ──
function getCouponMap(): Map<string, CouponReward> {
  const map = new Map<string, CouponReward>()

  const c1 = process.env.COUPON_1
  const c2 = process.env.COUPON_2
  const c3 = process.env.COUPON_3
  const c4 = process.env.COUPON_4
  const c5 = process.env.COUPON_5
  const c6 = process.env.COUPON_6
  const c7 = process.env.COUPON_7

  if (c1) map.set(c1, { type: 'discount_percent', value: 5,  plans: ['pro', 'enterprise'] })
  if (c2) map.set(c2, { type: 'credits', value: 10 })
  if (c3) map.set(c3, { type: 'credits', value: 20 })
  if (c4) map.set(c4, { type: 'discount_percent', value: 30, plans: ['starter', 'pro', 'enterprise'] })
  if (c5) map.set(c5, { type: 'plan_free', plan: 'enterprise', credits: 8999 })
  if (c6) map.set(c6, { type: 'plan_free', plan: 'pro', credits: 400 })
  if (c7) map.set(c7, { type: 'credits', value: 100 })

  return map
}

export function validateCouponCode(code: string): CouponResult {
  if (!code || code.trim() === '') {
    return { valid: false, reward: null, error: 'Please enter a coupon code' }
  }

  const map = getCouponMap()
  const normalizedCode = code.trim().toUpperCase()

  // Check exact match (codes are case-sensitive by design)
  const reward = map.get(code.trim()) || map.get(normalizedCode)

  if (!reward) {
    return { valid: false, reward: null, error: 'Invalid coupon code' }
  }

  return {
    valid: true,
    reward,
    message: getRewardMessage(reward),
  }
}

function getRewardMessage(reward: CouponReward): string {
  switch (reward.type) {
    case 'credits':
      return `🪙 ${reward.value} credits will be added to your account!`
    case 'discount_percent':
      return `🎉 ${reward.value}% discount applied${reward.plans ? ` on ${reward.plans.join(', ')} plans` : ''}!`
    case 'plan_free':
      return `✦ ${reward.plan?.charAt(0).toUpperCase()}${reward.plan?.slice(1)} plan free${reward.credits ? ` + ${reward.credits} credits` : ''}!`
    default:
      return 'Code applied!'
  }
}

export function isCouponApplicableToCartItem(reward: CouponReward, itemType: 'plan' | 'credits', planName?: string): boolean {
  if (reward.type === 'discount_percent') {
    if (itemType !== 'plan') return false
    if (reward.plans && planName && !reward.plans.includes(planName.toLowerCase())) return false
    return true
  }
  if (reward.type === 'plan_free') {
    return itemType === 'plan' && reward.plan === planName?.toLowerCase()
  }
  // Credit rewards apply universally
  return true
}

export function calculateDiscountedPrice(originalPrice: number, reward: CouponReward, planName?: string): number {
  if (reward.type === 'discount_percent' && isCouponApplicableToCartItem(reward, 'plan', planName)) {
    return originalPrice * (1 - (reward.value || 0) / 100)
  }
  if (reward.type === 'plan_free' && reward.plan === planName?.toLowerCase()) {
    return 0
  }
  return originalPrice
}
