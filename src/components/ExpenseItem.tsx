import type { Expense } from '../types';
import styles from './ExpenseItem.module.css';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export default function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  return (
    <li className={styles.item}>
      <div className={styles.details}>
        <span className={styles.description}>{expense.description}</span>
        <span className={styles.amount}>${expense.amount.toFixed(2)}</span>
        <span className={styles.date}>{expense.date}</span>
      </div>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(expense.id)}
        aria-label={`Delete ${expense.description}`}
      >
        Delete
      </button>
    </li>
  );
}
