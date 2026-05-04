# OMC Agent-Model Matching Guide

> **For agents and users**: Why each agent needs a specific model — and how to customize without breaking things.

This OMC version uses the public crew names: Captain, Strategist, Architect, Foreman, Advisor, Auditor, Sage, Scribe, Scout, Cadet, and Lookout. In `oh-my-crew.json`, some internal config keys still use inherited compatibility names such as `sisyphus`, `hephaestus`, `prometheus`, and `atlas`; keep those keys when editing JSON.

The original [Agent-Model Matching Guide](./agent-model-matching.md) is intentionally kept as an upstream-sync reference. When upstream OMO adds or changes model chains, port the behavioral change here and translate the public names to OMC crew names.

## The Core Insight: Models Are Developers

Think of AI models as developers on a team. Each has a different brain, different personality, different strengths. **A model isn't just "smarter" or "dumber." It thinks differently.** Give the same instruction to Claude and GPT, and they'll interpret it in fundamentally different ways.

This isn't a bug. It's the foundation of the entire system.

Oh My Crew assigns each agent a model that matches its _working style_ — like building a team where each person is in the role that fits their personality.

### Captain: The Sociable Lead

Captain is the developer who knows everyone, goes everywhere, and gets things done through communication and coordination. Talks to other agents, understands context across the whole codebase, delegates work intelligently, and codes well too. But deep, purely technical problems? He'll struggle a bit.

**This is why Captain uses Claude / Kimi / GLM.** These models excel at:

