import type { BuiltinSkill } from "../types"

export const sessionGuardianSkill: BuiltinSkill = {
	name: "session-guardian",
	description:
		"Autonomous session lifecycle manager. Auto-checkpoints work via git commits after each task completion, monitors context window usage, generates structured handoff documents when context gets large, provides copy-paste prompts for seamless session continuation, and protects sensitive credentials from git exposure. Ensures no work is lost and agents can work continuously across sessions. Triggers: always active for primary agents.",
	template: `# Session Guardian - Autonomous Session Lifecycle Manager

You have the Session Guardian skill loaded. Follow these rules AT ALL TIMES during this session. They are non-negotiable.

---

## 1. GIT CHECKPOINT PROTOCOL

After completing EACH todo item or task/checklist item:

1. Check if the project has a git repo: look for \`.git/\` directory
2. If git repo exists:
   - \`git add -A\` (stage all changes)
   - \`git commit -m "<type>: <short description of what was completed>"\`
   - Use conventional commit types: feat, fix, refactor, docs, chore, test
   - Example: \`git commit -m "feat: add risk management module"\`
3. If NO git repo exists: skip git operations entirely, do not create one
4. Mark the todo item as completed AFTER the commit succeeds

CHECKPOINT RULES:
- ONE commit per completed task/todo item — not per file, not per session
- Never batch multiple tasks into one commit
- Never commit mid-task (incomplete work)
- If a commit fails, fix the issue and retry before moving to the next task
- Do NOT push to remote unless the user explicitly asks

---

## 2. CREDENTIALS PROTECTION

When a project requires sensitive information (API keys, tokens, passwords, login credentials, database URLs, etc.):

### Setup (first time only):
1. Check if \`.credentials/\` folder exists in the project root
2. If not, create it
3. Check if \`.credentials/\` is in \`.gitignore\`. If not, add it
4. Create a \`.credentials/README.md\` with:
   \`\`\`
   # Credentials

   This folder contains sensitive information (API keys, tokens, passwords).
   It is excluded from git via .gitignore.

   DO NOT commit this folder or its contents to any repository.
   \`\`\`

### Rules:
- ALL sensitive data goes in \`.credentials/\` — never in source code, never in config files that get committed
- Use descriptive filenames: \`.credentials/openai-api.env\`, \`.credentials/database.json\`, \`.credentials/aws-config.env\`
- When code needs credentials, read from \`.credentials/\` or reference environment variables
- NEVER hardcode secrets in source files, even temporarily
- NEVER commit \`.credentials/\` to git, even if the user asks — warn them instead
- If you find credentials hardcoded in existing code, move them to \`.credentials/\` and update the code to read from there

### .gitignore entries managed by Session Guardian:
\`\`\`
HANDOFF_DOC/
.credentials/
\`\`\`

---

## 3. CONTEXT WINDOW MONITORING

You cannot directly read your token usage percentage. Instead, use these PROXY SIGNALS to estimate context consumption:

### Heuristic Indicators (check after each task completion):
- **Message count**: Count the approximate number of back-and-forth messages in this session
- **Todo progress**: How many todo items have you completed vs total?
- **File operations**: How many files have you read, edited, or created?
- **Tool calls**: Roughly how many tool calls have you made?

### Context Size Estimation Table:

| Signal | Low Context (<50%) | Medium Context (50-65%) | High Context (65-75%) | Critical (>75%) |
|--------|-------------------|------------------------|----------------------|-----------------|
| Messages | < 15 exchanges | 15-30 exchanges | 30-50 exchanges | 50+ exchanges |
| Todos completed | 1-3 items | 4-6 items | 7-10 items | 10+ items |
| Files touched | < 10 files | 10-20 files | 20-35 files | 35+ files |
| Tool calls | < 30 | 30-60 | 60-100 | 100+ |

If TWO OR MORE signals indicate "High Context" or above, treat the session as approaching the handoff threshold.

### System Context Warning:
The system may inject a context window warning message like:
\`[Context Status: XX% used (N/M tokens), YY% remaining]\`

If you see this message, use the ACTUAL percentage instead of heuristics.

---

## 4. HANDOFF DECISION MATRIX

After completing each task/todo item, evaluate:

| Context Level | Task Status | Action |
|---------------|-------------|--------|
| Low (<50%) | Any | Continue working normally |
| Medium (50-65%) | Any | Continue working, be aware |
| High (65-69%) | Task just completed | **STOP. Do NOT start next task. Proceed to handoff.** |
| High (65-69%) | Mid-task | Continue, finish this task, then handoff |
| Critical (70%+) | Task just completed | **IMMEDIATELY handoff** |
| Critical (70%+) | Mid-task | Finish current task ASAP, then handoff |

### THE GOLDEN RULE:
**Never interrupt a task in progress to create a handoff. Always finish the current task first.**
**But once a task is done and context is high — do NOT start the next task. Handoff instead.**

It is better to handoff slightly early (at 65%) than to run out of context mid-task and lose work.

---

## 5. HANDOFF PROCEDURE

When the decision matrix says to handoff:

### Step 1: Final Git Checkpoint
Commit all current work (following the checkpoint protocol above).

### Step 2: Create HANDOFF_DOC Folder
- Check if \`HANDOFF_DOC/\` folder exists in the project root
- If not, create it
- Check if \`HANDOFF_DOC/\` is in \`.gitignore\`. If not, add it:
  \`\`\`
  echo "HANDOFF_DOC/" >> .gitignore
  \`\`\`

### Step 3: Determine Handoff Number
- List existing files in \`HANDOFF_DOC/\`
- Find the highest number in existing \`handoff-NNN.md\` files
- Increment by 1 for the new file
- First handoff = \`handoff-001.md\`

### Step 4: Generate Handoff Document
Write the handoff file to \`HANDOFF_DOC/handoff-NNN.md\` using this EXACT format:

\`\`\`
HANDOFF CONTEXT
===============

SESSION INFO
------------
- Handoff number: NNN
- Timestamp: YYYY-MM-DD HH:MM (local timezone)
- Context level at handoff: estimated percentage or heuristic level
- Tasks completed this session: N of M total

USER REQUESTS (AS-IS)
---------------------
- [Exact verbatim user requests from the ORIGINAL session - NOT paraphrased]
- [Include requests carried forward from previous handoffs]

GOAL
----
[One sentence: what is the overall project objective]

WORK COMPLETED (this session)
-----------------------------
- [x] Task 1: description
- [x] Task 2: description
- [x] Task N: description (last completed)

WORK COMPLETED (previous sessions)
-----------------------------------
- [x] Tasks from handoff-001: brief summary
- [x] Tasks from handoff-002: brief summary
[Accumulate from previous handoff docs if they exist]

PENDING TASKS
-------------
- [ ] Task N+1: description <-- RESUME HERE
- [ ] Task N+2: description
- [ ] Task N+3: description
[Include ALL remaining tasks, not just the next one]

GIT STATE
---------
- Branch: branch-name
- Last commit: hash "commit message"
- All changes committed: yes/no
- Remote push status: pushed/not pushed

KEY FILES
---------
- path/to/file1 - brief role description
- path/to/file2 - brief role description
[Maximum 10 files, prioritized by importance to remaining work]

IMPORTANT DECISIONS
-------------------
- [Technical decisions made across ALL sessions, not just this one]
- [Include decisions from previous handoffs]
- [Why certain approaches were chosen over alternatives]

PATTERNS AND CONVENTIONS
------------------------
- [Code patterns established that the next session must follow]
- [Naming conventions, file structure, architecture decisions]
- [Testing approach, build commands, etc.]

EXPLICIT CONSTRAINTS
--------------------
- [Verbatim constraints from the user]
- [Technical constraints discovered during work]
- If none: "None"

BLOCKERS AND WARNINGS
---------------------
- [Known issues the next session should be aware of]
- [Things that were tried and failed]
- [External dependencies or requirements]
- If none: "None"

CONTEXT FOR CONTINUATION
------------------------
- [What the next session needs to know to continue seamlessly]
- [Any setup or environment state]
- [References to documentation if relevant]
\`\`\`

### Step 5: Read Previous Handoffs
If previous handoff files exist in \`HANDOFF_DOC/\`, READ THEM to carry forward:
- Accumulated completed work from all sessions
- Important decisions from all sessions
- Original user requests
- Patterns and conventions

This ensures the handoff chain preserves ALL context, not just the current session.

### Step 6: Output the Continuation Prompt

After saving the handoff file, output this to the user:

\`\`\`
---

Handoff saved to HANDOFF_DOC/handoff-NNN.md
All work committed to git.

NEXT SESSION - copy and paste this into a new chat:
====================================================

"Continue working on [PROJECT NAME]. Read HANDOFF_DOC/handoff-NNN.md for full context. Resume from [NEXT TASK DESCRIPTION]. Use ultrawork mode."

====================================================
\`\`\`

Replace [PROJECT NAME] with the actual project name.
Replace [NEXT TASK DESCRIPTION] with the specific next task from the pending list.
Replace NNN with the actual handoff number.

### Step 7: STOP
After outputting the continuation prompt, STOP WORKING. Do not start the next task. Do not do "one more thing." The session is done.

---

## 6. WHEN RESUMING FROM A HANDOFF

If the user's message references a handoff file (e.g., "Read HANDOFF_DOC/handoff-003.md"):

1. Read the handoff file FIRST before doing anything else
2. Read any previous handoff files referenced in it for full history
3. Reconstruct the todo list from PENDING TASKS
4. Verify git state matches what the handoff describes
5. Resume from the exact task indicated
6. Continue following ALL Session Guardian rules (checkpoints, monitoring, handoff)

---

## 7. EMERGENCY HANDOFF

If you notice ANY of these signs, trigger an immediate handoff after the current task:

- You're re-reading files you already read earlier in the session
- You're forgetting decisions made earlier in the conversation
- Your responses are getting shorter or less detailed
- You're making mistakes on things that should be straightforward
- The system injects a context window warning

These are signs of context degradation. Handoff immediately.

---

## 8. RULES SUMMARY

1. ALWAYS commit after each completed task (if git repo exists)
2. NEVER put credentials in source code — use .credentials/ folder
3. NEVER interrupt a task to handoff — finish it first
4. NEVER start a new task if context is high (65%+) — handoff instead
5. ALWAYS carry forward context from previous handoffs
6. ALWAYS provide a copy-paste continuation prompt
7. ALWAYS stop after creating a handoff — no "one more thing"
8. The handoff file is the source of truth for the next session`,
}
