# Design Document

## Overview

A single-page React application that lets users record expenses with an amount, description, and date. All state lives in React component state with no external persistence. The UI is composed of three focused components wired together in a root `App` component.

## Architecture

### Technology Stack

- **React 18** (functional components + hooks)
- **Vite** as the build tool / dev server
- **CSS Modules** for scoped component styles (no external CSS framework)
- **Vitest + React Testing Library** for unit and property-based tests
- **fast-check** for property-based testing

### High-Level Component Tree

```
App
├── RunningTotal          (displays sum of all expense amounts)
├── AddExpenseForm        (controlled form; validates and emits new expenses)
└── ExpenseList
    └── ExpenseItem[]     (one per expense; includes delete button)
```

### Data Flow

- All expense state is owned by `App` via `useState<Expense[]>`.
- `App` passes the expense list and callback handlers down as props.
- No context, no global store — plain prop drilling is sufficient at this scale.

## Components and Interfaces

### `App`

**Responsibility:** Root component. Owns `expenses` state. Provides `addExpense` and `deleteExpense` callbacks.

**State:**
```ts
const [expenses, setExpenses] = useState<Expense[]>([]);
```

**Handlers:**
```ts
function addExpense(expense: Expense): void {
  setExpenses(prev => [...prev, expense]);
}

function deleteExpense(id: string): void {
  setExpenses(prev => prev.filter(e => e.id !== id));
}
```

**Props passed down:**
- `RunningTotal`: `expenses`
- `AddExpenseForm`: `onAdd: (expense: Expense) => void`
- `ExpenseList`: `expenses`, `onDelete: (id: string) => void`

---

### `RunningTotal`

**Responsibility:** Compute and display the sum of all expense amounts.

**Props:**
```ts
interface RunningTotalProps {
  expenses: Expense[];
}
```

**Render logic:**
```ts
const total = expenses.reduce((sum, e) => sum + e.amount, 0);
// Display: `Total: $${total.toFixed(2)}`
```

Renders at the top of the page above the form and list.

---

### `AddExpenseForm`

**Responsibility:** Controlled form with three fields. Validates inputs before calling `onAdd`. Resets fields on successful submission.

**Props:**
```ts
interface AddExpenseFormProps {
  onAdd: (expense: Expense) => void;
}
```

**Local state:**
```ts
const [description, setDescription] = useState('');
const [amount, setAmount] = useState('');
const [date, setDate] = useState('');
const [errors, setErrors] = useState<FormErrors>({});
```

**Validation rules:**
| Field | Rule | Error message |
|---|---|---|
| description | Non-empty after trim | "Description is required" |
| amount | Parseable as number AND > 0 | "A valid positive amount is required" |
| date | Non-empty string | "Date is required" |

**Submit flow:**
1. Run validation; if any error, set `errors` state and return early (no `onAdd` call).
2. If valid: call `onAdd` with a new `Expense` object (generate a `crypto.randomUUID()` id).
3. Reset all fields and errors to empty/default.

---

### `ExpenseList`

**Responsibility:** Render the list of expenses or an empty-state message.

**Props:**
```ts
interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}
```

**Render logic:**
- If `expenses.length === 0`, render: `<p>No expenses added yet.</p>`
- Otherwise render an `<ul>` containing one `<ExpenseItem>` per expense.

---

### `ExpenseItem`

**Responsibility:** Display one expense's fields and provide a delete button.

**Props:**
```ts
interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}
```

**Rendered fields:** description, amount (formatted as `$X.XX`), date.  
**Delete button:** `<button onClick={() => onDelete(expense.id)}>Delete</button>` with `aria-label={`Delete ${expense.description}`}`.

## Data Models

### `Expense`

```ts
interface Expense {
  id: string;        // crypto.randomUUID() — unique, stable identifier
  description: string; // non-empty string
  amount: number;    // positive number (parsed from form string input)
  date: string;      // ISO date string "YYYY-MM-DD" from <input type="date">
}
```

### `FormErrors`

