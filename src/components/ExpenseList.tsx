import type { Expense } from '../types';
import ExpenseItem from './ExpenseItem';
import styles from './ExpenseList.module.css';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <p className={styles.empty}>No expenses added yet.</p>;
  }

  return (
    <ul className={styles.list}>
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </ul>
  );
}
