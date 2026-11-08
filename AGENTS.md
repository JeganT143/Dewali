<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Deepavali Microsite — Multi-Agent Development Guide
Product objective
Build one personal, interactive Tamil Deepavali greeting microsite that Jegan can share with friends and family using one common URL.

This is a greeting experience, not a card creator, card generator, dashboard, SaaS product, or personalization platform.
Non-negotiable product requirements
- Use Vilakku (விளக்கு) and Agal Vilakku (அகல் விளக்கு). Never use the word "Diya" in UI copy, source identifiers, component names, comments, or documentation.
- The central interaction is lighting a traditional Tamil Agal Vilakku.
- Include festive, playful moments such as traditional sweets (laddu, adhirasam, Mysore Pak, murukku, jangiri), safe virtual crackers/fireworks, and warm family/friends wishes.
- Include a genuine personal sign-off: With love and warm wishes, Jegan.
- Use the approved yellow/orange/gold palette with deep brown backgrounds.
- Mobile-first, accessible, performant, and deployable to Vercel.
- All visitors receive the same greeting and same URL. No recipient/sender forms, custom messages, card editor, personalized URLs, themes, PNG card export, authentication, or database.
How to use the agents
The primary Claude Code session is the Lead Orchestrator. It owns the plan, integration, shared architecture, final decisions, and final verification.

Use the specialist agents in .claude/agents/ for bounded work. Delegate independent tasks in parallel where practical, but do not let multiple agents edit the same files at the same time.
Specialist agents
1. visual-experience — visual system, page composition, responsive UI and decorative assets.
2. interaction-engineer — Vilakku, sweets, virtual fireworks and interaction state/animation.
3. content-cultural-reviewer — English/Tamil greeting copy, cultural terminology and content consistency.
4. qa-accessibility — tests, accessibility, responsive verification, performance and regression review.
Parallelization rules
- Start with a short repository inspection and a task breakdown.
- Delegate only tasks with clear inputs, outputs, and file ownership.
- Agents may inspect shared files, but each implementation task must have a clearly assigned write scope.
- Do not assign two agents to edit the same component, stylesheet, page, package manifest, or configuration file concurrently.
- The Lead Orchestrator owns src/app/page.tsx, src/app/layout.tsx, shared app integration, package scripts/dependencies, global architecture, and final merges unless it explicitly assigns ownership.
- Prefer parallel research/review tasks first. Start parallel implementation only when file ownership is non-overlapping.
- Ask agents to report changed files, assumptions, tests run, and unresolved issues.
- Review every agent's changes before integrating them. Do not blindly accept generated code.
- If agents identify conflicting approaches, the Lead Orchestrator decides and records the decision.
- Do not create extra agents for trivial tasks. Keep the team small and purposeful.
Suggested execution sequence
Phase 0 — Inspect and plan
Lead Orchestrator:
- Inspect the existing repository, CLAUDE.md, package scripts, and current implementation.
- Identify card-builder functionality to remove and reusable work to preserve.
- Assign non-overlapping work to specialists.
- Do not rewrite the project blindly.
Phase 1 — Parallel review
- content-cultural-reviewer: audit all visible copy and terminology; propose corrected concise copy.
- visual-experience: audit current layout, design tokens, responsiveness and visual gaps.
- interaction-engineer: audit existing interactive behavior and propose the smallest robust interaction model.
- qa-accessibility: inspect current tests, accessibility, performance and likely regressions.
The Lead Orchestrator reviews findings and defines implementation boundaries.
Phase 2 — Implementation
Implement in parallel only where file ownership is separate. Suggested ownership:
- Visual agent: visual components and decorative assets assigned by the lead.
- Interaction agent: interaction components/hooks assigned by the lead.
- Content agent: copy/constants/localized text files only; no page/layout ownership.
- QA agent: tests and review notes; do not modify production components unless explicitly assigned.
The Lead Orchestrator integrates components and owns shared files.
Phase 3 — Integration and verification
- Run formatting/lint, TypeScript, unit tests, browser tests, and production build.
- Verify mobile and desktop.
- Verify Tamil glyph rendering and text overflow.
- Verify reduced-motion behavior and keyboard interaction.
- Verify WhatsApp URL construction, native share fallback, and copy-link feedback.
- Verify the Vilakku, sweets and virtual fireworks interactions.
- Remove unused card-builder code, dependencies and tests.
- Report what was actually tested; do not claim unverified mobile-device behavior.
Design direction
Palette
- Deep Brown: #211207
- Dark Brown: #3B1F0D
- Saffron: #E87518
- Festival Orange: #F28C28
- Golden Yellow: #FFC928
- Warm Gold: #FFE082
- Cream: #FFF5DC
Typography
- Cormorant Garamond for English display headings.
- Noto Serif Tamil for Tamil display/greeting copy.
- Hind Madurai for interface text where suitable.
- Use next/font where compatible with the existing setup.
Experience flow
1. Arrival: dark festive scene, greeting, traditional Agal Vilakku, invitation to light it.
2. Vilakku: flame ignition, golden illumination and restrained particle burst.
3. Sweets: interactive traditional sweets with short playful messages.
4. Crackers: safe virtual sparkler/fireworks interactions; no real-world unsafe instructions.
5. Family and friends: warm, sincere wishes.
6. Final greeting: full message and personal sign-off from Jegan.
7. Share: WhatsApp, native share where supported, and copy the one common URL.
Do not force visitors through a long wizard. The experience should be easy to explore and take roughly 1–2 minutes.
Copy requirements
Primary greeting:
- Happy Deepavali!
- இனிய தீபாவளி நல்வாழ்த்துக்கள்!
Suggested message:
"May this Deepavali fill your life with happiness, your home with laughter, your heart with peace and your future with endless opportunities."