```ts
interface FormErrors {
  description?: string;
  amount?: string;
  date?: string;
}
```

### Interaction Flows

#### Add Expense Flow

```
User fills form → clicks "Add Expense"
  → AddExpenseForm.handleSubmit()
    → validate() → errors? show errors, stop
    → no errors? build Expense, call onAdd(expense)
      → App.addExpense() → setExpenses([...prev, expense])
        → RunningTotal re-renders with new sum
        → ExpenseList re-renders with new item
    → reset form fields
```

#### Delete Expense Flow

```
User clicks "Delete" on ExpenseItem
  → ExpenseItem calls onDelete(expense.id)
    → ExpenseList passes up to App.deleteExpense(id)
      → setExpenses(prev.filter(e => e.id !== id))
        → RunningTotal re-renders with updated sum
        → ExpenseList re-renders without deleted item
```

## Error Handling

- **Form validation errors** are displayed inline beneath the relevant input field using `role="alert"` for screen reader accessibility.
- **Invalid amount parsing** (e.g., non-numeric strings) is caught before `parseFloat` by checking `isNaN(parseFloat(value)) || parseFloat(value) <= 0`.
- No async operations are present, so no network error handling is needed.
- Initial state is always an empty array; no error can arise from uninitialized state.

## File Structure

```
src/
  App.tsx
  App.module.css
  components/
    RunningTotal.tsx
    RunningTotal.module.css
    AddExpenseForm.tsx
    AddExpenseForm.module.css
    ExpenseList.tsx
    ExpenseList.module.css
    ExpenseItem.tsx
    ExpenseItem.module.css
  types.ts          ← Expense and FormErrors interfaces
  main.tsx
  index.css
```

## Testing Strategy

**Unit tests** (Vitest + React Testing Library):
- Verify specific UI states: empty-state message, form field presence, initial total of 0.
- Test form validation error messages appear for each invalid input type.
- Integration smoke: render `App`, add an expense end-to-end, verify it appears in the list.

**Property-based tests** (fast-check):
- Target the pure logic layer (total calculation, validation functions) and component behavior across generated inputs.
- Minimum 100 iterations per property.
- Tag format: `Feature: expense-tracker, Property {N}: {property_title}`

**What is NOT property-tested:**
- CSS layout and visual aesthetics (not computable).
- The "state is in React only / no localStorage" constraint (verified by code review).

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Running Total Invariant

*For any* list of expenses, the displayed Running Total SHALL always equal the arithmetic sum of all expense amounts in the list — whether the list is empty, has one item, or has many items, and whether the list was reached by adding or deleting expenses.

**Validates: Requirements 1.2, 1.3, 1.4, 4.3**

---

### Property 2: Valid Submission Adds Expense and Resets Form

*For any* valid combination of (positive amount, non-empty description, non-empty date), submitting the Add Expense Form SHALL add exactly one new expense to the Expense List with matching field values, and SHALL reset all form fields to their empty or default state.

**Validates: Requirements 2.2, 2.3**

---

### Property 3: Empty Description Is Rejected

*For any* string that is empty or composed entirely of whitespace characters, submitting the Add Expense Form with that string as the description SHALL prevent the expense from being added and SHALL leave the Expense List unchanged.

**Validates: Requirements 2.4**

---

### Property 4: Non-Positive Amount Is Rejected

*For any* numeric value that is zero or negative, and for any non-numeric string, submitting the Add Expense Form with that value as the amount SHALL prevent the expense from being added and SHALL leave the Expense List unchanged.

**Validates: Requirements 2.5**

---

### Property 5: Expense List Item Renders Required Fields and Delete Button

*For any* non-empty Expense List, every rendered expense item SHALL display the expense's description, amount, and date, and SHALL include a Delete Button that identifies which expense it controls.

**Validates: Requirements 3.1, 4.1**

---

### Property 6: Delete Removes Exactly the Target Expense

*For any* Expense List and *for any* expense in that list, activating the Delete Button for that expense SHALL remove exactly that expense from the list, leaving all other expenses present and unmodified.

**Validates: Requirements 4.2**
