import { useState } from 'react';
import type { Expense, FormErrors } from '../types';
import styles from './AddExpenseForm.module.css';

interface AddExpenseFormProps {
  onAdd: (expense: Expense) => void;
}

export default function AddExpenseForm({ onAdd }: AddExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'A valid positive amount is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: parseFloat(amount),
      date,
    };

    onAdd(newExpense);

    // Reset all fields and errors
    setDescription('');
    setAmount('');
    setDate('');
    setErrors({});
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <input
          id="description"
          type="text"
          className={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <span id="description-error" className={styles.error} role="alert">
            {errors.description}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="amount" className={styles.label}>
          Amount
        </label>
        <input
          id="amount"
          type="number"
          className={styles.input}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          aria-describedby={errors.amount ? 'amount-error' : undefined}
        />
        {errors.amount && (
          <span id="amount-error" className={styles.error} role="alert">
            {errors.amount}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="date" className={styles.label}>
          Date
        </label>
        <input
          id="date"
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-describedby={errors.date ? 'date-error' : undefined}
        />
        {errors.date && (
          <span id="date-error" className={styles.error} role="alert">
            {errors.date}
          </span>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>
        Add Expense
      </button>
    </form>
  );
}
