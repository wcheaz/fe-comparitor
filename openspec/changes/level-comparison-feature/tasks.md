# Checklist

## 1. Pre-flight

- [x] **Pre-flight: record quality gate baselines**
  - Scope: no code edits; writes only under `.ralph/baselines/`
  - Change: Capture current state of all gates later tasks require.
  - Done when:
    - `.ralph/baselines/level-comparison-feature-test.txt` exists (captured via `npm test > .ralph/baselines/level-comparison-feature-test.txt 2>&1; echo "EXIT=$?" >> .ralph/baselines/level-comparison-feature-test.txt`)
    - `.ralph/baselines/level-comparison-feature-lint.txt` exists (captured via `npm run lint > .ralph/baselines/level-comparison-feature-lint.txt 2>&1; echo "EXIT=$?" >> .ralph/baselines/level-comparison-feature-lint.txt`)
    - `.ralph/baselines/level-comparison-feature-typecheck.txt` exists (captured via `npx tsc --noEmit > .ralph/baselines/level-comparison-feature-typecheck.txt 2>&1; echo "EXIT=$?" >> .ralph/baselines/level-comparison-feature-typecheck.txt`)
    - `.ralph/baselines/level-comparison-feature-build.txt` exists (captured via `npm run build > .ralph/baselines/level-comparison-feature-build.txt 2>&1; echo "EXIT=$?" >> .ralph/baselines/level-comparison-feature-build.txt`)
    - every captured gate file ends with a literal `EXIT=<integer>` line
    - `.ralph/baselines/level-comparison-feature-readme.md` exists and lists passing/failing gates, exit codes, and exact failing identifiers
  - Stop and hand off if:
    - any gate is nondeterministic across two runs
    - any captured baseline file is missing the `EXIT=<integer>` final line after retrying the capture command

## 2. Component Implementation

- [x] **Implement LevelComparison component with unit tests**
  - Scope: `components/features/LevelComparison.tsx`, `__tests__/components/features/LevelComparison.test.tsx`
  - Change: Create the new component displaying dropdown selectors for both selected units populated from their progression array levels, a side-by-side stats comparison table highlighting higher/capped stats with difference deltas, and Awakening skill categorization split into "Has Skills" and "Possible Skills" with zero overlap.
  - Done when:
    - File `components/features/LevelComparison.tsx` exists and exports the `LevelComparison` component.
    - File `__tests__/components/features/LevelComparison.test.tsx` exists.
    - `npx jest __tests__/components/features/LevelComparison.test.tsx` exits 0.
    - `npx tsc --noEmit` exits 0, or failures match `.ralph/baselines/level-comparison-feature-typecheck.txt` with no new failures in `components/features/LevelComparison.tsx`.
  - Stop and hand off if:
    - `npx tsc --noEmit` reports compilation errors originating in files outside the scope of this task (e.g. in `lib/stats.ts` or `lib/skills.ts`) that were not present in the pre-flight baseline
    - Jest unit tests fail due to unexpected runtime exceptions, dynamic import errors, or structural mismatch in mock unit data

## 3. Integration

- [x] **Mount LevelComparison component in comparator page**
  - Scope: `app/comparator/page.tsx`
  - Change: Mount the `LevelComparison` component right above the progression stats table on the comparator page when exactly 2 units are selected.
  - Done when:
    - `rg "import.*LevelComparison" app/comparator/page.tsx` exits 0.
    - `rg "<LevelComparison" app/comparator/page.tsx` exits 0.
    - `npx tsc --noEmit` exits 0, or failures match `.ralph/baselines/level-comparison-feature-typecheck.txt` with no new failures in `app/comparator/page.tsx`.
  - Stop and hand off if:
    - `npx tsc --noEmit` reports errors in files outside the scope of this task (e.g. `components/features/LevelComparison.tsx`) that cannot be resolved without modifying files outside this task's scope

## 4. Final Quality Gates

- [ ] **Final quality gate: all pre-flight gates pass or match baseline**
  - Scope: full repository; no code edits in this task
  - Change: All repository quality gates are verified clean.
  - Done when:
    - `npm test` exits 0, or failures match `.ralph/baselines/level-comparison-feature-test.txt` with no new failures.
    - `npm run lint` exits 0, or failures match `.ralph/baselines/level-comparison-feature-lint.txt` with no new failures.
    - `npx tsc --noEmit` exits 0, or failures match `.ralph/baselines/level-comparison-feature-typecheck.txt` with no new failures.
    - `npm run build` exits 0, or failures match `.ralph/baselines/level-comparison-feature-build.txt` with no new failures.
  - Stop and hand off if:
    - any new failure identifier appears in any quality gate compared to the corresponding pre-flight baseline file

## Manual verification (operator-only, post-loop)

> Run after the loop completes and all implementer checkboxes are checked.
> `ralph-run` does NOT iterate on this section. These items exist to give the
> operator a single batched acceptance pass against the finished change.

- [op] **Verify independent level selectors side-by-side on UI**
  - Open `/comparator`, select Robin and Frederick, choose Robin at level 20 unpromoted and Frederick at level 10 promoted.
  - Verify that stats, differences, and highlights update correctly.
  - Verify that Robin's "Has Skills" displays `Veteran` and `Solidarity`, and `Veteran`/`Solidarity` are NOT in "Possible Skills".

