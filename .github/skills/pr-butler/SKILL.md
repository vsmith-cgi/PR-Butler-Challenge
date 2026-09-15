---
name: PR Butler
description: Automate comprehensive pre-commit / PR preparation — translations, code cleanup, tests, documentation, and quality gates.
---

## Overview

The PR Butler automates the complete pre-commit checklist for web projects, ensuring code is ship-ready before pull request submission. It orchestrates translation fixes, code cleanup, test generation, documentation updates, and quality validation in a single pass.

### When to Invoke

- User runs "prepare for PR" or "pre-commit check"
- User asks to "fix the scaffold" or "make this PR-ready"
- Before any pull request submission

---

## Instructions

### Step 1: Translation Detection & Fix

1. Inspect `scaffold/website/src/translations/en.json` and `scaffold/website/src/translations/fr.json`.
2. Compare the JSON keys in both files.
3. Identify every key that exists in `en.json` but is missing from `fr.json`.
4. Use the English value and the surrounding application context to generate an accurate French translation for each missing key.
5. Add the missing keys to `fr.json`. Preserve all existing French translations and JSON formatting.
6. Do not remove, rename, or modify existing translation keys unless required to correct invalid JSON.
7. Validate that `fr.json` is valid JSON.
8. Validate that `en.json` and `fr.json` contain the same 14 keys.
9. Report the number of missing keys found and the number added.
10. Do not continue to Step 2 if the translation validation fails.

### Step 2: Code Cleanup

1. Inspect the project configuration and `package.json` before choosing formatting or linting commands.
2. Run the project's configured formatter, such as Prettier, against the source files.
3. Run the project's configured lint command.
4. Apply safe auto-fixes for formatting and lint violations.
5. Inspect the source files for remaining style problems that cannot be fixed automatically.
6. Correct the formatting problem in `src/main.ts`, including the indentation and formatting of `handleSubmit()`.
7. Re-run the formatter and linter after making changes.
8. Verify that no critical lint errors remain.
9. Do not continue to Step 3 if the project cannot be formatted or critical lint errors remain.
10. Report the number of files formatted and lint violations fixed.

### Step 3: Test Automation

1. Inspect the existing test configuration and test files before making changes.
2. Run the existing test suite with `npm run test`.
3. Record the initial test results and current coverage when available.
4. Inspect the source code and identify uncovered or insufficiently tested functions.
5. Add meaningful tests for the following functions:
   * `toggleTask`
   * `deleteTask`
   * `setFilter`
   * `render`
   * `saveToStorage`
   * `loadFromStorage`
6. Place new tests in the project's existing test structure and follow the testing conventions already used by the project.
7. Test both normal behavior and important edge cases where practical.
8. Re-run `npm run test` and correct any failing tests.
9. Run `npm run test:coverage` and inspect the resulting coverage report.
10. Add or improve tests until overall coverage is at least 80 percent.
11. Do not remove meaningful existing tests simply to increase coverage.
12. Do not continue to Step 4 if tests fail or coverage remains below 80 percent.
13. Report the initial coverage, final coverage, number of new tests added, and final test result.

### Step 4: Documentation Updates

1. Inspect the existing source documentation and README before making changes.
2. Add clear JSDoc or TSDoc comments to these public functions if they are not already documented:
   * `addTask`
   * `toggleTask`
   * `deleteTask`
   * `setFilter`
   * `render`
   * `init`
   * `setupEventListeners`
   * `handleSubmit`
   * `switchLanguage`
3. Keep documentation accurate and consistent with the actual implementation.
4. Update `scaffold/website/README.md`.
5. Add a `Features` section describing the application's major capabilities.
6. Add a `Testing` section describing how to run the tests and coverage command.
7. Add a `Contributing` section describing the expected development and contribution process.
8. Create or update `CHANGELOG.md` with a concise summary of the changes made during this run.
9. Create or update `PR_REQUEST.md` with:
   * A clear pull request title
   * A summary of the changes
   * A checklist of completed work
   * Test results
   * Final coverage percentage
   * Quality gate results
   * A conventional commit message
