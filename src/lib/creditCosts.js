export const CREDIT_COSTS = {
  project_creation: 2,
  quick_prompt: 1,
  feature_prompt: 3,
  module_build: 8,
  full_mvp_build: 15,
  image_generation: 1,
  debug_fix: 1,
  deploy: 2,
  export_code: 2,
}

// Actions that are completely unavailable on Free, regardless of credit balance
export const PLAN_GATED_ACTIONS = {
  module_build: ['starter', 'elite'],
  full_mvp_build: ['starter', 'elite'],
  export_code: ['elite'],
  custom_domain: ['starter', 'elite'],
}

export function isActionAllowed(actionKey, userPlan) {
  const allowedPlans = PLAN_GATED_ACTIONS[actionKey]
  if (!allowedPlans) return true // not a gated action, always allowed
  return allowedPlans.includes(userPlan)
}

export function getActionCost(actionKey) {
  return CREDIT_COSTS[actionKey] ?? 1
}
