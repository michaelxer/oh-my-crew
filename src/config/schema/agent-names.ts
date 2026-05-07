import { z } from "zod"

export const BuiltinAgentNameSchema = z.enum([
  "sisyphus",
  "hephaestus",
  "prometheus",
  "oracle",
  "librarian",
  "explore",
  "multimodal-looker",
  "metis",
  "momus",
  "atlas",
  "sisyphus-junior",
  "Cadet",
])

export const BuiltinSkillNameSchema = z.enum([
  "playwright",
  "agent-browser",
  "dev-browser",
  "frontend-ui-ux",
  "git-master",
  "review-work",
  "ai-slop-remover",
  "team-mode",
  "hyperplan",
  "session-guardian",
])

export const OverridableAgentNameSchema = z.enum([
  "build",
  "plan",
  "sisyphus",
  "hephaestus",
  "sisyphus-junior",
  "Cadet",
  "OpenCode-Builder",
  "prometheus",
  "metis",
  "momus",
  "oracle",
  "librarian",
  "explore",
  "multimodal-looker",
  "atlas",
])

export const AgentNameSchema = BuiltinAgentNameSchema
export type AgentName = z.infer<typeof AgentNameSchema>

export type BuiltinSkillName = z.infer<typeof BuiltinSkillNameSchema>