10. Preserve useful existing documentation and do not invent project capabilities that are not supported by the source code.
11. Verify that all required documentation files exist before proceeding.
12. Report which functions were documented and which documentation files were created or updated.

### Step 5: Quality Gates

1. Run the complete test suite with `npm run test`.
2. Run the coverage command with `npm run test:coverage`.
3. Run the project's configured lint command and confirm that no critical lint errors remain.
4. Verify that test coverage is at least 80 percent.
5. Verify that all tests pass.
6. Verify that no critical lint errors remain.
7. Verify that all required translation keys are present and that `fr.json` is valid JSON.
8. Verify that the required documentation files and source documentation are complete.
9. Treat any failed quality gate as a blocking failure.
10. If any gate fails, report:
    * The failed gate
    * The command or validation that failed
    * The relevant error or metric
    * The action required to correct it
11. Stop the workflow when a blocking quality gate fails. Do not prepare the final PR as if the project passed.
12. Report a clear PASS or FAIL result for each quality gate.

### Step 6: PR Preparation

1. Review all changes made during Steps 1 through 5.
2. Confirm that the final project state satisfies every item in the Success Criteria.
3. Generate a concise conventional commit message that accurately describes the completed changes.
4. Use an appropriate conventional commit type such as `feat`, `fix`, `test`, `docs`, or `chore` based on the actual changes.
5. Finalize `PR_REQUEST.md` with:
   * A concise pull request title
   * A summary of the changes
   * A summary of testing performed
   * Final coverage percentage
   * Lint status
   * Quality gate status
   * A checklist showing completed deliverables
   * The proposed conventional commit message
6. Do not claim that a quality gate passed unless the corresponding validation was actually performed successfully.
7. Confirm that all Step 4 documentation deliverables are present and complete.
8. Confirm that the project is ready for pull request submission.
9. Report the final commit message and the final status of every required deliverable.
10. Complete the Report Card required by Step 7 after all six workflow steps have finished.

---

## Examples

### Example 1: Full PR Preparation

**Input:** "Make the scaffold PR-ready"

**Expected output:**

```text
PR Butler started.

Step 1: Translation Detection & Fix
PASS
Found 12 missing French translation keys.
Added all 12 translations to fr.json.
Verified that fr.json contains the same 14 keys as en.json.

Step 2: Code Cleanup
PASS
Formatted the source files.
Fixed formatting and lint issues, including handleSubmit().
Lint validation completed successfully.

Step 3: Test Automation
PASS
Ran the existing test suite successfully.
Added tests for toggleTask, deleteTask, setFilter, render,
saveToStorage, and loadFromStorage.
Coverage increased from approximately 30% to at least 80%.
All tests pass.

Step 4: Documentation Updates
PASS
Added JSDoc or TSDoc documentation to the required public functions.
Updated README.md with Features, Testing, and Contributing sections.
Created or updated CHANGELOG.md.
Created or updated PR_REQUEST.md with the required PR information.

Step 5: Quality Gates
PASS
Coverage is at least 80%.
All tests pass.
No critical lint errors remain.
Required translation and documentation checks pass.

Step 6: PR Preparation
PASS
Generated a conventional commit message.
Finalized PR_REQUEST.md.
Confirmed all required deliverables are complete.

Project is ready for pull request submission.
```

### Example 2: Translation-Only Run

**Input:** "Fix the missing French translations"

**Expected output:**

```text
PR Butler translation task started.

Step 1: Translation Detection & Fix
Found the keys present in en.json but missing from fr.json.
Added the missing French translations.
Verified that fr.json is valid JSON.
Verified that both translation files contain the same 14 keys.

Translation result: PASS
12 missing French keys added.

No additional PR preparation steps were requested.
```

---

## Success Criteria

- [ ] All 14 French translation keys present in `fr.json`
- [ ] Code formatted consistently
- [ ] No lint violations
- [ ] Test coverage ≥ 80%
- [ ] All tests pass
- [ ] JSDoc/TSDoc on all public functions
- [ ] `README.md` has Features, Testing, and Contributing sections
- [ ] `CHANGELOG.md` generated
- [ ] `PR_REQUEST.md` generated with summary and checklist
- [ ] Conventional commit message prepared

