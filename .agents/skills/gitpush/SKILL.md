---
name: gitpush
description: Commit and push authorized repository changes after inspecting the diff and running appropriate checks. Use when the user requests gitpush, commit and push, or shipping a verified change to GitHub.
---

# Git push

Carry out the user's authorized commit and push in the current repository.

1. Read applicable AGENTS.md instructions. Inspect `git status --short`, the current branch, remotes, recent commits and the working diff. Preserve unrelated user changes. Never print credentials or inspect secret files.
2. Identify the destination from the explicit user request, established session workflow, or configured upstream. If no destination can be established, ask for the branch; never guess a production target. A session-authorized explicit destination is valid even when the local branch has no upstream.
3. Complete implementation and run repository checks appropriate to the change: content validation, typecheck, lint, unit tests, production build and browser tests when relevant. Fix failures introduced by this work. Report unavailable checks honestly.
4. Review `git diff --check` and `git diff --stat`. Stage only task-owned files, including this skill if its creation was requested. Do not stage credentials, generated build outputs, node_modules, or unrelated work.
5. Commit with a concise message describing the final change. Do not amend existing commits without authorization.
6. Fetch the destination ref and verify the new commit contains its current tip. Push normally, using an explicit `HEAD:<destination>` ref when appropriate. Never force-push or overwrite a diverged remote. If the destination advanced, integrate safely and rerun checks affected by the integration.
7. Verify the push by comparing the remote ref SHA to the local commit. Where GitHub-triggered deployment is part of the established workflow, inspect the commit's deployment status and verify the deployed changed page. Do not claim deployment success from a successful push alone.
8. Report the commit, branch, meaningful validation and deployment result. If blocked by authentication or permissions, state the exact action and observed error without exposing secrets.

Do not ask for another confirmation when the user already authorized commit/push and the destination is established. Do not merge or switch publication statuses solely because this skill was invoked.
