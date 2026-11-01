export interface Expense {
  id: string;          // crypto.randomUUID() — unique, stable identifier
  description: string; // non-empty string
  amount: number;      // positive number (parsed from form string input)
  date: string;        // ISO date string "YYYY-MM-DD" from <input type="date">
}

export interface FormErrors {
  description?: string;
  amount?: string;
  date?: string;
}
