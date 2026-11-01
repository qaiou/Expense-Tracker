import { render, screen } from '@testing-library/react';
import App from './App';

describe('App smoke tests', () => {
  it('renders the "Expense Tracker" heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /expense tracker/i })).toBeInTheDocument();
  });

  it('shows "No expenses added yet." on initial render', () => {
    render(<App />);
    expect(screen.getByText('No expenses added yet.')).toBeInTheDocument();
  });

  it('shows "Total: $0.00" on initial render', () => {
    render(<App />);
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument();
  });
});
