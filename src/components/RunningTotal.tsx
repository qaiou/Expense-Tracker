import type { Expense } from '../types';
import styles from './RunningTotal.module.css';

interface RunningTotalProps {
  expenses: Expense[];
}

export default function RunningTotal({ expenses }: RunningTotalProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.total}>Total: ${total.toFixed(2)}</h2>
    </div>
  );
}