---

<!-- ⚠️ DO NOT MODIFY ANYTHING BELOW THIS LINE ⚠️ -->
<!-- ================================================ -->
<!-- REPORT CARD — Auto-grading step                  -->
<!-- This step runs automatically after your Skill    -->
<!-- completes. It generates a progress report card   -->
<!-- so you can track how well your Skill is doing.   -->
<!-- ================================================ -->

## Step 7: Report Card (Do Not Modify)

After completing all steps above, generate a **Report Card** summarizing the results. Output the report card in the following exact format:

```
═══════════════════════════════════════════════
  PR BUTLER — REPORT CARD
═══════════════════════════════════════════════

  📋 Step 1: Translation Detection & Fix
     Status:  [PASS / FAIL]
     Details: [X of 14 French keys added to fr.json]

  📋 Step 2: Code Cleanup
     Status:  [PASS / FAIL]
     Details: [X files formatted, X lint violations fixed]

  📋 Step 3: Test Automation
     Status:  [PASS / FAIL]
     Details: [Coverage: X% → Y%, X new test cases added]

  📋 Step 4: Documentation Updates
     Status:  [PASS / FAIL]
     Details: [X functions documented, README updated: Y/N,
               CHANGELOG.md: Y/N, PR_REQUEST.md: Y/N]

  📋 Step 5: Quality Gates
     Status:  [PASS / FAIL]
     Details: [Coverage ≥ 80%: Y/N, Lint clean: Y/N,
               All tests pass: Y/N]

  📋 Step 6: PR Preparation
     Status:  [PASS / FAIL]
     Details: [Commit message: Y/N, PR_REQUEST.md finalized: Y/N]

  ─────────────────────────────────────────────
  OVERALL:   [X / 6 steps passed]
  GRADE:     [A / B / C / F]
             A = 6/6 passed
             B = 5/6 passed
             C = 4/6 passed
             F = 3 or fewer passed
═══════════════════════════════════════════════
```

**Grading rules:**
- A step passes only if ALL its success criteria are met
- Do not skip any step in the report — mark it FAIL if not attempted
- Be honest in the details — the evaluator will verify against actual file contents
- Output this report card as the very last thing your Skill does


After completing all steps above, generate a **Report Card** summarizing the results. Output the report card in the following exact format:

```
═══════════════════════════════════════════════
  PR BUTLER — REPORT CARD
═══════════════════════════════════════════════

  📋 Step 1: Translation Detection & Fix
     Status:  [PASS / FAIL]
     Details: [X of 14 French keys added to fr.json]

  📋 Step 2: Code Cleanup
     Status:  [PASS / FAIL]
     Details: [X files formatted, X lint violations fixed]

  📋 Step 3: Test Automation
     Status:  [PASS / FAIL]
     Details: [Coverage: X% → Y%, X new test cases added]

  📋 Step 4: Documentation Updates
     Status:  [PASS / FAIL]
     Details: [X functions documented, README updated: Y/N,
               CHANGELOG.md: Y/N, PR_REQUEST.md: Y/N]

  📋 Step 5: Quality Gates
     Status:  [PASS / FAIL]
     Details: [Coverage ≥ 80%: Y/N, Lint clean: Y/N,
               All tests pass: Y/N]

  📋 Step 6: PR Preparation
     Status:  [PASS / FAIL]
     Details: [Commit message: Y/N, PR_REQUEST.md finalized: Y/N]

  ─────────────────────────────────────────────
  OVERALL:   [X / 6 steps passed]
  GRADE:     [A / B / C / F]
             A = 6/6 passed
             B = 5/6 passed
             C = 4/6 passed
             F = 3 or fewer passed
═══════════════════════════════════════════════
```

**Grading rules:**
- A step passes only if ALL its success criteria are met
- Do not skip any step in the report — mark it FAIL if not attempted
- Be honest in the details — the evaluator will verify against actual file contents
- Output this report card as the very last thing your Skill does