- Following complex, multi-step instructions (Captain's prompt is ~1,100 lines)
- Maintaining conversation flow across many tool calls
- Understanding nuanced delegation and orchestration patterns
- Producing well-structured, communicative output

Using Captain with older GPT models would be like taking your best project manager — the one who coordinates everyone, runs standups, and keeps the whole team aligned — and sticking them in a room alone to debug a race condition. Wrong fit. GPT-5.4 now has a dedicated Captain prompt path, but GPT is still not the default recommendation for the orchestrator.

### Strategist: The Deep Specialist

Strategist is the developer who stays in their room coding all day. Doesn't talk much. Might seem socially awkward. But give them a hard technical problem and they'll emerge three hours later with a solution nobody else could have found.

**This is why Strategist uses GPT-5.4.** GPT-5.4 is built for exactly this:

- Deep, autonomous exploration without hand-holding
- Multi-file reasoning across complex codebases
- Principle-driven execution (give a goal, not a recipe)
- Working independently for extended periods

Using Strategist with GLM or Kimi would be like assigning your most communicative, sociable developer to sit alone and do nothing but deep technical work. They'd get it done eventually, but they wouldn't shine — you'd be wasting exactly the skills that make them valuable.

### The Takeaway

Every agent's prompt is tuned to match its model's personality. **When you change the model, you change the brain — and the same instructions get understood completely differently.** Model matching isn't about "better" or "worse." It's about fit.

---

## How Claude and GPT Think Differently

This matters for understanding why some agents support both model families while others don't.

**Claude** responds to **mechanics-driven** prompts — detailed checklists, templates, step-by-step procedures. More rules = more compliance. You can write a 1,100-line prompt with nested workflows and Claude will follow every step.

**GPT** (especially 5.2+) responds to **principle-driven** prompts — concise principles, XML structure, explicit decision criteria. More rules = more contradiction surface = more drift. GPT works best when you state the goal and let it figure out the mechanics.

Real example: Architect's Claude prompt is ~1,100 lines across 7 files. The GPT prompt achieves the same behavior with 3 principles in ~121 lines. Same outcome, completely different approach.

Agents that support both families (Architect, Foreman) auto-detect your model at runtime and switch prompts via `isGptModel()`. You don't have to think about it.

---

## Agent Profiles

### Communicators → Claude / Kimi / GLM

These agents have Claude-optimized prompts — long, detailed, mechanics-driven. They need models that reliably follow complex, multi-layered instructions.

| Agent        | Role              | Fallback Chain                         | Notes                                                                                             |
| ------------ | ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Captain** | Main orchestrator | anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → opencode-go\|vercel/kimi-k2.5 → kimi-for-coding/k2p5 → opencode\|moonshotai\|moonshotai-cn\|firmware\|ollama-cloud\|aihubmix\|vercel/kimi-k2.5 → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (medium) → zai-coding-plan\|opencode\|vercel/glm-5 → opencode/big-pickle | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Advisor**    | Plan gap analyzer | anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (high) → opencode-go\|vercel/glm-5 → kimi-for-coding/k2p5 | Exact runtime chain from `src/shared/model-requirements.ts`. |

### Dual-Prompt Agents → Claude preferred, GPT supported

These agents ship separate prompts for Claude and GPT families. They auto-detect your model and switch at runtime.

| Agent          | Role              | Fallback Chain                         | Notes                                                                |
| -------------- | ----------------- | -------------------------------------- | -------------------------------------------------------------------- |
| **Architect** | Strategic planner | anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (high) → opencode-go\|vercel/glm-5 → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Foreman**      | Todo orchestrator | anthropic\|github-copilot\|opencode\|vercel/claude-sonnet-4-6 → opencode-go\|vercel/kimi-k2.5 → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (medium) → opencode-go\|vercel/minimax-m2.7 | Exact runtime chain from `src/shared/model-requirements.ts`. |

### Deep Specialists → GPT

These agents are built for GPT's principle-driven style. Their prompts assume autonomous, goal-oriented execution. Don't override to Claude.

| Agent          | Role                    | Fallback Chain                         | Notes                                            |
| -------------- | ----------------------- | -------------------------------------- | ------------------------------------------------ |
| **Strategist** | Autonomous deep worker  | openai\|github-copilot\|venice\|opencode\|vercel/gpt-5.4 (medium) | Single-entry chain. Requires one of those providers. The craftsman. |
| **Sage**     | Architecture consultant | openai\|github-copilot\|opencode\|vercel/gpt-5.4 (high) → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → opencode-go\|vercel/glm-5 | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Auditor**      | Ruthless reviewer       | openai\|github-copilot\|opencode\|vercel/gpt-5.4 (xhigh) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → opencode-go\|vercel/glm-5 | Exact runtime chain from `src/shared/model-requirements.ts`. |

### Utility Runners → Speed over Intelligence

These agents do grep, search, and retrieval. They intentionally use the fastest, cheapest models available. **Don't "upgrade" them to Opus** — that's hiring a senior engineer to file paperwork.

| Agent                 | Role               | Fallback Chain                                 | Notes                                                 |
| --------------------- | ------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| **Scout**           | Fast codebase grep | openai/gpt-5.4-mini-fast → opencode-go\|vercel/minimax-m2.7-highspeed → opencode-go\|vercel/minimax-m2.7 → anthropic\|opencode\|vercel/claude-haiku-4-5 → openai\|opencode\|vercel/gpt-5.4-nano | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Scribe**         | Docs/code search   | openai/gpt-5.4-mini-fast → opencode-go\|vercel/minimax-m2.7-highspeed → opencode-go\|vercel/minimax-m2.7 → anthropic\|opencode\|vercel/claude-haiku-4-5 → openai\|opencode\|vercel/gpt-5.4-nano | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Lookout** | Vision/screenshots | openai\|opencode\|vercel/gpt-5.4 (medium) → opencode-go\|vercel/kimi-k2.5 → zai-coding-plan\|vercel/glm-4.6v → openai\|github-copilot\|opencode\|vercel/gpt-5-nano | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Cadet**   | Category executor  | anthropic\|github-copilot\|opencode\|vercel/claude-sonnet-4-6 → opencode-go\|vercel/kimi-k2.5 → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (medium) → opencode-go\|vercel/minimax-m2.7 → opencode/big-pickle | Exact runtime chain from `src/shared/model-requirements.ts`. |

---

## Model Families

### Claude Family

Communicative, instruction-following, structured output. Best for agents that need to follow complex multi-step prompts.

| Model                 | Strengths                                                                    |
| --------------------- | ---------------------------------------------------------------------------- |
| **Claude Opus 4.7**   | Best overall. Highest compliance with complex prompts. Default for Captain. |
| **Claude Sonnet 4.6** | Faster, cheaper. Good balance for everyday tasks.                            |
| **Claude Haiku 4.5**  | Fast and cheap. Good for quick tasks and utility work.                       |
| **Kimi K2.5**         | Behaves very similarly to Claude. Great all-rounder at lower cost.           |
| **GLM 5**             | Claude-like behavior. Solid for orchestration tasks.                         |

### GPT Family

Principle-driven, explicit reasoning, deep technical capability. Best for agents that work autonomously on complex problems.

| Model             | Strengths                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **GPT-5.3 Codex** | Deep coding powerhouse. Autonomous exploration. Still available for deep category and explicit overrides. |
| **GPT-5.4**       | High intelligence, strategic reasoning. Default for Sage, Auditor, and a key fallback for Architect / Foreman. Uses xhigh variant for Auditor. |
| **GPT-5.4 Mini**  | Fast + strong reasoning. Good for lightweight autonomous tasks. Default for quick category. |
| **GPT-5-Nano**    | Ultra-cheap, fast. Good for simple utility tasks.                                               |

### Other Models

| Model                | Strengths                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Gemini 3.1 Pro**   | Excels at visual/frontend tasks. Different reasoning style. Default for `visual-engineering` and `artistry`. |
| **Gemini 3 Flash**   | Fast. Good for doc search and light tasks.                                                                   |
| **GPT-5.4 Mini Fast** | Default for Scout and Scribe agents. Blazing-fast reasoning-capable mini model. |
| **MiniMax M2.7**     | Fast and smart. Used in OpenCode Go and OpenCode Zen utility fallback chains. |
| **MiniMax M2.7 Highspeed** | High-speed OpenCode catalog entry used in utility fallback chains that prefer the fastest available MiniMax path. |

### OpenCode Go

A premium subscription tier ($10/month) that provides reliable access to Chinese frontier models through OpenCode's infrastructure.

**Available Models:**

| Model                    | Use Case                                                              |
| ------------------------ | --------------------------------------------------------------------- |
| **opencode-go/kimi-k2.5** | Vision-capable, Claude-like reasoning. Used by Captain, Foreman, Cadet, Lookout. |
| **opencode-go/glm-5**     | Text-only orchestration model. Used by Sage, Architect, Advisor, Auditor.                           |
| **opencode-go/minimax-m2.7** | Ultra-cheap, fast responses. Used by Foreman, Cadet, Scout and Scribe fallbacks for utility work. |
| **opencode-go/minimax-m2.7-highspeed** | Even faster OpenCode Go MiniMax entry used as a secondary fallback for Scout and Scribe when GPT-5.4 Mini Fast is unavailable. |

**When It Gets Used:**

OpenCode Go models appear throughout the fallback chains as intermediate options. Depending on the agent, they can sit before GPT, after GPT, or act as the last structured-model fallback before cheaper utility paths.

**Go-Only Scenarios:**

Some model identifiers like `k2p5` (paid Kimi K2.5) and `glm-5` may only be available through OpenCode Go subscription in certain regions. When configured with these short identifiers, the system resolves them through the opencode-go provider first.

### About Free-Tier Fallbacks

You may see model names like `kimi-k2.5-free`, `minimax-m2.7`, `minimax-m2.7-highspeed`, or `big-pickle` (GLM 4.6) in the source code or logs. These are provider-specific or speed-optimized entries in fallback chains.

You don't need to configure them. The system includes them so it degrades gracefully when you don't have every paid subscription. If you have the paid version, the paid version is always preferred.

---

## Task Categories

When agents delegate work, they don't pick a model name — they pick a **category**. The category maps to the right model automatically.

| Category             | When Used                  | Fallback Chain                               |
| -------------------- | -------------------------- | -------------------------------------------- |
| `visual-engineering` | Frontend, UI, CSS, design  | google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → zai-coding-plan\|opencode\|vercel/glm-5 → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → opencode-go\|vercel/glm-5 → kimi-for-coding/k2p5 |
| `ultrabrain`         | Maximum reasoning needed   | openai\|opencode\|vercel/gpt-5.4 (xhigh) → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → opencode-go\|vercel/glm-5 |
| `deep`               | Deep coding, complex logic | openai\|github-copilot\|venice\|opencode\|vercel/gpt-5.4 (medium) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) |
| `artistry`           | Creative, novel approaches | google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → openai\|github-copilot\|opencode\|vercel/gpt-5.4 |
| `quick`              | Simple, fast tasks         | openai\|github-copilot\|opencode\|vercel/gpt-5.4-mini → anthropic\|github-copilot\|opencode\|vercel/claude-haiku-4-5 → google\|github-copilot\|opencode\|vercel/gemini-3-flash → opencode-go\|vercel/minimax-m2.7 → opencode\|vercel/gpt-5-nano |
| `unspecified-high`   | General complex work       | anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (high) → zai-coding-plan\|opencode\|vercel/glm-5 → kimi-for-coding/k2p5 → opencode-go\|vercel/glm-5 → opencode\|vercel/kimi-k2.5 → opencode\|moonshotai\|moonshotai-cn\|firmware\|ollama-cloud\|aihubmix\|vercel/kimi-k2.5 |
| `unspecified-low`    | General standard work      | anthropic\|github-copilot\|opencode\|vercel/claude-sonnet-4-6 → openai\|opencode\|vercel/gpt-5.3-codex (medium) → opencode-go\|vercel/kimi-k2.5 → google\|github-copilot\|opencode\|vercel/gemini-3-flash → opencode-go\|vercel/minimax-m2.7 |
| `writing`            | Text, docs, prose          | google\|github-copilot\|opencode\|vercel/gemini-3-flash → opencode-go\|vercel/kimi-k2.5 → anthropic\|github-copilot\|opencode\|vercel/claude-sonnet-4-6 → opencode-go\|vercel/minimax-m2.7 |

