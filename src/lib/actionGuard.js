import { isActionAllowed, getActionCost } from './creditCosts'
import { deductCredits } from './credits'

export async function tryPerformAction({ actionKey, userId, userPlan, currentCredits }) {
  // Layer 1 — plan gate (regardless of credits)
  if (!isActionAllowed(actionKey, userPlan)) {
    return { allowed: false, reason: 'PLAN_LOCKED', cost: getActionCost(actionKey) }
  }

  // Layer 2 — credit check
  const cost = getActionCost(actionKey)
  if ((currentCredits ?? 0) < cost) {
    return { allowed: false, reason: 'INSUFFICIENT_CREDITS', cost }
  }

  // Both layers pass — deduct and allow
  const result = await deductCredits(userId, cost)
  if (result.error) {
    return { allowed: false, reason: 'DEDUCTION_FAILED', cost }
  }

  return { allowed: true, reason: null, cost, newCredits: result.newCredits }
}
