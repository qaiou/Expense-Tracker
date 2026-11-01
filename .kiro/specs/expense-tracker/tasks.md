# Implementation Plan: Expense Tracker

## Overview

Build a single-page React + TypeScript application using Vite, CSS Modules, Vitest, React Testing Library, and fast-check. State lives entirely in `App` via `useState`. Three focused components (`RunningTotal`, `AddExpenseForm`, `ExpenseList`/`ExpenseItem`) are wired together in `App`.

## Tasks

- [x] 1. Scaffold the Vite + React + TypeScript project and define shared types
  - [x] 1.1 Initialise the Vite project with the React-TypeScript template inside the workspace root; install dependencies including `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, and `fast-check`
    - Run `npm create vite@latest . -- --template react-ts` then install extra dev deps
    - Configure `vite.config.ts` to enable the Vitest test environment (`jsdom`) and global `expect`
    - Add `setupTests.ts` that imports `@testing-library/jest-dom`
    - _Requirements: 5.1_

  - [x] 1.2 Create `src/types.ts` with the `Expense` and `FormErrors` interfaces
    - `Expense`: `id: string`, `description: string`, `amount: number`, `date: string`
    - `FormErrors`: optional fields `description?`, `amount?`, `date?`
    - _Requirements: 2.1, 2.2_

- [x] 2. Implement `RunningTotal` component
  - [x] 2.1 Create `src/components/RunningTotal.tsx` and `RunningTotal.module.css`
    - Accept `expenses: Expense[]` as prop
    - Compute `total` with `Array.reduce`; render `Total: $${total.toFixed(2)}` at the top of the page
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 2.2 Write property test for Running Total invariant
    - **Property 1: Running Total Invariant**
    - **Validates: Requirements 1.2, 1.3, 1.4, 4.3**
    - Use `fc.array(fc.record({ id: fc.uuid(), description: fc.string(), amount: fc.float({ min: 0.01 }), date: fc.string() }))` to generate arbitrary expense lists
    - Assert `RunningTotal` renders the exact arithmetic sum for every generated list

- [x] 3. Implement `AddExpenseForm` component
  - [x] 3.1 Create `src/components/AddExpenseForm.tsx` and `AddExpenseForm.module.css`
    - Three controlled inputs: amount (`type="number"`), description (`type="text"`), date (`type="date"`)
    - Local state: `description`, `amount`, `date`, `errors`
    - Validation: description non-empty after trim → "Description is required"; amount parseable AND > 0 → "A valid positive amount is required"; date non-empty → "Date is required"
    - On valid submit: call `onAdd` with a new `Expense` (use `crypto.randomUUID()`), then reset all fields
    - Inline error messages use `role="alert"` for accessibility
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 3.2 Write property test for valid submission adds expense and resets form
    - **Property 2: Valid Submission Adds Expense and Resets Form**
    - **Validates: Requirements 2.2, 2.3**
    - Generate valid `(amount, description, date)` triples; assert that `onAdd` is called exactly once with matching values and form fields are empty afterwards

  - [ ]* 3.3 Write property test for empty description rejection
    - **Property 3: Empty Description Is Rejected**
    - **Validates: Requirements 2.4**
    - Use `fc.stringMatching(/^\s*$/)` to generate blank descriptions; assert `onAdd` is never called and error message appears

  - [ ]* 3.4 Write property test for non-positive amount rejection
    - **Property 4: Non-Positive Amount Is Rejected**
    - **Validates: Requirements 2.5**
    - Use `fc.oneof(fc.float({ max: 0 }), fc.string().filter(s => isNaN(parseFloat(s))))` as amount; assert `onAdd` is never called and error message appears

- [x] 4. Implement `ExpenseItem` and `ExpenseList` components
  - [x] 4.1 Create `src/components/ExpenseItem.tsx` and `ExpenseItem.module.css`
    - Display `description`, `amount` (formatted `$X.XX`), and `date`
    - Render `<button onClick={() => onDelete(expense.id)} aria-label={`Delete ${expense.description}`}>Delete</button>`
    - _Requirements: 3.1, 4.1_

  - [x] 4.2 Create `src/components/ExpenseList.tsx` and `ExpenseList.module.css`
    - If `expenses.length === 0`, render `<p>No expenses added yet.</p>`
    - Otherwise render `<ul>` with one `<ExpenseItem>` per expense, passing `onDelete`
    - _Requirements: 3.1, 3.2, 4.1_

  - [ ]* 4.3 Write property test for expense list item renders required fields and delete button
    - **Property 5: Expense List Item Renders Required Fields and Delete Button**
    - **Validates: Requirements 3.1, 4.1**
    - Generate arbitrary non-empty expense arrays; assert each rendered item shows description, formatted amount, date, and a delete button with the correct `aria-label`

  - [ ]* 4.4 Write property test for delete removes exactly the target expense
    - **Property 6: Delete Removes Exactly the Target Expense**
    - **Validates: Requirements 4.2**
    - Generate arbitrary expense lists with at least one item; pick a random target; assert only that item is removed and all others remain

- [x] 5. Checkpoint — run all tests before wiring
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Wire all components together in `App`
  - [x] 6.1 Implement `src/App.tsx` with `useState<Expense[]>([])`, `addExpense`, and `deleteExpense` handlers
    - Render `<RunningTotal>`, `<AddExpenseForm>`, `<ExpenseList>` in order
    - Pass `expenses` to `RunningTotal` and `ExpenseList`; pass `onAdd` to `AddExpenseForm`; pass `onDelete` to `ExpenseList`
    - Create `src/App.module.css` with basic layout styles
    - _Requirements: 1.1, 2.2, 3.1, 4.2, 5.1, 5.2, 5.3_

  - [ ]* 6.2 Write integration smoke test for `App`
    - Render `<App>`, add one expense end-to-end via React Testing Library `userEvent`, verify it appears in the list and the running total updates
    - _Requirements: 1.3, 2.2, 3.1_

- [x] 7. Final checkpoint — ensure all tests pass
  - Run `npx vitest --run` and confirm all tests are green, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation before the next stage
- Property tests validate universal correctness properties (Properties 1–6 from design.md)
- Unit/integration tests validate specific examples and edge cases
- The app has no persistence — refresh always yields an empty list (Requirement 5.3)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1", "4.1"] },
    { "id": 2, "tasks": ["2.2", "3.2", "3.3", "3.4", "4.2"] },
    { "id": 3, "tasks": ["4.3", "4.4", "6.1"] },
    { "id": 4, "tasks": ["6.2"] }
  ]
}
```
