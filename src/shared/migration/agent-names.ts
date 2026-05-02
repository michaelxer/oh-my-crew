export const AGENT_NAME_MAP: Record<string, string> = {
  // Captain (was Sisyphus) variants → "sisyphus"
  omo: "sisyphus",
  OmO: "sisyphus",
  Sisyphus: "sisyphus",
  Captain: "sisyphus",
  "Sisyphus (Ultraworker)": "sisyphus",
  "Sisyphus - Ultraworker": "sisyphus",
  "Captain - Ultraworker": "sisyphus",
  sisyphus: "sisyphus",

  // Strategist (was Hephaestus) variants → "hephaestus"
  "Hephaestus (Deep Agent)": "hephaestus",
  "Hephaestus - Deep Agent": "hephaestus",
  "Strategist - Deep Agent": "hephaestus",

  // Architect (was Prometheus) variants → "prometheus"
  "OmO-Plan": "prometheus",
  "omo-plan": "prometheus",
  "Planner-Sisyphus": "prometheus",
  "planner-sisyphus": "prometheus",
  "Prometheus - Plan Builder": "prometheus",
  "Prometheus (Plan Builder)": "prometheus",
  "Architect - Plan Builder": "prometheus",
  prometheus: "prometheus",

  // Foreman (was Atlas) variants → "atlas"
  "orchestrator-sisyphus": "atlas",
  Atlas: "atlas",
  Foreman: "atlas",
  "Atlas (Plan Executor)": "atlas",
  "Atlas - Plan Executor": "atlas",
  "Foreman - Plan Executor": "atlas",
  atlas: "atlas",

  // Advisor (was Metis) variants → "metis"
  "plan-consultant": "metis",
  "Metis - Plan Consultant": "metis",
  "Metis (Plan Consultant)": "metis",
  "Advisor - Plan Consultant": "metis",
  metis: "metis",

  // Auditor (was Momus) variants → "momus"
  "Momus - Plan Critic": "momus",
  "Momus (Plan Critic)": "momus",
  "Auditor - Plan Critic": "momus",
  momus: "momus",

  // Cadet (was Sisyphus-Junior) → "sisyphus-junior"
  "Sisyphus-Junior": "sisyphus-junior",
  Cadet: "sisyphus-junior",
  "sisyphus-junior": "sisyphus-junior",

  // Crew name aliases - passthrough
  build: "build",
  oracle: "oracle",
  Sage: "oracle",
  librarian: "librarian",
  Scribe: "librarian",
  explore: "explore",
  Scout: "explore",
  "multimodal-looker": "multimodal-looker",
  Lookout: "multimodal-looker",
}

export const BUILTIN_AGENT_NAMES = new Set([
  "sisyphus", // was "Sisyphus"
  "oracle",
  "librarian",
  "explore",
  "multimodal-looker",
  "metis", // was "Metis - Plan Consultant"
  "momus", // was "Momus - Plan Critic"
  "prometheus", // was "Prometheus - Plan Builder"
  "atlas", // was "Atlas"
  "build",
])

export function migrateAgentNames(
  agents: Record<string, unknown>
): { migrated: Record<string, unknown>; changed: boolean } {
  const migrated: Record<string, unknown> = {}
  let changed = false

  for (const [key, value] of Object.entries(agents)) {
    const newKey = AGENT_NAME_MAP[key.toLowerCase()] ?? AGENT_NAME_MAP[key] ?? key
    if (newKey !== key) {
      changed = true
    }
    migrated[newKey] = value
  }

  return { migrated, changed }
}
