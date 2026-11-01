import { useState } from 'react';
import type { Expense } from './types';
import RunningTotal from './components/RunningTotal';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import styles from './App.module.css';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  function addExpense(expense: Expense): void {
    setExpenses((prev) => [...prev, expense]);
  }

  function deleteExpense(id: string): void {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Expense Tracker</h1>
      <RunningTotal expenses={expenses} />
      <AddExpenseForm onAdd={addExpense} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </main>
  );
}

export default App;
