# Deferred Work

<!-- Append-only. Populated by bmad-dev-auto step-04 when a review finding is
     triaged as `defer` — a real, pre-existing issue not caused by the story
     under review, surfaced incidentally. Do not modify existing entries. -->

- source_spec: `_bmad-output/implementation-artifacts/spec-area-converter.md`
  summary: `useToolState.patch()` has asymmetric validation-failure behavior — the initial URL-parse path falls back to full `defaults` on a zod failure, but the live `patch()` write path falls back to the raw unvalidated merged object instead, so an out-of-bounds live-typed value (e.g. exceeding a schema's `.max()`) is kept as real React state and written to the URL rather than being clamped or rejected.
  evidence: confirmed by reading `src/lib/tools/useToolState.ts:41-68` — `const next = parsed.success ? parsed.data : merged;` in the `patch` callback keeps `merged` (unvalidated) on parse failure, versus the initializer's `return parsed.success ? parsed.data : defaults;`. Predates this story (built in the EMI/chassis story); affects every tool using the hook, including EMI. Worth a deliberate hardening pass across the shared hook rather than a per-tool workaround.

- source_spec: `_bmad-output/implementation-artifacts/spec-area-converter.md`
  summary: no unit test runner is configured in the repo, so `compute.ts` modules that advertise themselves as "pure, deterministic, unit-testable" (AD-4) are currently only verified by hand/throwaway scripts, not an actual test suite.
  evidence: confirmed no jest/vitest/test config in `package.json`; identical gap already explicitly acknowledged in `_bmad-output/implementation-artifacts/1-1-chassis-emi-calculator.md`'s Testing Standards section and the architecture spine's own "Deferred" section ("Testing strategy for `compute()`... the runner/coverage bar is a build-phase decision, not an invariant"). Not new to this story.
