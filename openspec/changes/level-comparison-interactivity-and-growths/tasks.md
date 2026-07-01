# Checklist

## 1. Pre-flight

- [x] **Pre-flight: record quality gate baselines**
  - Scope: no code edits; writes only under `.ralph/baselines/`
  - Change: Capture current state of all gates later tasks require.
  - Done when:
    - `.ralph/baselines/level-comparison-interactivity-and-growths-test.txt` exists (captured via `mkdir -p .ralph/baselines && npm test > .ralph/baselines/level-comparison-interactivity-and-growths-test.txt 2>&1; echo "EXIT=$?" >> .ralph/baselines/level-comparison-interactivity-and-growths-test.txt`)
    - `.ralph/baselines/level-comparison-interactivity-and-growths-lint.txt` exists (captured via `npm run lint > .ralph/baselines/level-comparison-interactivity-and-growths-lint.txt 2>&1; echo "EXIT=$?" >> .ralph/baselines/level-comparison-interactivity-and-growths-lint.txt`)
    - `.ralph/baselines/level-comparison-interactivity-and-growths-typecheck.txt` exists (captured via `npx tsc --noEmit > .ralph/baselines/level-comparison-interactivity-and-growths-typecheck.txt 2>&1; echo "EXIT=$?" >> .ralph/baselines/level-comparison-interactivity-and-growths-typecheck.txt`)
    - `.ralph/baselines/level-comparison-interactivity-and-growths-build.txt` exists (captured via `npm run build > .ralph/baselines/level-comparison-interactivity-and-growths-build.txt 2>&1; echo "EXIT=$?" >> .ralph/baselines/level-comparison-interactivity-and-growths-build.txt`)
    - every captured gate file ends with a literal `EXIT=<integer>` line
    - `.ralph/baselines/level-comparison-interactivity-and-growths-readme.md` exists and lists passing/failing gates, exit codes, and exact failing identifiers
  - Stop and hand off if:
    - any gate is nondeterministic across two runs
    - any captured baseline file is missing the `EXIT=<integer>` final line after retrying the capture command

## 2. Implementation

- [x] **Implement interactive skill pills and effective growth rates comparison table in LevelComparison**
  - Scope: `components/features/LevelComparison.tsx`
  - Change: Modify `LevelComparison` component to resolve and pass `game` and `variant` props to `SkillPill` components inside the skill lists, and render a side-by-side growth rates comparison table comparing the effective growth rates of both units at their chosen steps.
  - Done when:
    - `components/features/LevelComparison.tsx` imports `getEffectiveGrowths` from `@/lib/stats`.
    - `components/features/LevelComparison.tsx` resolves class skill variants using a helper or database lookup and passes both `game` and `variant` props to `SkillPill` components inside "Has Skills" and "Possible Skills" lists.
    - `components/features/LevelComparison.tsx` defines and renders the effective growths table structure below the stats table.
    - `npx tsc --noEmit` exits 0, or failures match `.ralph/baselines/level-comparison-interactivity-and-growths-typecheck.txt` with no new failures in `components/features/LevelComparison.tsx`.
  - Stop and hand off if:
    - `npx tsc --noEmit` reports compilation errors originating in files outside the scope of this task (e.g. in `lib/stats.ts`) that were not present in the pre-flight baseline

- [x] **Add unit tests for interactive skill pills and growth rates table in LevelComparison.test.tsx**
  - Scope: `__tests__/components/features/LevelComparison.test.tsx`
  - Change: Add unit tests verifying growth rates table rendering, high growth highlights, difference calculations, and interactive skill pills behavior.
  - Done when:
    - `__tests__/components/features/LevelComparison.test.tsx` contains a test suite for "Growth rate section" and test cases verifying that `SkillPill` receives the resolved `variant` and `game` props.
    - `npx jest __tests__/components/features/LevelComparison.test.tsx` exits 0.
    - `npx tsc --noEmit` exits 0, or failures match `.ralph/baselines/level-comparison-interactivity-and-growths-typecheck.txt` with no new failures in `__tests__/components/features/LevelComparison.test.tsx`.
  - Stop and hand off if:
    - `npx jest` fails due to unexpected runtime exceptions, mock data issues, or React rendering errors unrelated to the test file itself

## 3. Final Quality Gates

- [ ] **Final quality gate: all pre-flight gates pass or match baseline**
  - Scope: full repository; no code edits in this task
  - Change: All repository quality gates are verified clean.
  - Done when:
    - `npm test` exits 0, or failures match `.ralph/baselines/level-comparison-interactivity-and-growths-test.txt` with no new failures.
    - `npm run lint` exits 0, or failures match `.ralph/baselines/level-comparison-interactivity-and-growths-lint.txt` with no new failures.
    - `npx tsc --noEmit` exits 0, or failures match `.ralph/baselines/level-comparison-interactivity-and-growths-typecheck.txt` with no new failures.
    - `npm run build` exits 0, or failures match `.ralph/baselines/level-comparison-interactivity-and-growths-build.txt` with no new failures.
  - Stop and hand off if:
    - any new failure identifier appears in any quality gate compared to the corresponding pre-flight baseline file

## Manual verification (operator-only, post-loop)

> Run after the loop completes and all implementer checkboxes are checked.
> `ralph-run` does NOT iterate on this section. These items exist to give the
> operator a single batched acceptance pass against the finished change.

- [op] **Verify growth rate section and interactive skill pills on UI**
  - Open `/comparator`, select Robin and Sully.
  - Verify that the "Effective Growth Rates" comparison table displays below the stats table and highlights Robin's higher growth rates (such as Robin's higher Magic growth of 50% vs Sully's 15%).
  - Click on the "Veteran" skill pill under Robin's "Has Skills" and verify that the detail modal opens showing name, type, and description.
