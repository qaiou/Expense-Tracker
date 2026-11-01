# Requirements Document

## Introduction

A simple React expense tracker app that allows users to add and delete individual expenses. Each expense captures an amount, description, and date. The app maintains a running total at the top of the page. All data is held in React component state with no persistence to localStorage or any backend — a clean, minimal MVP.

## Glossary

- **Expense Tracker**: The React application being described in this document.
- **Expense**: A single record consisting of an amount, a description, and a date.
- **Expense List**: The collection of all expenses currently held in React state.
- **Running Total**: The sum of all expense amounts currently in the Expense List, displayed at the top of the UI.
- **Add Expense Form**: The UI form through which a user submits a new expense.
- **Delete Button**: A per-expense control that removes that expense from the Expense List.

## Requirements

### Requirement 1: Display Running Total

**User Story:** As a user, I want to see a running total of all my expenses at the top of the page, so that I always know my overall spending at a glance.

#### Acceptance Criteria

1. THE Expense Tracker SHALL display the Running Total at the top of the page.
2. WHEN the Expense List is empty, THE Expense Tracker SHALL display a Running Total of 0.
3. WHEN an Expense is added to the Expense List, THE Expense Tracker SHALL update the Running Total to reflect the new sum of all expense amounts.
4. WHEN an Expense is deleted from the Expense List, THE Expense Tracker SHALL update the Running Total to reflect the new sum of all remaining expense amounts.

---

### Requirement 2: Add an Expense

**User Story:** As a user, I want to submit a new expense with an amount, description, and date, so that I can track my spending.

#### Acceptance Criteria

1. THE Add Expense Form SHALL provide an amount input field, a description input field, and a date input field.
2. WHEN a user submits the Add Expense Form with a valid amount, a non-empty description, and a selected date, THE Expense Tracker SHALL add the new Expense to the Expense List.
3. WHEN a user submits the Add Expense Form, THE Expense Tracker SHALL reset all form fields to their empty or default state after the Expense is added.
4. IF a user submits the Add Expense Form with an empty description, THEN THE Add Expense Form SHALL prevent submission and indicate that the description field is required.
5. IF a user submits the Add Expense Form with an amount that is not a positive number, THEN THE Add Expense Form SHALL prevent submission and indicate that a valid positive amount is required.
6. IF a user submits the Add Expense Form with no date selected, THEN THE Add Expense Form SHALL prevent submission and indicate that the date field is required.

---

### Requirement 3: Display Expense List

**User Story:** As a user, I want to see all my recorded expenses in a list, so that I can review each individual expense.

#### Acceptance Criteria

1. THE Expense Tracker SHALL display each Expense in the Expense List with its description, amount, and date.
2. WHILE the Expense List is empty, THE Expense Tracker SHALL display a message indicating that no expenses have been added yet.

---

### Requirement 4: Delete an Expense

**User Story:** As a user, I want to delete an individual expense from the list, so that I can remove incorrect or unwanted entries.

#### Acceptance Criteria

1. THE Expense Tracker SHALL render a Delete Button for each Expense displayed in the Expense List.
2. WHEN a user activates the Delete Button for an Expense, THE Expense Tracker SHALL remove that Expense from the Expense List.
3. WHEN a user activates the Delete Button for an Expense, THE Expense Tracker SHALL update the Running Total to reflect the removal of that Expense's amount.

---

### Requirement 5: In-Memory State Only

**User Story:** As a user, I want the app to remain simple with no backend or storage dependencies, so that the app works immediately without any setup.

#### Acceptance Criteria

1. THE Expense Tracker SHALL store the Expense List exclusively in React component state.
2. THE Expense Tracker SHALL NOT persist expense data to localStorage, sessionStorage, cookies, or any external backend.
3. WHEN the browser page is refreshed, THE Expense Tracker SHALL initialise with an empty Expense List.