Final sign-off:
"With love and warm wishes,
Jegan"

Playful copy examples:
- "One laddu? That's just the beginning!"
- "Calories don't count on Deepavali!"
- "Save some for the others... if you can!"
- "Diet starts tomorrow!"
- "Happiness levels exceeding 100%!"
- "Make some noise... but keep it safe!"
Tamil copy beyond the supplied greeting should be reviewed carefully. Do not invent culturally specific claims or present unverified Tamil as professionally validated.
Engineering standards
- Follow existing repository conventions; do not introduce a new framework or unnecessary dependencies.
- Use TypeScript strictly and reusable components with clear responsibilities.
- Keep animation efficient; prefer CSS/SVG and use Canvas only where it adds value.
- Respect prefers-reduced-motion.
- Pause expensive animation loops when the document is hidden.
- Use semantic HTML, accessible names, visible focus states, and keyboard support.
- Avoid layout shifts and oversized client bundles.
- No backend, database, authentication, analytics, or user accounts are needed.
- Keep all share actions pointed at the same canonical site URL.
- Never use unsafe HTML injection for greeting content.
- Keep Vercel deployment straightforward.
Definition of done
- The site is a personal greeting microsite, not a builder.
- The word "Diya" does not appear in user-facing text or project-authored source/docs.
- The Vilakku interaction works with pointer, touch, Enter and Space.
- Sweets interactions display playful feedback.
- Virtual fireworks are safe, short, and disabled/reduced under reduced-motion settings.
- The greeting includes Jegan's personal sign-off.
- WhatsApp, native share (when supported), and copy-link actions work as implemented.
- Tamil and English render correctly without clipping.
- Mobile and desktop layouts are polished.
- Lint, type-check, tests and production build pass, or remaining failures are documented precisely.
- No unused card-creator features remain.
Final reporting format
At the end, report:
1. Completed work and milestone progress.
2. Agents used and their responsibilities.
3. Files created, changed and removed.
4. Tests actually run and results.
5. Known limitations and anything requiring a real-device check.
6. Local run commands and Vercel deployment steps.
7. Overall completion percentage.
The Lead Orchestrator is accountable for the final product. Agents provide focused work; they do not replace integration or final review.