See the [Orchestration System Guide](./orchestration.md) for how agents dispatch tasks to categories.

### Vercel AI Gateway fallback coverage

`src/shared/model-requirements.ts` now includes `vercel` on nearly every gateway-compatible fallback entry across both agent and category chains. Treat it as a universal extra provider path for the listed model IDs, not as a different model family. If a row above shows `|vercel` in the provider set, that is the current source-of-truth runtime fallback, not a docs-only convenience alias.

---

## Customization

### Example Configuration

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/michaelxer/oh-my-crew/refs/heads/oh-my-crew/assets/oh-my-opencode.schema.json",

  "agents": {
    // Captain - main orchestrator: Claude Opus or Kimi K2.5 work best
    "sisyphus": {
      "model": "kimi-for-coding/k2p5",
      "ultrawork": { "model": "anthropic/claude-opus-4-7", "variant": "max" },
    },

    // Scribe and Scout - research agents: cheaper models are fine
    "librarian": { "model": "google/gemini-3-flash" },
    "explore": { "model": "github-copilot/grok-code-fast-1" },

    // Sage - architecture consultation: GPT or Claude Opus
    "oracle": { "model": "openai/gpt-5.4", "variant": "high" },

    // Architect - strategic planner; config key remains "prometheus"
    "prometheus": {
      "prompt_append": "Leverage deep & quick agents heavily, always in parallel.",
    },
  },

  "categories": {
    "quick": { "model": "opencode/gpt-5-nano" },
    "unspecified-low": { "model": "anthropic/claude-sonnet-4-6" },
    "unspecified-high": { "model": "anthropic/claude-opus-4-7", "variant": "max" },
    "visual-engineering": {
      "model": "google/gemini-3.1-pro",
      "variant": "high",
    },
    "writing": { "model": "google/gemini-3-flash" },
  },

  // Limit expensive providers; let cheap ones run freely
  "background_task": {
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 3,
      "opencode": 10,
      "zai-coding-plan": 10,
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-7": 2,
      "opencode/gpt-5-nano": 20,
    },
  },
}
```

Run `opencode models` to see available models, `opencode auth login` to authenticate providers.

### AXR AI Pro / Owner Recommendations

Use this table as the recommended override reference for AXR AI Pro and AXR AI Owner / Full Access installs when these model IDs are present in the live AXR catalog. If AXR changes the catalog or adds newer superior models, prefer the newer matching model family and update this table. For AXR Trial users, let OMC auto-select from the limited Trial catalog instead of forcing this table.

All model IDs below use the `axrai/` provider prefix for `oh-my-crew.json`.

| Crew agent | Config key | Primary | Fallback |
|------------|------------|---------|----------|
| Captain | `sisyphus` | `axrai/gpt-5.5` | `axrai/claude-opus-4.6` |
| Advisor | `metis` | `axrai/gpt-5.5` | `axrai/claude-opus-4.6` |
| Architect | `prometheus` | `axrai/gpt-5.5` | `axrai/claude-opus-4.6` |
| Foreman | `atlas` | `axrai/gpt-5.4` | `axrai/kimi-k2.5` |
| Strategist | `hephaestus` | `axrai/gpt-5.4` | `axrai/claude-opus-4.6` |
| Sage | `oracle` | `axrai/gemini-3.1-pro` | `axrai/gpt-5.4` |
| Auditor | `momus` | `axrai/gpt-5.4` | `axrai/claude-opus-4.6` |
| Scout | `explore` | `axrai/claude-haiku-4.5` | `axrai/gemini-3.0-flash` |
| Scribe | `librarian` | `axrai/claude-haiku-4.5` | `axrai/gemini-3.0-flash` |
| Lookout | `multimodal-looker` | `axrai/gpt-5.4` | `axrai/kimi-k2.5` |
| Cadet | `sisyphus-junior` | `axrai/kimi-k2.5` | `axrai/gpt-5.4` |

Recommended category overrides for AXR Pro / Owner:

| Category | Primary | Fallback |
|----------|---------|----------|
| `visual-engineering` | `axrai/gemini-3.1-pro` | `axrai/gpt-5.4` |
| `artistry` | `axrai/gemini-3.1-pro` | `axrai/claude-opus-4.6` |
| `ultrabrain` | `axrai/gpt-5.5` | `axrai/claude-opus-4.6` |
| `deep` | `axrai/gpt-5.4` | `axrai/claude-opus-4.6` |
| `quick` | `axrai/claude-haiku-4.5` | `axrai/gemini-3.0-flash` |
| `unspecified-high` | `axrai/gpt-5.5` | `axrai/claude-opus-4.6` |
| `unspecified-low` | `axrai/kimi-k2.5` | `axrai/gpt-5.4` |
| `writing` | `axrai/claude-haiku-4.5` | `axrai/gemini-3.0-flash` |

Minimal `oh-my-crew.json` override shape:

```jsonc
{
  "agents": {
    "sisyphus": { "model": "axrai/gpt-5.5", "fallback_models": ["axrai/claude-opus-4.6"] },
    "metis": { "model": "axrai/gpt-5.5", "fallback_models": ["axrai/claude-opus-4.6"] },
    "prometheus": { "model": "axrai/gpt-5.5", "fallback_models": ["axrai/claude-opus-4.6"] },
    "atlas": { "model": "axrai/gpt-5.4", "fallback_models": ["axrai/kimi-k2.5"] },
    "hephaestus": { "model": "axrai/gpt-5.4", "fallback_models": ["axrai/claude-opus-4.6"] },
    "oracle": { "model": "axrai/gemini-3.1-pro", "fallback_models": ["axrai/gpt-5.4"] },
    "momus": { "model": "axrai/gpt-5.4", "fallback_models": ["axrai/claude-opus-4.6"] },
    "explore": { "model": "axrai/claude-haiku-4.5", "fallback_models": ["axrai/gemini-3.0-flash"] },
    "librarian": { "model": "axrai/claude-haiku-4.5", "fallback_models": ["axrai/gemini-3.0-flash"] },
    "multimodal-looker": { "model": "axrai/gpt-5.4", "fallback_models": ["axrai/kimi-k2.5"] },
    "sisyphus-junior": { "model": "axrai/kimi-k2.5", "fallback_models": ["axrai/gpt-5.4"] }
  },
  "categories": {
    "visual-engineering": { "model": "axrai/gemini-3.1-pro", "fallback_models": ["axrai/gpt-5.4"] },
    "artistry": { "model": "axrai/gemini-3.1-pro", "fallback_models": ["axrai/claude-opus-4.6"] },
    "ultrabrain": { "model": "axrai/gpt-5.5", "fallback_models": ["axrai/claude-opus-4.6"] },
    "deep": { "model": "axrai/gpt-5.4", "fallback_models": ["axrai/claude-opus-4.6"] },
    "quick": { "model": "axrai/claude-haiku-4.5", "fallback_models": ["axrai/gemini-3.0-flash"] },
    "unspecified-high": { "model": "axrai/gpt-5.5", "fallback_models": ["axrai/claude-opus-4.6"] },
    "unspecified-low": { "model": "axrai/kimi-k2.5", "fallback_models": ["axrai/gpt-5.4"] },
    "writing": { "model": "axrai/claude-haiku-4.5", "fallback_models": ["axrai/gemini-3.0-flash"] }
  }
}
```

### Safe vs Dangerous Overrides

**Safe** — same personality type:

- Captain: Opus → Sonnet, Kimi K2.5, GLM 5 (all communicative models)
- Architect: Opus → GPT-5.4 (auto-switches to the GPT prompt)
- Foreman: Claude Sonnet 4.6 → GPT-5.4 (auto-switches to the GPT prompt)

**Dangerous** — personality mismatch:

- Captain → older GPT models: **Still a bad fit. GPT-5.4 is the only dedicated GPT prompt path.**
- Strategist → Claude: **Built for Codex's autonomous style. Claude can't replicate this.**
- Scout → Opus: **Massive cost waste. Scout needs speed, not intelligence.**
- Scribe → Opus: **Same. Doc search doesn't need Opus-level reasoning.**

### How Model Resolution Works

Each agent has a fallback chain. The system tries models in priority order until it finds one available through your connected providers. You don't need to configure providers per model. Just authenticate (`opencode auth login`) and the system figures out which models are available and where.

Provider ids are routing labels, not the source of model quality. When a provider or gateway exposes a catalog with familiar model families, OMC matches by model name and family first: Claude Opus/Sonnet, GPT, Gemini, Kimi, GLM, MiniMax, and their newer compatible versions. This keeps AXR AI, OpenCode, Vercel AI Gateway, custom gateways, and future providers on the same mental model: choose the best fitting model for the agent, then prefix it with the provider that can serve it.

Catalog-driven providers use the same provider-neutral ranking rule. For example, if a gateway offers `claude-opus-4.6`, `gpt-5.5`, `gpt-5-mini`, `gemini-3.1-pro`, and `kimi-k2.5`, Captain/Foreman-style agents should prefer Opus, GPT-specialist agents should prefer GPT, visual/frontend categories should preserve Gemini-first behavior, and Scout/Scribe-style utility agents should prefer the smaller fast model unless the user explicitly wants premium quality over speed. Kimi or GLM remain useful fallbacks, but they should not outrank a stronger matching Opus/GPT/Gemini model just because they appeared earlier from one provider's catalog.

Core-agent tab cycling is deterministic via injected runtime order field. The fixed priority order is Captain (`sisyphus`, order: 1), Strategist (`hephaestus`, order: 2), Architect (`prometheus`, order: 3), and Foreman (`atlas`, order: 4), then the remaining agents follow.

Your explicit configuration always wins. If you set a specific model for an agent, that choice takes precedence even when resolution data is cold.

Variant and `reasoningEffort` overrides are normalized to model-supported values, so cross-provider overrides degrade gracefully instead of failing hard.

Model capabilities are models.dev-backed, with a refreshable cache and capability diagnostics. Use `bunx oh-my-crew refresh-model-capabilities` to update the cache, or configure `model_capabilities.auto_refresh_on_start` to refresh at startup.

To see which models your agents will actually use, run `bunx oh-my-crew doctor`. This shows effective model resolution based on your current authentication and config.

```
Agent Request → User Override (if configured) → Fallback Chain → System Default
```

### File-Based Prompts

You can load agent system prompts from external files using `file://` URLs in the `prompt` field, or append additional content with `prompt_append`. The `prompt_append` field also works on categories.

```jsonc
{
  "agents": {
    // Captain; internal config key remains "sisyphus"
    "sisyphus": {
      "prompt": "file:///path/to/custom-prompt.md"
    },
    // Sage; internal config key remains "oracle"
    "oracle": {
      "prompt_append": "file:///path/to/additional-context.md"
    }
  },
  "categories": {
    "deep": {
      "prompt_append": "file:///path/to/deep-category-append.md"
    }
  }
}
```

The file content is loaded at runtime and injected into the agent's system prompt. Supports `~` expansion for home directory and relative `file://` paths.

---

## See Also

- [Installation Guide](./installation.md) — Setup and authentication
- [Orchestration System Guide](./orchestration.md) — How agents dispatch tasks to categories
- [Configuration Reference](../reference/configuration.md) — Full config options
- [`src/shared/model-requirements.ts`](../../src/shared/model-requirements.ts) — Source of truth for fallback chains
