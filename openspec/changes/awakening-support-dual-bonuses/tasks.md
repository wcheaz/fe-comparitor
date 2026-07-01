# Checklist

## 1. Pre-flight

- [x] **Pre-flight: record quality gate baselines**
  - Scope: no code edits; writes only under `.ralph/baselines/`
  - Change: Capture current state of all gates later tasks require.
  - Done when:
    - `.ralph/baselines/awakening-support-dual-bonuses-test.txt` exists with test output
    - `.ralph/baselines/awakening-support-dual-bonuses-lint.txt` exists with lint output
    - `.ralph/baselines/awakening-support-dual-bonuses-typecheck.txt` exists with typecheck output
    - `.ralph/baselines/awakening-support-dual-bonuses-build.txt` exists with build output
    - every captured gate file ends with a literal `EXIT=<integer>` line
    - `.ralph/baselines/awakening-support-dual-bonuses-readme.md` lists passing/failing gates, exit codes, and exact failing identifiers
  - Stop and hand off if:
    - any gate is nondeterministic across two runs
    - any captured baseline file is missing the `EXIT=<integer>` final line after retrying the capture command

## 2. Core Implementation

- [ ] **Implement Awakening support calculation library**
  - Scope: `lib/supports-awakening.ts` (new)
  - Change: The library correctly implements class lookup maps, Pair Up formulas, Dual Support lookup maps, and Dual Strike/Guard rate formulas, conforming to Awakening specifications.
  - Done when:
    - `lib/supports-awakening.ts` is created and parses without syntax/type errors.
    - Exported functions `calculatePairUpBonuses`, `getDualSupportBonuses`, `calculateDualStrikeRate`, and `calculateDualGuardRate` exist.
    - `npx tsc --noEmit` exits 0, or failures match the pre-flight baseline with no new failures in this task's scope.
  - Stop and hand off if:
    - details of the class mappings or formulas have unresolved conflicts with `hidden/AWAKENING_SUPPORTS_ADDITION.md`

- [ ] **Add unit tests for Awakening support formulas**
  - Scope: `__tests__/lib/supports-awakening.test.ts` (new)
  - Change: A set of automated unit tests covers edge cases for Pair Up bonuses (including stats, classes, support rank modifiers), Dual Support bonuses, and Dual Strike/Guard rates (including skill additions).
  - Done when:
    - `__tests__/lib/supports-awakening.test.ts` contains tests for all 4 exported formulas.
    - Running `npx jest __tests__/lib/supports-awakening.test.ts` exits 0.
  - Stop and hand off if:
    - the unit tests fail to pass after correcting the code implementation
    - the formulas are found to be mathematically ambiguous

## 3. UI Integration

- [ ] **Integrate Awakening support bonuses display in ComparisonGrid**
  - Scope: `components/features/ComparisonGrid.tsx`
  - Change: The support details modal (`renderSupportBonusesModal`) displays Awakening-specific Pair Up, Dual Support, Dual Strike, and Dual Guard stats when units belong to the game "Awakening", and hides the "Affinities" line when neither unit has an affinity.
  - Done when:
    - `rg "import.*supports-awakening" components/features/ComparisonGrid.tsx` exits 0.
    - `rg "game === 'Awakening'" components/features/ComparisonGrid.tsx` exits 0.
    - Running `npx tsc --noEmit` exits 0, or failures match the pre-flight baseline with no new failures in this task's scope.
  - Stop and hand off if:
    - the compilation check fails due to errors in `components/features/ComparisonGrid.tsx`

## 4. Final Quality Gates

- [ ] **Final quality gate: all pre-flight gates pass or match baseline**
  - Scope: full repository; no code edits in this task
  - Change: All repository quality gates are verified clean.
  - Done when:
    - `npm test` exits 0, or failures match the pre-flight baseline with no new failures in the repository.
    - `npm run lint` exits 0, or failures match the pre-flight baseline with no new failures in the repository.
    - `npx tsc --noEmit` exits 0, or failures match the pre-flight baseline with no new failures in the repository.
    - `npm run build` exits 0, or failures match the pre-flight baseline with no new failures in the repository.
  - Stop and hand off if:
    - any new failure identifier appears in any quality gate compared to the pre-flight baseline

## Manual verification (operator-only, post-loop)

> Run after the loop completes and all implementer checkboxes are checked.
> `ralph-run` does NOT iterate on this section. These items exist to give the
> operator a single batched acceptance pass against the finished change.

- [op] **Verify Awakening supports modal in local development server**
  - URL: `http://localhost:3000` (after `npm run dev`)
  - Steps: Open the browser, select Chrom and Robin (M), click on Robin's support pill in Chrom's detail card.
  - Expected: The modal opens successfully, displays Awakening-specific Dual System details (Dual Strike, Dual Guard, Pair Up, and Dual Support), and does not show the "Affinities" row.
  - Save evidence: Capture and inspect screenshots or output if needed.
