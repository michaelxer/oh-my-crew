<div align="center">

# Oh My Crew

### A role-based agent fork of [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)

Clean, role-descriptive agent names with content-filter-safe system prompts for AI proxy providers.

[![npm version](https://img.shields.io/npm/v/oh-my-crew)](https://www.npmjs.com/package/oh-my-crew)
[![GitHub stars](https://img.shields.io/github/stars/michaelxer/oh-my-crew?style=social)](https://github.com/michaelxer/oh-my-crew)
[![npm downloads](https://img.shields.io/npm/dm/oh-my-crew)](https://www.npmjs.com/package/oh-my-crew)

[English](README.md) | [Bahasa Indonesia](README.id.md)

</div>

---

## What is this?

**Oh My Crew** is a fork of [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) (by [@code-yeongyu](https://github.com/code-yeongyu)) with the following modifications:

1. **System prompts adjusted** to pass through AI proxy content filters
2. **All agents renamed** to clean, role-descriptive crew names -- no political, cultural, or mythological references

### Agent Roster

| Original | Crew Name | Role |
|----------|-----------|------|
| Sisyphus | **Captain** | Main orchestrator. Steers the ship. |
| Hephaestus | **Strategist** | Autonomous deep worker. Plans and executes. |
| Oracle | **Sage** | Read-only consultant. Wisdom without action. |
| Librarian | **Scribe** | External docs search. Finds written knowledge. |
| Explore | **Scout** | Codebase search. Reconnaissance specialist. |
| Atlas | **Foreman** | Todo orchestrator. Keeps work on track. |
| Prometheus | **Architect** | Strategic planner. Designs before building. |
| Metis | **Advisor** | Pre-planning consultant. Identifies risks. |
| Momus | **Auditor** | Plan reviewer/critic. The quality gate. |
| Sisyphus-Junior | **Cadet** | Task executor. Follows orders. |
| Multimodal Looker | **Lookout** | Vision/PDF analysis. Sharp-eyed observer. |

### Content Filter Fix

The phrase `"Powerful AI Agent"` combined with identity override directives triggers some AI proxy content filters. This fork replaces it with softer phrasing that passes through.

---

## Installation

### Prerequisites

- [OpenCode](https://opencode.ai/docs) installed
- [Node.js](https://nodejs.org/) installed (includes npm)

### Step 1: Add to plugin config

Edit `~/.config/opencode/opencode.json` (or `opencode.jsonc`) and add `"oh-my-crew"` to the plugin array:

```json
{
  "plugin": ["oh-my-crew"]
}
```

> **Replacing oh-my-openagent?** Use `"oh-my-crew"` only -- it includes everything OMO has. Remove `"oh-my-openagent@latest"` to avoid duplicate agents in the dropdown.
>
> **Want both?** You can run both side by side: `"plugin": ["oh-my-openagent@latest", "oh-my-crew"]` -- you'll see duplicate agents (Sisyphus + Captain, etc.) but both work fine.

### Step 2: Restart OpenCode

OpenCode will auto-install the plugin from npm on startup. If the crew agents don't appear, install manually:

```bash
cd ~/.config/opencode
npm install oh-my-crew
```

Then restart OpenCode again.

### Step 3: Verify

```bash
opencode
# You should see Captain, Strategist, Sage, etc. in the agent dropdown
# Type "ultrawork" to activate all agents
```

### Configure your proxy provider

```json
{
  "provider": {
    "your-proxy": {
      "type": "openai",
      "url": "http://your-proxy:port/v1",
      "key": "your-api-key"
    }
  }
}
```

---

## Install from source (for developers)

Only needed if you want to modify the code:

```bash
git clone https://github.com/michaelxer/oh-my-crew.git
cd oh-my-crew
bun install
bun run build
bun link
```

Then add `"oh-my-crew"` to your `opencode.json` plugin array.

---

## Upstream Features

This fork inherits all features from oh-my-openagent:

| Feature | Description |
|---------|-------------|
| **Discipline Agents** | Captain orchestrates Strategist, Sage, Scribe, Scout in parallel |
| **`ultrawork` / `ulw`** | One word activates every agent. Runs until done |
| **IntentGate** | Analyzes true user intent before acting |
| **Hash-Anchored Edits** | `LINE#ID` content hash validates every change. Zero stale-line errors |
| **LSP + AST-Grep** | IDE-precision refactoring for agents |
| **Background Agents** | 5+ specialists running in parallel |
| **Built-in MCPs** | Exa (web search), Context7 (docs), Grep.app (GitHub search) |
| **Ralph Loop** | Self-referential loop until 100% done |
| **Architect Planner** | Interview-mode strategic planning before execution |
| **Claude Code Compatible** | All hooks, commands, skills, MCPs work unchanged |
| **Session Guardian** | Auto git checkpoints, context monitoring, structured handoff docs |

For full documentation, see the [upstream project](https://github.com/code-yeongyu/oh-my-openagent).

---

## Syncing with Upstream

This is a proper GitHub fork. To pull latest upstream changes:

```bash
git remote add upstream https://github.com/code-yeongyu/oh-my-openagent.git
git fetch upstream
git merge upstream/dev
```

---

## Credits

This project is based on:

- **[oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)** by **[@code-yeongyu](https://github.com/code-yeongyu)** (YeonGyu Kim) -- the original architecture, agents, tools, hooks, and all core features

This fork renames all agents from mythological/cultural names to clean, role-descriptive crew names while preserving all upstream functionality.

- **Original repo**: [github.com/code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)
- **npm (this fork)**: [oh-my-crew](https://www.npmjs.com/package/oh-my-crew)
- **npm (original)**: [oh-my-opencode](https://www.npmjs.com/package/oh-my-opencode)
- **License**: [SUL-1.0](LICENSE.md) (inherited from upstream)
- **Discord**: [Join the community](https://discord.gg/PUwSMR9XNk)

---

## License

This fork follows the same [SUL-1.0 license](LICENSE.md) as the upstream project.
See [NOTICE.md](NOTICE.md) for modification details as required by the license.
