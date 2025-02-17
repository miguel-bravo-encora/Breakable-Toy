import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// COMMENT: Agregar los tests
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
